<template>
    <div>
        <v-container>
            <v-col cols="12">
                <v-data-iterator :items="fliesStore.listFlies" :page="page">
                    <template v-slot:default="{ items }">
                        <template v-for="(item, i) in items " :key="i">
                            <v-row class="registerRow">
                                <v-col cols="5" class="d-flex flex-row">
                                    <div class="horarioContainer d-flex flex-column justify-center align-center">
                                        <div class="text-h6">{{ getHourTimeStamp(item.raw.vuelo.horaSalida) }}</div>
                                        <div class="text-caption">{{ item.raw.aeropuertoOrigen.ciudad }}</div>
                                    </div>
                                    <div class="horarioContainer d-flex justify-center align-center">
                                        <v-icon icon="mdi-airplane"></v-icon>
                                    </div>
                                    <div class="horarioContainer d-flex flex-column justify-center align-center">
                                        <div class="text-h6">{{ addTimeToADate(item.raw.vuelo.horaSalida,
                                            item.raw.vuelo.duracionViaje) }}</div>
                                        <div class="text-caption">{{ item.raw.aeropuertoDestino.ciudad }}</div>
                                    </div>
                                </v-col>
                                <v-col cols="5" class="d-flex flex-row">
                                    <div class="horarioContainer d-flex flex-column justify-center align-center">
                                        <div class="text-caption">Duracion</div>
                                        <div class="text-h6">{{ item.raw.vuelo.duracionViaje }} Min</div>
                                    </div>
                                    <div class="horarioContainer d-flex flex-column justify-center align-center">
                                        <div class="text-caption">Num. Vuelo</div>
                                        <div class="text-h6">{{ item.raw.vuelo.numeroVuelo }}</div>
                                    </div>
                                    <div class="horarioContainer d-flex flex-column justify-center align-center">
                                        <div class="text-caption">Aerolinea</div>
                                        <div class="text-h6">{{ item.raw.aerolinea.nombreAerolinea }}</div>
                                    </div>
                                </v-col>
                                <v-col cols="2" class="d-flex flex-row">
                                    <div class="horarioContainer d-flex flex-column justify-center align-center">
                                        <div class="text-caption">Tarifa Basica</div>
                                        <div class="text-h6">$ {{ item.raw.vuelo.precioBase.toFixed(2) }} </div>
                                        <v-btn :disabled="isSelectable(item.raw)" color="primary" variant="outlined" density="compact" @click="selectFly(item.raw)">
                                            Seleccionar
                                        </v-btn>
                                    </div>
                                </v-col>
                            </v-row>
                        </template>
                    </template>
                </v-data-iterator>
            </v-col>
        </v-container>
    </div>
</template>
<script>
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFliesStore } from '@/stores/flies'
import { getHourTimeStamp, addTimeToADate } from '@/util/dates.js'
import moment from 'moment';
export default {
    setup() {
        //variables
        const fliesStore = useFliesStore();
        const router = useRouter();
        const page = ref(1)
        //methods

        const selectFly = (vueloInf) => {
            router.push({name:'configFly', params:{idVuelo:vueloInf.vuelo.id}})
        }

        const isSelectable = (vueloInf) => {
            const ahora = moment();
            const horaVuelo = moment(vueloInf.vuelo.horaSalida)
            const diferencia = moment.duration(horaVuelo.diff(ahora));
            const horasFaltantes = Math.ceil(diferencia.asHours());
            console.log(horasFaltantes)
            if(horasFaltantes > 3){
                return false
            }
            return true
        }

        //lifecycle
        onBeforeMount(() => {

        });

        return {
            isSelectable,
            selectFly,
            addTimeToADate,
            getHourTimeStamp,
            fliesStore,
            page
        }
    }
}
</script>
<style>
.horarioContainer {
    height: 100%;
    width: 100%;
}

.registerRow {
    border: 1px solid black;
    border-radius: 10px;
    height: 100px;
    margin-bottom: 10px;
}
</style>