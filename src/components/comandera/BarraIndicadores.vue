<template>
    <div id="contenedorIndicadores">
      <div class="iconoImg">
        <v-icon @click="backToMenu"  icon="mdi mdi-arrow-left-bold" size="65" />
      </div>

      <div class="iconoAccount">
        <v-icon icon="mdi mdi-account" size="65" />
        <span>{{ usuarioLogged.nombre }}</span>
      </div>
    </div>
</template>

<script>
import { onMounted,  } from 'vue';
import { useRouter } from 'vue-router';
import { useComanderaStore } from '@/stores/comandera'
export default {
    setup(){
        const comanderaStore = useComanderaStore();
        const router = useRouter();
        const usuarioLogged = JSON.parse(localStorage.getItem("user_db"))

        const backToMenu = () => {
            if(confirm("¿realmente desea regresar?")){
                comanderaStore.clearComandera()
                router.back()
            }
        }
  
        onMounted(() => {
        })

        return {
          backToMenu,
          usuarioLogged
        }
    }

}
</script>

<style scoped>
.iconoImg{
    color: white;
    display: flex;
    width: 10%;
    align-content: center;
    justify-content: center;
    align-items: center;
}

.iconoAccount{
    color: white;
    display: flex;
    width: 20%;
    align-content: center;
    justify-content: center;
    align-items: center;
}

.iconoImg:hover{
    color: black;
}

.iconoAccount:hover{
    color: black;
}

#contenedorIndicadores{
    height: 90%;
    width: 97%;
    background-color: rgb(128, 128, 128, 0.7);
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-between;
    align-items: center;
}
</style>