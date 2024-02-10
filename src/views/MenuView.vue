<template>
    <v-container class="contenedor fill-height" fluid>
        <div id="img-bg">
        </div>
        <v-col xs="12" class="fill-height">
            <v-row id="cabecero" justify="space-between" align="center">
                <div id="logo">
                    <h1>RestaurantAll</h1>
                </div>
                <div>
                    <v-select density="compact" color="primary" v-model="sucursal" label="Sucursal"
                        :items="listadoSucursales" item-title="nombre"
                        item-value="idsucursal" variant="solo-filled" v-on:update:model-value="changeSucursalUsuario"></v-select>
                </div>
                <div id="logout" @click="logout">
                    <v-icon icon="mdi mdi-logout" size="large">
                    </v-icon>
                    <h1>Salir</h1>
                </div>
            </v-row>
            <v-row id="main" justify="center" align="center">
                <botones-navegacion />
            </v-row>
        </v-col>
    </v-container>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue'
import { supabase } from '@/plugins/supabase'
import BotonesNavegacion from '@/components/menu/BotonesNavegacion.vue'
import {getidUserLoggedInfo} from '@/util/loggedUser'
export default {
    components: {
        BotonesNavegacion
    },
    setup() {
        const router = useRouter();
        const sucursal = ref(null)
        const listadoSucursales = ref([]);

        
        const changeSucursalUsuario = () => {
            localStorage.setItem("sucursal",sucursal.value)
        }

        const getSucursalesUsuario = async () => {
            const { data, error } = await supabase
                .from('usuarios_sucursales')
                .select('sucursales(*)')
                .eq('idusuario', getidUserLoggedInfo());
            if (!error) {
                listadoSucursales.value = data.map((item) => item.sucursales)
                if(listadoSucursales.value.length > 0) {
                    sucursal.value = listadoSucursales.value[0].idsucursal
                    localStorage.setItem("sucursal",sucursal.value)
                }
            }
        }

        const logout = () => {
            if (confirm("¿Realmente desea cerrar sesión?")) {
                localStorage.clear()
                router.push({ name: 'inicio' });
            }
        }

        onMounted(() => {
            getSucursalesUsuario()
        })

        return {
            logout,
            changeSucursalUsuario,
            sucursal,
            listadoSucursales
        }
    }
}
</script>

<style scoped>
.contenedor {
    padding: 0;
}

#cabecero {
    height: 15%;
}

#main {
    height: 85%;
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

#logo {
    margin-left: 3vw;
    color: white;
}

#logout {
    margin-right: 3vw;
    color: white;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
</style>