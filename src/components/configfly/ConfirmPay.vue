<template>
    <div>
        <v-dialog v-model="openModal" persistent width="1024">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Orden: #{{ idOrden }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Numero Tarjeta" @blur="validate" :rules="[errors.tarjeta]"
                                    v-model="payPayload.tarjeta" placeholder="Matriz" type="text" maxlength="16" ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Fecha" @blur="validate" :rules="[errors.fecha]"
                                    v-model="payPayload.fecha" placeholder="MM/YY" type="text" maxlength="5"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="CVV" @blur="validate" :rules="[errors.cvv]"
                                    v-model="payPayload.cvv" type="text" maxlength="4"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="danger" variant="text" @click="cancelPay()">
                        Cancelar
                    </v-btn>
                    <v-btn color="primary" variant="text" :disabled="$v.$invalid" @click="makePayment()">
                        Pagar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { onBeforeMount, ref, reactive } from 'vue';
import emitter from '@/plugins/mitt';
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength, minLength } from '@vuelidate/validators'
import { confirmFly } from '@/services/listFlies.js'

export default {
    setup() {
        const openModal = ref(false)
        const errors = ref({
        });
        const idOrden = ref(null);

        let payPayload = reactive({
            tarjeta: '',
            fecha: '',
            cvv: null,
        })

        const rules = {
            tarjeta: {
                required,
                maxLength: maxLength(16), // Suponiendo que el número de tarjeta tiene máximo 16 dígitos
                validarTarjeta: (value) => {
                    // Expresión regular para validar números de tarjetas Visa, MasterCard, American Express y Discover
                    const regexTarjeta = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/;
                    return regexTarjeta.test(value);
                }
            },
            fecha: {
                required, validarFechaExpiracion(value) {
                    return /^\d{2}\/\d{2}$/.test(value); // Expresión regular para validar el formato MM/YY
                }
            },
            cvv: {
                required,
                validarCvv(value) {
                    return /^\d{3,4}$/.test(value); // Expresión regular para validar un CVV de 3 o 4 dígitos
                }, // Expresión regular para validar un CVV de 3 o 4 dígitos
                minLength: minLength(3), // CVV mínimo de 3 dígitos
                maxLength: maxLength(4)
            },
        }

        const $v = useVuelidate(rules, payPayload)

        const validate = () => {
            $v.value.$touch()
            errors.value.tarjeta = !$v.value.tarjeta.$invalid || "Numero tarjeta invalido"
            errors.value.fecha = !$v.value.fecha.$invalid || "Fecha Vencimiento invalida"
            errors.value.cvv = !$v.value.cvv.$invalid || "cvv invalido"
        }

        const abrirModal = async () => {
            openModal.value = true
        }
        const closeModal = async () => {
                openModal.value = false
        }
        const cancelPay = async () => {
            if(confirm("Deseas cancelar el pago?")){
                closeModal()
                alert("Tu reservacion estara disponible por 30 minutos")
            }
        }

        const  makePayment = async () => {
            const folio = await confirmFly(idOrden.value);
            if(folio != false){
                alert(` Tu numero de confirmacion es ${folio}`)
                closeModal()
            }
        }


        onBeforeMount(() => {
            emitter.on("abrirModal", ({id}) => {
                idOrden.value = id
                abrirModal()
            })
        })

        return {
            openModal,
            closeModal,
            validate,
            idOrden,
            errors,
            payPayload,
            $v,
            cancelPay,
            makePayment
        }
    }
}
</script>
<style></style>