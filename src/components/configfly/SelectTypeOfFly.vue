<template>
    <div>
        <v-card variant="outlined" height="20vh" width="98%">
            <template v-slot:title>
                Categorias
            </template>

            <template v-slot:subtitle>
                Seleccione un tipo de asientos
            </template>

            <template v-slot:text>
                <v-radio-group @change="SelectTypeOfFly" v-model="typeTicket" inline>
                    <v-radio label="Economico" value="1"></v-radio>
                    <v-radio label="Normal" value="2"></v-radio>
                    <v-radio label="Ejecutivo" value="3"></v-radio>
                </v-radio-group>
                <div class="text-h6">Precio: ${{ getPriceTicket }}</div>
            </template>

        </v-card>
    </div>
</template>
<script>
import { ref, computed } from 'vue'
import { useFliesStore } from '@/stores/flies'
import emitter from '@/plugins/mitt';
export default {
    setup() {
        const fliesStore = useFliesStore();
        const typeTicket = ref(null)

        const SelectTypeOfFly = () => {
            fliesStore.setTypeSeatSeach(typeTicket.value)
            fliesStore.setPriceSelected(getPriceTicket.value)
            emitter.emit("chargePlaneSeats")
        }


        const getPriceTicket = computed(() => {
            const precioBase = fliesStore.flyInfo.vuelo ? fliesStore.flyInfo.vuelo.precioBase : 0
            if (typeTicket.value == '1') {
                return precioBase.toFixed(2)
            } else if (typeTicket.value == '2') {
                return (precioBase+ (precioBase*0.35)).toFixed(2)
            } else if (typeTicket.value == '3') {
                const precioNormal = (precioBase+ (precioBase*0.35))
                return (precioNormal+ (precioNormal*0.45)).toFixed(2)
            } else {
                return precioBase
            }

        });

        return {
            SelectTypeOfFly,
            getPriceTicket,
            typeTicket,
            fliesStore
        }
    }
}
</script>
<style></style>