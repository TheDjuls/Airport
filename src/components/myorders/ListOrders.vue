<template>
    <v-container class="mt-10 d-flex justify-center items-center">
        <v-data-table :items="items" :headers="cabeceros">
            <template v-slot:[`item.actions`]="{ item }">
                <td>
                    <v-icon @click="confirmFly(item.orden.id)" v-if="item.orden.folioConfirmacion == null && item.vigente && item.orden.fechaCancelacion == null" size="small" class="me-2" >
                        mdi-check
                    </v-icon>
                    <v-icon @click="cancelOrderAct(item.orden.id)" v-if="item.orden.folioConfirmacion == null && item.vigente && item.orden.fechaCancelacion == null" size="small" class="me-2" >
                        mdi-close
                    </v-icon>
                </td>
            </template>
        </v-data-table>
        <ConfirmPay />
    </v-container>
</template>
<script>
import ConfirmPay from '@/components/configfly/ConfirmPay.vue';
import { ref, onMounted } from 'vue'
import { getOrdersListByUser, cancelOrder } from '@/services/listFlies.js'
import { getIdUserLogged } from '@/util/session.js'
import emitter from '@/plugins/mitt';
export default {
    components:{
        ConfirmPay
    },
    setup() {
        const items = ref([])
        const cabeceros = ref([
            { title: 'Fecha Registro', value: 'orden.fechaOrden' },
            { title: 'Fecha Confirmacion', value: 'orden.fechaConfirmacion' },
            { title: 'Folio', value: 'orden.folioConfirmacion' },
            { title: 'Fecha Cancelacion', value: 'orden.fechaCancelacion' },
            { title: 'Asientos', value: 'asientos' },
            { title: 'Opciones', key: 'actions' },
        ])

        const getListOrders = async () => {
            items.value = await getOrdersListByUser(getIdUserLogged())
        }

        const cancelOrderAct = async (idOrden) => {
            await cancelOrder(idOrden)
            getListOrders()
        }

        const confirmFly = async (idOrden) => {
            emitter.emit("abrirModal", {id: idOrden})
        }

        onMounted(() => {
            getListOrders()

            emitter.on('getListOrders', () => {
                getListOrders();
            });
        })

        return {
            items,
            cabeceros,
            cancelOrderAct,
            confirmFly
        }
    }
}
</script>
<style ></style>