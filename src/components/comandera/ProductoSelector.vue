<template>
    <div id="selectorProductos">
        <div id="contenedorBotonCerrar">
            <v-icon @click="toogleProductoSelector" icon="mdi mdi-close" size="65" />
        </div>
        <div id="contenedorTarjetas">
            <v-col style="height: 100%;" cols="12">
                <v-row id="filadeTarjetas">
                    <v-col v-for="(producto, index) in comanderaStore.listadoProductos" :key="index" cols="6">
                        <v-card>
                            <v-img :src="producto.productos.url" class="align-end"
                                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px" cover>
                                <v-card-title class="text-white">{{ producto.productos.nombre }}</v-card-title>
                            </v-img>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn @click="modifyProduct(producto.productos, 'minus')"
                                    :disabled="getCantidadActualDelProducto(producto.productos) == 0" size="small"
                                    color="surface-variant" variant="text" icon="mdi mdi-minus"></v-btn>
                                <v-btn size="small" color="surface-variant" variant="text">{{
                                    getCantidadActualDelProducto(producto.productos) }}</v-btn>
                                <v-btn @click="modifyProduct(producto.productos, 'add')" size="small"
                                    color="surface-variant" variant="text" icon="mdi mdi-plus"></v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </div>
    </div>
</template>

<script>
import { onMounted } from 'vue';
import { useComanderaStore } from '@/stores/comandera'
import toaster from '@/plugins/toaster';
export default {
    setup() {

        const comanderaStore = useComanderaStore();

        const toogleProductoSelector = () => {
            comanderaStore.toggleMostrarProductos();
        }

        const getCantidadActualDelProducto = (itemProducto) => {
            const listadoProductosActual = comanderaStore.ubicacionSeleccionada.productos
            //busco al producto
            const existeProductosEnLaOrden = listadoProductosActual.find(producto => producto.idproducto === itemProducto.idproducto)
            //si existe traigo la cantidad
            if (existeProductosEnLaOrden != null && existeProductosEnLaOrden != undefined) {
                return existeProductosEnLaOrden.cantidad
            } else {
                return 0;
            }
        }

        //esta funcion existe igual en el componente detalle comanda
        const modifyProduct = (itemProducto, tipo) => {
            if (comanderaStore.ubicacionSeleccionada.idmesa != null
                && comanderaStore.ubicacionSeleccionada.idmesa != 0) {
                let listadoProductosActual = comanderaStore.ubicacionSeleccionada.productos
                //voy a buscar si ya hay añadido uno en el listado de la store
                const existeProductosEnLaOrden = listadoProductosActual.find(producto => producto.idproducto === itemProducto.idproducto)
                if (existeProductosEnLaOrden != null && existeProductosEnLaOrden != undefined) {
                    //si hay uno añadido, hay que mutar la cantidad
                    if(tipo == 'minus' && existeProductosEnLaOrden.cantidad === existeProductosEnLaOrden.cantidadMinima){
                        toaster.error(`No es posible eliminar productos que ya estan en preparación`);
                        return false
                    }
                    tipo == 'add' ? existeProductosEnLaOrden.cantidad++ : existeProductosEnLaOrden.cantidad--;
                    if (existeProductosEnLaOrden.cantidad === 0) {
                        //si la cantidad de uno existente se reduce a 0, se elimina del listado
                        comanderaStore.ubicacionSeleccionada.productos =
                            listadoProductosActual.filter(producto => producto.idproducto !== existeProductosEnLaOrden.idproducto)
                    }
                } else {
                    //si no hay, se añade
                    const cantidad = 1;
                    listadoProductosActual.push({ ...itemProducto, cantidad })
                }
            } else {
                toaster.error(`Se debe seleccionar una ubicación`);
            }
        }


        onMounted(() => {

        })

        return {
            toogleProductoSelector,
            modifyProduct,
            getCantidadActualDelProducto,
            comanderaStore
        }
    }

}
</script>

<style scoped>
#filadeTarjetas{
    height: 100%; 
    overflow-y: scroll;
}
#contenedorBotonCerrar:hover {
    color: black;
}

#contenedorBotonCerrar {
    height: 10%;
    color: white;
}

#contenedorTarjetas {
    height: 85%;
    width: 96%;
}

#selectorProductos {
    height: 100%;
    background-color: rgb(128, 128, 128, 0.7);
    border-radius: 10%;
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    justify-content: flex-start;
}</style>