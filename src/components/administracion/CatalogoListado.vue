<template>
    <div id="catalogoListado">
        <div id="filtrosContenedor">
            <div style="width: 20%;">
                <v-select v-show="mostrarFiltro" v-model="valorFiltro" density="compact" color="primary"
                    :label="tituloFiltro" :items="listadoFiltro" item-title="nombre" item-value="idsucursal"
                    variant="solo-filled" v-on:update:model-value="changeSucursalBusqueda"></v-select>
            </div>
            <div>
                <v-btn size="large" @click="abrirModalDisponible">Crear nuev(o|a) {{ tituloTabla }}</v-btn>
            </div>
        </div>
        <div id="contenedorTabla">
            <v-card flat :title="tituloTabla">
                <template v-slot:text>
                    <v-text-field label="Buscar" v-model="search" prepend-inner-icon="mdi-magnify" single-line
                        variant="outlined" hide-details></v-text-field>
                </template>

                <v-data-table height="40vh" :headers="cabeceros" :items="listadoItems" :search="search">

                    <template v-slot:[`item.mesas_ubicaciones`]="{ item }">
                        <td>
                            {{ item.nombre }}
                        </td>
                    </template>

                    <template v-slot:[`item.idsucursal`]="{ item }">
                        <td>
                            {{ item.idsucursal + '-' + getNombreSucursal(item.idsucursal) }}
                        </td>
                    </template>

                    <template v-slot:[`item.idzona`]="{ item }">
                        <td>
                            {{ item.idzona + '-' + getNombreZona(item.idzona) }}
                        </td>
                    </template>

                    <template v-slot:[`item.sucursalmovil`]="{ item }">
                        <td>
                            {{ getNombreBooleano(item.sucursalmovil) }}
                        </td>
                    </template>

                    <template v-slot:[`item.ocupada`]="{ item }">
                        <td>
                            {{ getNombreBooleano(item.ocupada) }}
                        </td>
                    </template>

                    <template v-slot:[`item.visible`]="{ item }">
                        <td>
                            {{ getNombreBooleano(item.visible) }}
                        </td>
                    </template>

                    <template v-slot:[`item.esvirtual`]="{ item }">
                        <td>
                            {{ getNombreBooleano(item.esvirtual) }}
                        </td>
                    </template>

                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon v-if="item.activo!=0" size="small" class="me-2" @click="editItem(item)">
                            mdi-pencil
                        </v-icon>
                        <v-icon v-if="item.activo!=0" size="small" @click="deleteItem(item)">
                            mdi-delete
                        </v-icon>
                    </template>
                </v-data-table>
            </v-card>
        </div>
        <UsuarioForm v-if="catalogoCargado.value =='usuarios'" />
        <SucursalForm v-if="catalogoCargado.value =='sucursales'" />
    </div>
