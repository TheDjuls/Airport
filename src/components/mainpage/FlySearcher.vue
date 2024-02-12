<template>
    <div id="containerSearch">
        <div id="searchBar">
            <v-row id="rowContainer">
                <v-col cols="3">
                    <v-autocomplete variant="outlined" label="Origen" v-model="payloadBusqueda.origen" :items="listAirports"
                        item-title="ciudad" item-value="id"></v-autocomplete>
                </v-col>
                <v-col cols="3">
                    <v-autocomplete variant="outlined" label="Destino" v-model="payloadBusqueda.destino"
                        :items="listAirports" item-title="ciudad" item-value="id"></v-autocomplete>
                </v-col>
                <v-col cols="3">
                    <v-autocomplete variant="outlined" label="Aerolinea" v-model="payloadBusqueda.aerolinea"
                        :items="listCompanys" item-title="nombreAerolinea" item-value="id"></v-autocomplete>
                </v-col>
                <v-col cols="3">
                    <datepicker id="dateSelector" v-model="payloadBusqueda.fecha" placeholder="Fecha Salida"></datepicker>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" class="d-flex flex-row justify-center items-center">
                    <v-btn density="default" color="primary" icon="mdi-magnify" @click="searchFliesAction()"></v-btn>
                    <v-btn density="default" class="mx-1" color="error" icon="mdi-close" @click="clearSearch()"></v-btn>
                </v-col>
            </v-row>
        </div>
    </div>
</template>
<script>
import { onBeforeMount, ref, reactive } from 'vue';
import Datepicker from 'vuejs3-datepicker';
import { getAirports, getAirlines } from '@/services/mainpage.js'
import { getSession } from '@/util/session.js'
import { searchFlies } from '@/services/listFlies.js'
import { useFliesStore } from '@/stores/flies'
import moment from 'moment';

export default {
    components: {
        Datepicker
    },
    setup() {
        //variables
        const fliesStore = useFliesStore();
        const listAirports = ref([])
        const listCompanys = ref([])
        let payloadBusqueda = reactive({
            origen: 6,
            destino: null,
            aerolinea: null,
            fecha: null
        })
        //methods

        const clearSearch = () => {
            if (confirm("¿Está seguro de borrar la busqueda?")) {
                payloadBusqueda.origen = 6;
                payloadBusqueda.destino = null;
                payloadBusqueda.aerolinea = null;
                payloadBusqueda.fecha = null;
                fliesStore.setListFlies([])
            }

        }

        const getCatalogs = async () => {
            const [dataAirports, dataAirlines] = await Promise.all([getAirports(), getAirlines()]);
            listAirports.value = dataAirports
            listCompanys.value = dataAirlines
        }

       

        const searchFliesAction = async () => {
            if (getSession() != null) {
                if (payloadBusqueda.fecha != null) {
                    let listFlies = await searchFlies(payloadBusqueda)
                    listFlies = listFlies.sort((a, b) => moment(a.vuelo.horaSalida) - moment(b.vuelo.horaSalida));
                    fliesStore.setListFlies(listFlies)
                    console.log(fliesStore.listFlies)
                } else {
                    alert("Indique una fecha de vuelo")
                }
            } else {
                alert("Debe Iniciar Sesión")
            }
        }

        //lifecycle
        onBeforeMount(() => {
            getCatalogs()
        });

        return {
            clearSearch,
            searchFliesAction,
            listAirports,
            listCompanys,
            payloadBusqueda
        }
    }
}
</script>
<style>
#rowContainer {
    height: 10vh;
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
    flex-direction: column;
}
</style>