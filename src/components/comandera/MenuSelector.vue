<template>
    <div id="listadoMenus">
        <div id="contenedorBotones">
            <div v-for="(item,key) in listadoMenus" :key="key" class="botonIndividual">
                <v-btn @click="setMenuSeleccionado(item.productos)" block size="large">{{ item.nombre }}</v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { supabase } from '@/plugins/supabase'
import {useComanderaStore} from '@/stores/comandera'

export default {
    setup() {
        const comanderaStore = useComanderaStore()
        const listadoMenus = ref([])
        const idsucursal = localStorage.getItem("sucursal")

        const setMenuSeleccionado = (listadoProductos) => {
            comanderaStore.setMostrarProductos(true);
            comanderaStore.setListadoProductos(listadoProductos)
        }

        const getMenus = async () => {
            const {  data: datamenu , error } = await supabase.rpc('getmenu', { pidsucursal: idsucursal });
            if (!error) {
                listadoMenus.value = datamenu;
                const { data: dataproductos, error } = await supabase
                    .from('productos_sucursales')
                    .select('idmenu,productos(*)')
                    .eq('idsucursal', idsucursal);
                if (!error) {
                    for(const menu of listadoMenus.value){
                        menu.productos = dataproductos.filter(item => item.idmenu === menu.idmenu)
                    }
                }
            }
            
        }

        onMounted(() => {
            getMenus()
        })

        return {
            listadoMenus,
            setMenuSeleccionado
        }
    }

}
</script>

<style scoped>
.botonIndividual {
    margin-top: 5%;
    margin-bottom: 5%;
    width: 100%;
}

#contenedorBotones {
    width: 95%;
    height: 90%;
}

#listadoMenus {
    height: 100%;
    background-color: rgb(128, 128, 128, 0.7);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
}
</style>