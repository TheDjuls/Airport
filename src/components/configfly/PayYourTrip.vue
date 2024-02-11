<template>
    <div>
        <v-card variant="outlined" width="98%" id="tarjeta">
            <template v-slot:title>
                Tu Orden
            </template>

            <template v-slot:text>
                <v-list>
                    <v-list-item v-if="getNumberSeatPerOrden['1']">
                        Basico: x{{ getNumberSeatPerOrden["1"] }}
                    </v-list-item>
                    <v-list-item v-if="getNumberSeatPerOrden['2']">
                        Normal: x{{ getNumberSeatPerOrden["2"] }}
                    </v-list-item>
                    <v-list-item v-if="getNumberSeatPerOrden['3']">
                        Ejecutivo: x{{ getNumberSeatPerOrden["3"] }}
                    </v-list-item>
                </v-list>
            </template>

            <template v-slot:actions>
                <div class="text-h6">Total: ${{ getTotalOrden }}</div>
                <v-spacer></v-spacer>
                <v-btn variant="outlined" :disabled="bookDisabled"  @click="bookYourFly">
                    Reservar
                </v-btn>
                <v-btn variant="outlined" :disabled="bookDisabled"  @click="confirmFly">
                    Reservar y Confirmar
                </v-btn>
            </template>
        </v-card>
    </div>
</template>
<script>
import { computed } from 'vue'
import { useFliesStore } from '@/stores/flies'
import { bookaFly, bookSeats } from '@/services/listFlies.js'
import { getIdUserLogged,getTypeUserLogged } from '@/util/session.js'
import emitter from '@/plugins/mitt';
export default {
    setup() {
        const fliesStore = useFliesStore();

        const clearSelection = () => {
            fliesStore.setSeatsSelected([])
        }

        const rechargeListSeats = () => {
            emitter.emit("chargePlaneSeats")
        }

        const confirmFly = async () => {
            const idOrden = await bookYourFly()
            emitter.emit("abrirModal", {id: idOrden})
        }

        const bookYourFly = async () => {
            if (confirm("¿Estas seguro de realizar esta reserva?")) {
                const idVuelo = fliesStore.flyInfo.vuelo.id;
                const idUsuario = getIdUserLogged();
                const idOrden = await  bookaFly(idVuelo, idUsuario);
                if(idOrden){
                    for(const seat of fliesStore.seatsSelected){
                        await bookSeats(idOrden, seat.id)
                    }
                    clearSelection()
                    rechargeListSeats()
                    alert( "Reserva exitosa!");
                    return idOrden
                }
            }
        }

        const getNumberSeatPerOrden = computed(() => {
            const conteo = fliesStore.seatsSelected.reduce((resultado, objeto) => {
                if (!resultado[objeto.idTipoAsiento]) {
                    resultado[objeto.idTipoAsiento] = 1;
                } else {
                    resultado[objeto.idTipoAsiento]++;
                }
                return resultado;
            }, {});
            return conteo;
        });

        const getTotalOrden = computed(() => {
            let total = 0;
            fliesStore.seatsSelected.forEach((seat) => {
                total = (total + parseFloat(seat.priceSelected));
            });
            return total.toFixed(2);
        });

        const bookDisabled = computed(() => {

            if(fliesStore.seatsSelected.length > 0){
                if(getTypeUserLogged() == 1){
                    return true
                }
                return false
            }
            return true;
        });

        return {
            bookYourFly,
            fliesStore,
            getTotalOrden,
            getNumberSeatPerOrden,
            confirmFly,
            getTypeUserLogged,
            bookDisabled
        }
    }
}
</script>
<style>
#tarjeta {
    overflow-y: auto;
}
</style>