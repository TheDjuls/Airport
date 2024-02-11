<template>
    <div id="ContenedorSeats">
        <div id="avion">
            <div v-for="(seat, index) in listadoAsientos" :key="index" style="width: 24%;"
                :class="((index + 1) % 4 === 2 && index !== listadoAsientos.length - 1) ? 'asientoMedio' : 'asiento'">
                <div class="ml-1">
                    <v-btn @click="toggleSeat(seat.asiento)" :disabled="seat.ocupado > 0" 
                        :color="verifySelected(seat.asiento.id) ? 'warning' : 'primary'" small>
                        <v-icon start icon="mdi-seat"></v-icon>
                        {{
                            seat.asiento.numeroAsiento
                        }}
                    </v-btn>
                </div>
                <div style="width: 30%; background-color: gray;"
                    v-if="(index + 1) % seatsPerRow === 2 && index !== listadoAsientos.length - 1"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import { useFliesStore } from '@/stores/flies'
import emitter from '@/plugins/mitt';
import { getSeats } from '@/services/listFlies.js'
export default {
    setup() {
        const fliesStore = useFliesStore();
        const numberRows = ref(0)
        const seatsPerRow = ref(4)
        const listadoAsientos = ref([])

        const chargePlaneSeats = async () => {
            const listSeats = await getSeats(fliesStore.flyInfo.vuelo.idAvion, fliesStore.typeSeatSeach, fliesStore.flyInfo.vuelo.id)
            console.log(listSeats)
            listadoAsientos.value = listSeats
        }

        const toggleSeat = (seat) => {
            const elementoEncontrado = fliesStore.seatsSelected.find((elemento) =>{ return  elemento.id === seat.id});
            if(elementoEncontrado){
                const auxiliar = fliesStore.seatsSelected.filter((elemento)  =>{ return  elemento.id !== seat.id})
                fliesStore.setSeatsSelected(auxiliar)
            }else {
                fliesStore.addSeat({...seat, priceSelected : fliesStore.priceSelected})
            }
        }

        const verifySelected = (idSelected) => {
            const elementoEncontrado = fliesStore.seatsSelected.find(elemento => elemento.id === idSelected);
            return elementoEncontrado !== undefined;
        }


        onMounted(() => {
            emitter.on('chargePlaneSeats', () => {
                chargePlaneSeats();
            });
        })

        return {
            verifySelected,
            toggleSeat,
            fliesStore,
            numberRows,
            seatsPerRow,
            listadoAsientos
        }
    }
}
</script>
<style>
.containerAsiento {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
}

.asiento {
    height: 50px;
}

.asientoMedio {
    height: 50px;
    display: flex;
    justify-content: space-between;
}

#avion {
    margin: auto;
    width: 90%;
    height: 98%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
}

#ContenedorSeats {
    width: 100%;
    height: 100%;
}
</style>