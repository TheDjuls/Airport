<template>
    <div>
        <barra-indicadores />
        <div id="infoSucursal">
            <div class="text-center" style="width:400px ;display: flex;flex-direction: column;">
                <h1>RestaurantAll</h1>
                <span>Sucural: La Venta</span>
                <span>Regino Hernandez Llergo #210</span>
                <span>OLCA990316 - Tel. 9931178811</span>
                <span>{{ new Date() }}</span>
                <h2>Mesa 1</h2>
            </div>
            <br>
            <div id="cabecerosTicket">
                <span class="text-left" style="width:50%">Descripción</span>
                <span class="text-right" style="width:10%">Unid.</span>
                <span class="text-right" style="width:20%">Precio</span>
                <span class="text-right" style="width:20%">Total</span>
            </div>
            <div id="productos">
                <div style="width: 100%; display: flex;">
                    <span class="text-left" style="width:50%">Jamon Serrano</span>
                    <span class="text-right" style="width:10%">2</span>
                    <span class="text-right" style="width:20%">5</span>
                    <span class="text-right" style="width:20%">10</span>
                </div>
                <div style="width: 100%; display: flex;">
                    <span class="text-left" style="width:50%">Sandwich</span>
                    <span class="text-right" style="width:10%">2</span>
                    <span class="text-right" style="width:20%">5</span>
                    <span class="text-right" style="width:20%">10</span>
                </div>
                <div style="width: 100%; display: flex;margin-top: 20px">
                    <span class="text-left" style="width:50%">Total IVA/INC. 16%</span>
                    <span class="text-right" style="width:50%">$20</span>
                </div>
            </div>
            <div style="display: flex;flex-direction: row;width: 400px;border-top: 2px dashed;border-bottom: 2px dashed;">
                <span class="text-center" style="width:100%">*** Gracias por su visita ***</span>
            </div>
        </div>
        <div id="botoneraImpresion">
            <v-btn @click="printTicket" size="large">Imprimir</v-btn>   
        </div>
    </div>
</template>
<script>
import BarraIndicadores from '@/components/comandera/BarraIndicadores.vue'
export default {
    components: {
        BarraIndicadores
    },
    setup() {

        const printTicket = () => {
            window.print()
        }

        return {
            printTicket
        }
    },
}
</script>
<style>

#infoSucursal{
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;width: 450px;
}

#cabecerosTicket{
    display: flex;
    flex-direction: row;
    width: 400px;
    border-top: 2px dashed;
    border-bottom: 2px dashed;
}

#productos{
    display: flex;
    flex-direction: column;
    width: 400px;
    border-top: 2px dashed;
    border-bottom: 2px dashed;
}

#botoneraImpresion {
    display: flex;
    width: 99%;
    height: 10vh;
    background-color: rgba(128, 128, 128, 0.7);
    position: fixed;
    bottom: 0px;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    align-items: center;
}

 @media print {

    #contenedorIndicadores{
        visibility: hidden
    }
    
    #botoneraImpresion {
        visibility: hidden
    }
 }
</style>