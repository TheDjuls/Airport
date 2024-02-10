<template>
    <v-container id="contenedorShortcuts">
        <v-col cols="12" style="height: 90%;">
            <v-row justify="center" align="center">
                <v-col v-for="(value, key) in listShortcuts" :key="key" xs="6" md="3">
                    <div class="contenedorImg">
                        <div class="circuloIcono" @click="navigateTo(value.modulos.rutamodulo)">
                            <v-icon class="iconoImg" :icon="value.modulos.icono" size="65">
                            </v-icon>
                            <h2 class="titulo">{{ value.modulos.nombre }}</h2>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-col>
    </v-container>
</template>

<script>
import { useRouter } from 'vue-router';

import { onMounted, ref } from 'vue';
import { supabase } from '@/plugins/supabase'

export default {
    setup() {
        const router = useRouter();
        const listShortcuts = ref([]);
        const userInfo = ref({});

        const navigateTo = (toRoute) => {
            router.push({name:toRoute})
        }

        const getUserLoggedInfo = () => {
            let dataJson = localStorage.getItem('user_db');
            dataJson = JSON.parse(dataJson)
            userInfo.value = dataJson
        }

        const getMenuShortcuts = async () => {
            const { data, error } = await supabase
                .from('usuarios_modulos')
                .select('modulos(*)')
                .eq('idusuario', userInfo.value.idusuario);
            if(!error){
                listShortcuts.value=data
            }

        }

        onMounted(() => {
            getUserLoggedInfo();
            getMenuShortcuts();
        })


        return {
            listShortcuts,
            navigateTo
        }
    }

}
</script>

<style scoped>
#contenedorShortcuts {
    width: 90vw;
    height: 90%;
}

.contenedorImg {
    width: 90%;
    margin: auto;
    height: 20vh;
}

.contenedorImg .iconoImg {
    color: white;
    display: block;
    margin: auto;
}

.contenedorImg .titulo {
    color: white;
    width: 100%;
    margin: auto;
    text-align: center;
    font-size: 0.8em;
    background-color: rgb(106 106 106);
    padding-left: 10px;
    padding-right: 10px;
}

.circuloIcono {
    background-color: #DA983C;
    border-radius: 50%;
    height: 12vh;
    width: 47%;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
    cursor:pointer
}
</style>