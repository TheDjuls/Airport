<template>
    <div id="containerSearch">
        <div id="searchBar">
            <v-row id="rowContainer">
                <v-col cols="3">
                    <v-autocomplete variant="outlined" label="Origen" :items="listAirports" item-title="ciudad" item-value="id"></v-autocomplete>
                </v-col>
                <v-col cols="3">
                    <v-autocomplete variant="outlined" label="Destino" :items="listAirports" item-title="ciudad" item-value="id"></v-autocomplete>
                </v-col>
                <v-col cols="3">
                    <v-autocomplete variant="outlined" label="Aerolinea" :items="listCompanys" item-title="nombreAerolinea" item-value="id"></v-autocomplete>
                </v-col>
                <v-col cols="2">
                    <datepicker id="dateSelector" placeholder="Fecha Salida"></datepicker>
                </v-col>
                <v-col cols="1">
                    <v-btn density="default" color="primary" icon="mdi-magnify"></v-btn>
                </v-col>
            </v-row>
        </div>
    </div>
</template>
<script>
import { onBeforeMount, ref } from 'vue';
import Datepicker from 'vuejs3-datepicker';
import { getAirports, getAirlines } from '@/services/mainpage.js'

export default {
    components: {
        Datepicker
    },
    setup() {
        //variables
        const listAirports = ref([])
        const listCompanys = ref([])
        //methods

        const getCatalogs = async () => {
            const [dataAirports, dataAirlines] = await Promise.all([getAirports(),getAirlines() ]);
            console.log(dataAirlines, dataAirports)
            listAirports.value = dataAirports
            listCompanys.value = dataAirlines
        }

        //lifecycle
        onBeforeMount(() => {
            getCatalogs()
        });

        return {
            listAirports,
            listCompanys
        }
    }
}
</script>
<style>
#rowContainer {
    height: 20vh;
}

.vuejs3-datepicker {
    margin-bottom: 10vw;
}

#containerSearch {
    margin-top: 5%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

#searchBar {
    width: 80%;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
</style>