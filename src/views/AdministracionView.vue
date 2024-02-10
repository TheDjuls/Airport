<template>
    <v-container class="contenedor fill-height" fluid>
        <div id="img-bg">
        </div>
        <v-col xs="12" class="fill-height">
            <v-row id="kpiPanel" align="center" justify="center">
                <BarraIndicadores />
            </v-row>
            <v-row id="catalogos" align="center" justify="center">
                <v-col class="columnas" cols="2">
                <CatalogoSelector />
                </v-col>
                <v-col class="columnas" cols="10">
                    <CatalogoListado />
                </v-col>
            </v-row>
        </v-col>
    </v-container>
</template>

<script>
import BarraIndicadores from '@/components/comandera/BarraIndicadores.vue';
import CatalogoSelector from '@/components/administracion/CatalogoSelector.vue'
import CatalogoListado from '@/components/administracion/CatalogoListado.vue'

export default {
    components:{
    BarraIndicadores,
    CatalogoSelector,
    CatalogoListado
},
    setup() {

        


        return {
            
        }
    }
}
</script>

<style scoped>

#kpiPanel {
    height: 15%;
}

#catalogos {
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