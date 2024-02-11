<template>
    <div id="ContenedorSeats">
        <div id="avion">

        </div>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import { useFliesStore } from '@/stores/flies'
import emitter from '@/plugins/mitt';
export default {
    setup(){
        const test = ref(1)
        const fliesStore = useFliesStore();

        const chargePlaneSeats = () => {
            alert("cargo avion")
        }


        onMounted(()=>{
            emitter.on('chargePlaneSeats', () => {
                chargePlaneSeats();
            });
        })

        return {
            test,
            fliesStore
        }
    }
}
</script>
<style>
#avion{
    margin: auto;
    border: 1px solid blue;
    width: 90%;
    height: 98%;
}
#ContenedorSeats{
        border: 1px solid red;
        width: 100%;
        height: 100%;
}
</style>