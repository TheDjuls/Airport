<template>
    <div id="listadoUbicaciones">
        <h1 id="intrucciones">
            - Seleccione una ubicación -
        </h1>
        <div id="contenedorUbicaciones">
            <div style="margin-top:2%" v-for="(value, key) in listadoUbicaciones" :key="key">
                <h3 class="zona">{{ value.nombre }}</h3>
                <v-divider></v-divider>
                <div class="zonaubicaciones">
                    <div @click="seleccionarUbicacion(value)"  v-for="(value, key) in value.ubicaciones" :key="key" class="ubicacion">
                        <v-icon :class="(value.ocupada == 1 ? 'iconoImgOcupada' : 'iconoImg')" icon="mdi mdi-table-furniture" size="65" />
                        <h4>{{ value.nombre }}</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref, onBeforeMount } from 'vue';
import { supabase } from '@/plugins/supabase'
import {useComanderaStore} from '@/stores/comandera'
import emitter from '@/plugins/mitt';
export default {
    setup() {
        const comanderaStore = useComanderaStore();
        const listadoUbicaciones = ref([])

        const getUbicaciones = async () => {
            let listadoTemporal = []
            const idsucursal = localStorage.getItem("sucursal")
            const { data, error } = await supabase
                .from('zonas')
                .select()
                .eq('idsucursal', idsucursal);
            if (!error) {
                listadoTemporal = data
                for (const zona of listadoTemporal) {
                    const { data, error } = await supabase
                        .from('mesas_ubicaciones')
                        .select()
                        .eq('idzona', zona.idzona);
                    if (!error) {
                        zona["ubicaciones"] = data
                    }
                }
            }
            listadoUbicaciones.value = listadoTemporal
        }

        const requestGetComanda = () => {
            emitter.emit('requestGetComanda')
        }

        const seleccionarUbicacion = (ubicacion) => {
            comanderaStore.setMesa(ubicacion.idmesa, ubicacion.nombre)
            requestGetComanda()
        }

        onMounted(() => {
            getUbicaciones()
        })

        onBeforeMount(() => {
            emitter.on('getUbicaciones', () => {
                getUbicaciones()
            })
        })

        return {
            seleccionarUbicacion,
            getUbicaciones,
            listadoUbicaciones
        }
    }

}
</script>

<style scoped>
.zonaubicaciones{
    margin: auto;
    display: flex;
    align-content: center;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
}

#intrucciones {
    color: white;
}

.zona {
    color: white;
}

.ubicacion {
    color: white;
    margin-inline: 4%;
}

.iconoImg {
    color: white;
}

.iconoImgOcupada {
    color: #A24936;
}


#contenedorUbicaciones {
    height: 85%;
    margin-top: 5%;
    overflow-y: auto;
}

#listadoUbicaciones {
    height: 100%;
    background-color: rgb(128, 128, 128, 0.7);
    border-radius: 10%;
    text-align: center;
}
</style>