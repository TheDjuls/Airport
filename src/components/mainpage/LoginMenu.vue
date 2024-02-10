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
                        <v-text-field density="compact" variant="outlined" label="Search templates" single-line hide-details
                        ></v-text-field>
                    </v-list-item>

                    <v-list-item>
                        <v-switch color="purple" label="Enable hints" hide-details></v-switch>
                    </v-list-item>
                    <v-list-item>
                        <a>Aun no estas registrado?</a>
                    </v-list-item>
                </v-list>

                <v-card-actions>
                    <v-btn class="mx-auto" color="primary" variant="text" @click="menu = false">
                        Iniciar Sesion
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
        return {
            menu
        }
    }
}
</script>
<style></style>