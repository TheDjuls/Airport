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
                    <PayYourTrip />
                </v-col>
            </v-row>
        </v-col>
        <ConfirmPay />
    </v-container>
</template>
<script>
import ConfirmPay from './ConfirmPay.vue';
import FlyInfo from './FlyInfo.vue';
import PayYourTrip from './PayYourTrip.vue';
import SelectSeats from './SelectSeats.vue';
import SelectTypeOfFly from './SelectTypeOfFly.vue';

export default {
    components: { FlyInfo, SelectTypeOfFly, SelectSeats, PayYourTrip, ConfirmPay }
}
</script>
<style>
    
</style>