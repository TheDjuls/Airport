<template>
    <div>
       <AppBar /> 
       <ListOrders />
    </div>
</template>
<script>
import AppBar from '@/components/mainpage/AppBar.vue';
import ListOrders from '@/components/myorders/ListOrders.vue';
export default {
    components: { AppBar,ListOrders }
}
</script>
<style>
    
</style>