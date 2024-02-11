<template>
    <div>
        <v-toolbar color="primary" density="compact">
            <v-btn @click="navigateBack" v-if="route.name !='inicio'" icon class="hidden-xs-only">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title>Aeropuerto Merida</v-toolbar-title>

            <v-spacer></v-spacer>
            <LoginMenu />
        </v-toolbar>
    </div>
</template>
<script>
import LoginMenu from './LoginMenu.vue';
import { useRoute, useRouter } from 'vue-router';
import { useFliesStore } from '@/stores/flies'
export default {
    components: {
        LoginMenu
    },
    setup(){
        const fliesStore = useFliesStore();
        const route = useRoute();
        const router = useRouter();


        //methods
        const navigateBack = () => {
            fliesStore.setSeatsSelected([])
            router.back()
        }

        return{
            navigateBack,
            route
        }
    }
}
</script>
<style></style>