<template>
    <div id="detalleComanda">
        <h1 id="intrucciones">
            - {{ comanderaStore.ubicacionSeleccionada.nombreMesa }} -
        </h1>
        <div id="contenedorProductosSeleccionados">
            <v-table id="tablaProductos" height="100%">
                <thead>
                    <tr>
                        <th class="text-center">
                            Producto
                        </th>
                        <th class="text-center">
                            Cantidad
                        </th>
                        <th class="text-center">
                            Precio
                        </th>
                        <th class="text-center">
                            Observaciones
                        </th>
                        <th class="text-center">
                            Opciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(producto, index) in comanderaStore.ubicacionSeleccionada.productos" :key="index">
                        <td class="text-center">
                            {{ producto.nombre }}
                        </td>
                        <td class="text-center">
                            {{ producto.cantidad }}
                        </td>
                        <td class="text-center">
                            {{ getPrecioPorCantidad(producto.cantidad, producto.precio) }}
                        </td>
                        <td class="text-center">
                            {{ producto.observaciones}}
                        </td>
                        <td class="text-center">
                            <v-btn-toggle>
                                <v-btn @click="editarComentario(producto)">
                                    <v-icon>mdi mdi-comment</v-icon>
                                </v-btn>
                                <v-btn @click="modifyProduct(producto, 'minus')">
                                    <v-icon>mdi mdi-minus</v-icon>
                                </v-btn>
                                <v-btn @click="modifyProduct(producto, 'add')">
                                    <v-icon>mdi mdi-plus</v-icon>
                                </v-btn>
                            </v-btn-toggle>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </div>
        <div id="contenedorTotal">
            <div id="total">
                <span>Total: ${{ getTotalOrden }}</span>
            </div>
        </div>
        <v-container fluid>
            <v-col cols="12">
                <v-row>
                    <v-col cols="6">
                        <v-btn block size="large" color="error" @click="cancelarOrden">Cancelar</v-btn>
                    </v-col>
                    <v-col cols="6">
                        <v-btn block size="large" color="primary" @click="guardarOrden">Guardar</v-btn>
                    </v-col>
                    <v-col cols="6">
                        <v-btn block size="large" color="secondary" @click="generarTicket">Generar Ticket</v-btn>
                    </v-col>
                    <v-col cols="6">
                        <v-btn block size="large" color="info">opciones</v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </v-container>
        <formulario-comentarios :abrirComentarios="abrirComentarios" :producto="productoEditar" />
    </div>
</template>

<script>
import { onBeforeMount, computed, ref } from 'vue';
import { useComanderaStore } from '@/stores/comandera'
import { supabase } from '@/plugins/supabase';
import emitter from '@/plugins/mitt';
import toaster from '@/plugins/toaster';
import FormularioComentarios from './FormularioComentarios.vue';
import router from '@/plugins/router';

