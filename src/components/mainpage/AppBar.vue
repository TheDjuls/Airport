<template lang="">
    <div>
        <v-toolbar color="primary" density="compact">

      <v-toolbar-title>Aeropuerto Merida</v-toolbar-title>

      <v-spacer></v-spacer>
      <LoginMenu />
    </v-toolbar>
    </div>
</template>
<script>
import LoginMenu from './LoginMenu.vue';
export default {
    components:{
        LoginMenu
    }
}
</script>
<style lang="">
    
</style>