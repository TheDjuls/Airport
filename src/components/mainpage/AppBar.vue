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
export default {
    components: {
        LoginMenu
    },
    setup(){
        const route = useRoute();
        const router = useRouter();


        //methods
        const navigateBack = () => {
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