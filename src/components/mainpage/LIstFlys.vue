<template>
    <div>
        <v-container>
            <v-col cols="12">
                <v-row class="registerRow">
                    <v-col cols="5" class="d-flex flex-row">
                        <div class="horarioContainer d-flex flex-column justify-center align-center">
                            <div class="text-h6">8:20 AM</div>
                            <div class="text-caption">Villahermosa</div>
                        </div>
                        <div class="horarioContainer d-flex justify-center align-center">
                            <v-icon icon="mdi-airplane"></v-icon>
                        </div>
                        <div class="horarioContainer d-flex flex-column justify-center align-center">
                            <div class="text-h6">10:20 AM</div>
                            <div class="text-caption">Merida</div>
                        </div>
                    </v-col>
                    <v-col cols="5" class="d-flex flex-row">
                        <div class="horarioContainer d-flex flex-column justify-center align-center">
                            <div class="text-caption">Duracion</div>
                            <div class="text-h6">1:00 HR</div>
                        </div>
                        <div class="horarioContainer d-flex flex-column justify-center align-center">
                            <div class="text-caption">Num. Vuelo</div>
                            <div class="text-h6">AIR-231</div>
                        </div>
                        <div class="horarioContainer d-flex flex-column justify-center align-center">
                            <div class="text-caption">Aerolinea</div>
                            <div class="text-h6">Volaris</div>
                        </div>
                    </v-col>
                    <v-col cols="2" class="d-flex flex-row">
                        <div class="horarioContainer d-flex flex-column justify-center align-center">
                            <div class="text-caption">Tarifa Basica</div>
                            <div class="text-h6">$ 700.00</div>
                            <v-btn variant="outlined" density="compact">
                                Reservar
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </v-container>
    </div>
</template>
<script>
import { onBeforeMount } from 'vue';
export default {
    setup(){
        //variables

        //methods

        //lifecycle
        onBeforeMount(() => {
           
        });

        return {

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
}
</style>