export default {
    setup() {
        const comanderaStore = useComanderaStore();
        const abrirComentarios = ref(false)
        const productoEditar = ref({})

        const getPrecioPorCantidad = (cantidad, precio) => {
            return (cantidad * precio);
        };
        //esta funcion existe en producto selector
        const modifyProduct = (itemProducto, tipo) => {
            if (comanderaStore.ubicacionSeleccionada.idmesa != null
                && comanderaStore.ubicacionSeleccionada.idmesa != 0) {
                let listadoProductosActual = comanderaStore.ubicacionSeleccionada.productos;
                //voy a buscar si ya hay añadido uno en el listado de la store
                const existeProductosEnLaOrden = listadoProductosActual.find(producto => producto.idproducto === itemProducto.idproducto);
                if (existeProductosEnLaOrden != null && existeProductosEnLaOrden != undefined) {
                    //si hay uno añadido, hay que mutar la cantidad
                    if (tipo == 'minus' && existeProductosEnLaOrden.cantidad === existeProductosEnLaOrden.cantidadMinima) {
                        toaster.error(`No es posible eliminar productos que ya estan en preparación`);
                        return false;
                    }
                    tipo == 'add' ? existeProductosEnLaOrden.cantidad++ : (existeProductosEnLaOrden.cantidad--);
                    if (existeProductosEnLaOrden.cantidad === 0) {
                        //si la cantidad de uno existente se reduce a 0, se elimina del listado
                        comanderaStore.ubicacionSeleccionada.productos =
                            listadoProductosActual.filter(producto => producto.idproducto !== existeProductosEnLaOrden.idproducto);
                    }
                }
                else {
                    //si no hay, se añade
                    const cantidad = 1;
                    listadoProductosActual.push({ ...itemProducto, cantidad });
                }
            }
            else {
                toaster.error(`Se debe seleccionar una ubicación`);
            }
        };
        const generarComanda = async () => {
            if (comanderaStore.ubicacionSeleccionada.idComanda == 0) {
                const { data, error } = await supabase
                    .from('comandas')
                    .insert({
                    fecha: new Date(),
                    idsucursal: localStorage.getItem("sucursal"),
                    esllevar: 0,
                    esaplicacion: 0,
                    idmesa: comanderaStore.ubicacionSeleccionada.idmesa,
                    finalizada: 0
                })
                    .select();
                if (!error) {
                    comanderaStore.setComandaAsignada(data[0].idcomanda);
                    //se manda a bloquear la mesa asignada
                    const { error } = await supabase
                        .from('mesas_ubicaciones')
                        .update({ ocupada: 1 })
                        .eq('idmesa', comanderaStore.ubicacionSeleccionada.idmesa);
                    if (error) {
                        toaster.error("Ha ocurrido un error al bloquear la mesa");
                    }
                }
            }
        };
        const clearComandera = () => {
            comanderaStore.setComandaAsignada(0);
            comanderaStore.setProductos([]);
        };
        const getComandaActual = async () => {
            const { data: dataComanda, error } = await supabase
                .from('comandas')
                .select('*, comandas_productos(*,productos(*))')
                .eq('idmesa', comanderaStore.ubicacionSeleccionada.idmesa)
                .eq('finalizada', 0);
            if (!error) {
                const comandaActual = dataComanda.length > 0 ? dataComanda[0] : {};
                if (Object.keys(comandaActual).length > 0) {
                    comanderaStore.setComandaAsignada(comandaActual.idcomanda);
                    if (comandaActual.comandas_productos.length > 0) {
                        const arregloProductosExistentes = [];
                        for (const producto of comandaActual.comandas_productos) {
                            const { cantidad, observaciones } = producto;
                            const cantidadMinima = cantidad;
                            const elemento = producto.productos;
                            arregloProductosExistentes.push({ ...elemento, cantidad, cantidadMinima, observaciones });
                        }
                        comanderaStore.setProductos(arregloProductosExistentes);
                    }
                }
                else {
                    clearComandera();
                }
            }
        };
        const guardarOrden = async () => {
            const { productos } = comanderaStore.ubicacionSeleccionada;
            if (productos.length === 0) {
                toaster.error(`Debe agregar al menos un producto`);
                return;
            }
            await generarComanda();
            const { idComanda } = comanderaStore.ubicacionSeleccionada;
            const payload = productos.map((producto) => {
                const { idproducto, cantidad, observaciones } = producto;
                return {
                    idcomanda: idComanda,
                    idproducto: idproducto,
                    cantidad: cantidad,
                    observaciones: (observaciones ? observaciones : ""),
                    finalizado: 0,
                };
            });
            const { error } = await supabase
                .from('comandas_productos')
                .upsert(payload, { onConflict: ['idcomanda', 'idproducto'] });
            if (error) {
                console.error(error);
                toaster.error(`Ha ocurrido un error al generar la orden`);
                return;
            }
            getComandaActual();
            emitter.emit('getUbicaciones');
            toaster.success(`Orden colocada/actualizada exitosamente`);
        };

        const getTotalOrden = computed(() => {
            let total = 0;
            comanderaStore.ubicacionSeleccionada.productos.forEach((producto) => {
                total = (total + getPrecioPorCantidad(producto.cantidad, producto.precio));
            });
            return total;
        });

        const cancelarOrden = async () => {
            if (comanderaStore.ubicacionSeleccionada.idComanda > 0 && comanderaStore.ubicacionSeleccionada.idmesa > 0) {
                if (confirm("¿Realmente desea cancelar la orden?")) {
                    const { error } = await supabase
                        .from('comandas')
                        .update({ finalizada: 1, cancelada: 1, fechafinalizacion: new Date() })
                        .eq("idcomanda", comanderaStore.ubicacionSeleccionada.idComanda);
                    if (!error) {
                        const { error } = await supabase
                            .from('mesas_ubicaciones')
                            .update({ ocupada: 0 })
                            .eq('idmesa', comanderaStore.ubicacionSeleccionada.idmesa);
                        if (!error) {
                            emitter.emit('getUbicaciones');
                            clearComandera()
                            toaster.success(`Orden cancelada exitosamente`);
                        }
                    }
                }
            }
            else {
                toaster.info("Debe seleccionar una comanda");
            }
        };

        const editarComentario = async (producto) => {
            abrirComentarios.value = true;
            productoEditar.value = producto;
        }

        const closeModalComentarios = () => {
            abrirComentarios.value = false;
            productoEditar.value = {};
        }

        const guardarComentarios = (comentario) => {
            productoEditar.value.observaciones = comentario.comentario;
        }

        const generarTicket = () => {
            router.push({name: 'ticket'})
        }

        onBeforeMount(() => {
            emitter.on('requestGetComanda', () => {
                getComandaActual();
            });

            emitter.on('closeModalComentarios', () => {
                closeModalComentarios();
            });

            emitter.on('guardarComentarios', (evt) => {
                guardarComentarios(evt);
                closeModalComentarios()
            });

        });
        return {
            editarComentario,
            guardarOrden,
            getPrecioPorCantidad,
            modifyProduct,
            cancelarOrden,
            generarTicket,
            comanderaStore,
            getTotalOrden,
            abrirComentarios,
            productoEditar
        };
    },
    components: { FormularioComentarios }
}
</script>

<style scoped>
#total {
    display: flex;
    height: 100%;
    background-color: white;
    width: 25%;
    font-size: 18px;
    vertical-align: middle;
    margin-right: 1vw;
    align-items: center;
    justify-content: center;
}

#contenedorTotal {
    display: flex;
    width: 100%;
    height: 10%;
    flex-direction: row;
    align-content: center;
    justify-content: flex-end;
    align-items: center;
}

#tablaProductos {
    width: 95%;
    margin: auto;
    height: 40vh;
}

#contenedorProductosSeleccionados {
    width: 100%;
    height: 50%;
    margin-top: 2%;
}

#intrucciones {
    color: white;
    text-align: center;
}

#detalleComanda {
    height: 100%;
    background-color: rgb(128, 128, 128, 0.7);
    width: 97%;
    border-radius: 10%;
}
</style>