<template>
    <div>
    <AppBar />
    <FlySearcher />
    <LIstFlys />
    </div>
</template>
<script>
import AppBar from '@/components/mainpage/AppBar'
import FlySearcher from '@/components/mainpage/FlySearcher'
import LIstFlys from '@/components/mainpage/LIstFlys'
export default {
    components:{
        AppBar,
        FlySearcher,
        LIstFlys
    },
    setup() {

    }
}
</script>
<style>
    
</style>