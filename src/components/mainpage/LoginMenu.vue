<template>
    <div class="text-center">
        <v-menu v-model="menu" :close-on-content-click="false" location="start">
            <template v-slot:activator="{ props }">
                <v-btn prepend-icon="mdi-account" class="mr-2" v-bind="props">
                    Iniciar Sesion
                </v-btn>
            </template>

            <v-card min-width="300">
                <v-list>
                    
                    <v-list-item>
                        <v-text-field density="compact" variant="outlined" label="Correo" single-line hide-details
                        ></v-text-field>
                    </v-list-item>

                    <v-list-item>
                        <v-text-field density="compact" variant="outlined" label="Password" type="password" single-line hide-details
                        ></v-text-field>
                    </v-list-item>
                    <v-list-item v-if="isNewRegister">
                        <v-text-field density="compact" variant="outlined" label="Nombre" single-line hide-details
                        ></v-text-field>
                    </v-list-item>
                    <v-list-item v-if="isNewRegister">
                        <v-text-field density="compact" variant="outlined" label="Apellido Paterno"  single-line hide-details
                        ></v-text-field>
                    </v-list-item>
                    <v-list-item v-if="isNewRegister">
                        <v-text-field density="compact" variant="outlined" label="Apellido Materno" single-line hide-details
                        ></v-text-field>
                    </v-list-item>
                    <v-list-item>
                        <div class="text-caption cursor-pointer text-center text-blue" @click="toogleTypeLogin"> {{isNewRegister ? 'Ya tienes cuenta?' : 'Aun no te haz registrado?'}}</div>
                    </v-list-item>
                </v-list>

                <v-card-actions>
                    <v-btn class="mx-auto" color="primary" variant="text" @click="menu = false">
                        {{isNewRegister ? 'Registrar' : 'Iniciar Sesion'}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </div>
</template>
<script>
import { ref } from 'vue'
export default {
    setup() {
        const menu = ref(false)
        const isNewRegister = ref(false)

        const toogleTypeLogin = () => {
            isNewRegister.value = !isNewRegister.value;
        }

        return {
            toogleTypeLogin,
            isNewRegister,
            menu
        }
    }
}
</script>
<style></style>