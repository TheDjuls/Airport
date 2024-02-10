<template>
    <v-container class="contenedor fill-height" fluid>
        <div id="img-bg">
        </div>
        <v-col xs="12" class="fill-height">
            <v-row id="kpiPanel" align="center" justify="center">
                <BarraIndicadores />
            </v-row>
            <v-row id="comandera" align="center" justify="center">
                <v-col class="columnas" cols="5">
                    <UbicacionesSelector v-if="!comanderaStore.mostrarProductos"/>
                    <ProductoSelector v-else />
                </v-col>
                <v-col class="columnas" cols="2">
                    <MenuSelector />
                </v-col>
                <v-col class="columnas" cols="5">
                    <DetalleComanda />
                </v-col>
            </v-row>
        </v-col>
    </v-container>
</template>

<script>
import UbicacionesSelector from '@/components/comandera/UbicacionesSelector.vue'
import MenuSelector from '@/components/comandera/MenuSelector.vue';
import DetalleComanda from '@/components/comandera/DetalleComanda.vue';
import BarraIndicadores from '@/components/comandera/BarraIndicadores.vue';
import ProductoSelector from '@/components/comandera/ProductoSelector.vue';
import {useComanderaStore} from '@/stores/comandera'
export default {
    components:{
    UbicacionesSelector,
    MenuSelector,
    DetalleComanda,
    BarraIndicadores,
    ProductoSelector
},
    setup() {
        const comanderaStore = useComanderaStore();
        


        return {
            comanderaStore
        }
    }
}
</script>

<style scoped>

#kpiPanel {
    height: 15%;
}

#comandera {
    height: 85%;
}

.columnas {
    height: 100%;
}

.contenedor {
    padding: 0;
}

#img-bg {
    position: absolute;
    height: 100%;
    width: 100%;
    background-image: url('@/assets/background.jpg');
    background-size: cover;
    background-position: center;
    z-index: -1;
    opacity: 0.9;
}
</style>