</template>
<script>
import { ref, onBeforeMount } from 'vue'
import { supabase } from '@/plugins/supabase'
import emitter from '@/plugins/mitt';
import { primeraLetraMayuscula, eliminarRepetidos } from '@/util/functions'
import { getidUserLoggedInfo } from '@/util/loggedUser'
import UsuarioForm from '@/components/administracion/UsuarioForm.vue'
import SucursalForm from './SucursalForm.vue';
export default {
    components:{
    UsuarioForm,
    SucursalForm
},
    setup() {
        const tituloTabla = ref('')
        const search = ref('')
        const cabeceros = ref([])
        const listadoItems = ref([])
        const mostrarFiltro = ref(false);
        const listadoFiltro = ref([])
        const valorFiltro = ref(null)
        const tituloFiltro = ref('')
        const catalogoCargado = ref({})
        const listadoOriginalSinFiltrar = ref([])

        const editItem = (item) => {
            emitter.emit("editItem",item)
        }

        const deleteItem = (item) => {
            emitter.emit("deleteItem",item)
        }

        const abrirModalDisponible = () => {
            emitter.emit("abrirModal")
        }

        const changeSucursalBusqueda = () => {
            getCatalagoList(catalogoCargado.value)
        }

        const getNombreSucursal = (idsucursal) => {
            const sucursal = listadoOriginalSinFiltrar.value.find(item => item.idsucursal == idsucursal);
            if (sucursal) {
                return sucursal.nombre;
            } else {
                return "Sucursal no encontrada";
            }
        }

        const getNombreZona = (idzona) => {
            const zonaEncontrada = listadoOriginalSinFiltrar.value.find(item => item.idzona == idzona);
            if (zonaEncontrada) {
                return zonaEncontrada.nombre;
            } else {
                return "Zona no encontrada";
            }
        }

        const getNombreBooleano = (valor) => {
            return valor != 1 ? 'No' : 'Si'
        }

        const getValueFromSesion = (idaBuscar, dondeBuscar) => {
            let variableSesion = null;
            if (idaBuscar !== 'idsucursal') {
                variableSesion = JSON.parse(localStorage.getItem(dondeBuscar));
                return variableSesion[idaBuscar]
            } else {
                return valorFiltro.value != null ? valorFiltro.value : localStorage.getItem(dondeBuscar)
            }
        }

        const getCatalagoList = async (valueCatalogo) => {

            let tablaPrincipal = null;
            let subquery = null;

            switch (valueCatalogo.value) {
                case 'ubicaciones':
                    tablaPrincipal = 'zonas'
                    subquery = '*, mesas_ubicaciones(*)'
                    break;

                case 'menus':
                    tablaPrincipal = 'productos_sucursales'
                    subquery = 'menus(*)'
                    break;

                case 'productos':
                    tablaPrincipal = 'productos_sucursales'
                    subquery = 'productos(*)'
                    break;


                default:
                    tablaPrincipal = valueCatalogo.value
                    subquery = ''
                    break;
            }

            const { data, error } = await supabase
                .from(tablaPrincipal)
                .select(subquery)
                .eq(valueCatalogo.id, getValueFromSesion(valueCatalogo.id, valueCatalogo.idsesion));
            if (!error) {
                listadoOriginalSinFiltrar.value = data;
                if (data.length > 0) {
                    if (valueCatalogo.value == 'ubicaciones') {
                        cabeceros.value = Object.keys(data[0].mesas_ubicaciones[0])
                        cabeceros.value = cabeceros.value.map((item) => { return { key: item, title: primeraLetraMayuscula(item) } })
                        cabeceros.value.push({ key: "actions", title: "Opciones" })
                        let arregloTemporal = [];
                        data.map((item) => { arregloTemporal = [...arregloTemporal, ...item.mesas_ubicaciones] })
                        listadoItems.value = arregloTemporal
                    } else if (valueCatalogo.value == 'menus') {
                        cabeceros.value = Object.keys(data[0].menus)
                        cabeceros.value = cabeceros.value.map((item) => { return { key: item, title: primeraLetraMayuscula(item) } })
                        cabeceros.value.push({ key: "actions", title: "Opciones" })
                        let arregloTemporal = [];
                        data.map((item) => { arregloTemporal.push(item.menus) })
                        arregloTemporal = eliminarRepetidos(arregloTemporal, 'idmenu')
                        listadoItems.value = arregloTemporal
                    } else if (valueCatalogo.value == 'productos') {
                        cabeceros.value = Object.keys(data[0].productos)
                        cabeceros.value = cabeceros.value.map((item) => { return { key: item, title: primeraLetraMayuscula(item) } })
                        cabeceros.value.push({ key: "actions", title: "Opciones" })
                        let arregloTemporal = [];
                        data.map((item) => { arregloTemporal.push(item.productos) })
                        listadoItems.value = arregloTemporal
                    } else {
                        cabeceros.value = Object.keys(data[0])
                        cabeceros.value = cabeceros.value.map((item) => { return { key: item, title: primeraLetraMayuscula(item) } })
                        cabeceros.value.push({ key: "actions", title: "Opciones" })
                        listadoItems.value = data
                    }

                } else {
                    listadoItems.value = []
                }
            }
        }


        const getSucursalesUsuario = async (evt) => {
            const { data, error } = await supabase
                .from('usuarios_sucursales')
                .select('sucursales(*)')
                .eq('idusuario', getidUserLoggedInfo());
            if (!error) {
                listadoFiltro.value = data.map((item) => {
                    return {
                        nombre: item.sucursales.nombre,
                        idsucursal: item.sucursales.idsucursal
                    }
                })
                valorFiltro.value = parseInt(localStorage.getItem(evt.idsesion))
            }
        }


        const evaluarRequiereFiltro = (evt) => {
            mostrarFiltro.value = (evt.requiereFiltro === 1) ? true : false
            switch (evt.id) {
                case 'idsucursal':
                    getSucursalesUsuario(evt)
                    tituloFiltro.value = "Sucursal"
                    break;

                default:
                    break;
            }

        }

        const setCatalogo = async (evt) => {
            tituloTabla.value = evt.nombre
            catalogoCargado.value = evt
            evaluarRequiereFiltro(evt)
            getCatalagoList(evt)
        }

        onBeforeMount(() => {
            emitter.on('setCatalogo', (evt) => {
                setCatalogo(evt)
            });

            emitter.on('rechargeCatalogo', () => {
                getCatalagoList(catalogoCargado.value)
            });

        });

        return {
            valorFiltro,
            mostrarFiltro,
            tituloTabla,
            search,
            cabeceros,
            listadoItems,
            listadoFiltro,
            tituloFiltro,
            catalogoCargado,
            changeSucursalBusqueda,
            getNombreSucursal,
            getNombreZona,
            getNombreBooleano,
            abrirModalDisponible,
            deleteItem,
            editItem
        }
    }
}
</script>
<style>
#filtrosContenedor {
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
    margin-bottom: 2%;
}

#contenedorTabla {
    width: 90%
}

#catalogoListado {
    height: 100%;
    background-color: rgb(128, 128, 128, 0.7);
    width: 99%;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
}
</style>