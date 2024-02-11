<template>
    <v-container fluid>
        <v-col cols="12">
            <v-row class="fill-height">
                <v-col cols="6">
                    <SelectSeats />
                </v-col>
                <v-col cols="6">
                    <FlyInfo />
                    <br>
                    <SelectTypeOfFly />
                    <br>
                    <SelectTypeOfFly />
                </v-col>
            </v-row>
        </v-col>
    </v-container>
</template>
<script>
import FlyInfo from './FlyInfo.vue';
import SelectSeats from './SelectSeats.vue';
import SelectTypeOfFly from './SelectTypeOfFly.vue';

export default {
    components: { FlyInfo, SelectTypeOfFly, SelectSeats }
}
</script>
<style>
    
</style>