<template>
    <div>
        <v-card v-if="fliesStore.flyInfo.vuelo" variant="outlined" width="98%">
            <template v-slot:title>
               Numero de vuelo: # {{ fliesStore.flyInfo.vuelo.numeroVuelo }}
            </template>

            <template v-slot:subtitle>
                {{ fliesStore.flyInfo.aeropuertoOrigen.ciudad }} - {{ fliesStore.flyInfo.aeropuertoDestino.ciudad }}
            </template>

            <template v-slot:text>
               <v-list>
                <v-list-item>
                    Direccion Salida: {{fliesStore.flyInfo.aeropuertoOrigen.direccion  }}
                </v-list-item>
                <v-list-item>
                    Direccion Llegada: {{fliesStore.flyInfo.aeropuertoDestino.direccion  }}
                </v-list-item>
                <v-list-item>
                    Aerolinea: {{fliesStore.flyInfo.aerolinea.nombreAerolinea  }}
                </v-list-item>
                <v-list-item>
                    Fecha: {{fliesStore.flyInfo.vuelo.horaSalida  }} Duracion: {{ fliesStore.flyInfo.vuelo.duracionViaje }} min
                </v-list-item>
               </v-list>
            </template>

        </v-card>
    </div>
</template>
<script>
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { getFly } from '@/services/listFlies.js'
import { useFliesStore } from '@/stores/flies'
export default {
    setup() {
        const fliesStore = useFliesStore();
        const route = useRoute();
        const id = route.params.idVuelo;

        const getFlyInfo = async () => {
            const flyInfo = await getFly(id)
            console.log(flyInfo[0])
            fliesStore.setFlyInfo(flyInfo[0])
        }

        onMounted(() => {
            getFlyInfo()
        })

        return {
            fliesStore
        }
    }
}
</script>
<style></style>