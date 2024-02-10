<template>
    <div id="contenedorSelector">
        <div id="contenedorBotones">
            <div v-for="(item, key) in catalogos" :key="key" class="botonIndividual">
                <v-btn block size="large" @click="setCatalogoToWork(item)">{{ item.nombre }}</v-btn>
            </div>
        </div>
    </div>
</template>
<script>
import { ref } from 'vue'
import emitter from '@/plugins/mitt';
export default {

    setup() {
        const catalogos = ref([
            { nombre: 'Sucursal', value: 'sucursales', id: 'idempresa', idsesion: 'user_db', requiereFiltro: 0 },
            { nombre: 'Zonas', value: 'zonas', id: 'idsucursal', idsesion: 'sucursal', requiereFiltro: 1 },
            { nombre: 'Ubicaciones', value: 'ubicaciones', id: 'idsucursal', idsesion: 'sucursal', requiereFiltro: 1 },
            { nombre: 'Menús', value: 'menus', id: 'idsucursal', idsesion: 'sucursal', requiereFiltro: 1 },
            { nombre: 'Productos', value: 'productos', id: 'idsucursal', idsesion: 'sucursal', requiereFiltro: 1 },
            { nombre: 'Usuarios', value: 'usuarios', id: 'idempresa', idsesion: 'user_db', requiereFiltro: 0 },
        ])

        const setCatalogoToWork = (value) =>{
            emitter.emit("setCatalogo", value)
        }


        return {
            setCatalogoToWork,
            catalogos
        }
    }

}
</script>
<style scoped>
.botonIndividual {
    margin-top: 5%;
    margin-bottom: 5%;
    width: 100%;
}

#contenedorBotones {
    width: 95%;
    height: 90%;
}

#contenedorSelector {
    height: 100%;
    background-color: rgb(128, 128, 128, 0.7);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
    margin-left: 5%;
}
</style>