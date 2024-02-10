<template>
    <div>
        <v-dialog v-model="openModal" persistent width="1024">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Añadir Sucursal</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Nombre" @blur="validate" :rules="[errors.nombre]"
                                    v-model="sucursalPayload.nombre" placeholder="Matriz" type="text"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Direccion" @blur="validate" :rules="[errors.direccion]"
                                    v-model="sucursalPayload.direccion" placeholder="La Venta 123"
                                    type="text"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Telefono" @blur="validate" :rules="[errors.telefono]"
                                    v-model="sucursalPayload.telefono" type="text"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-checkbox v-model="sucursalPayload.sucursalmovil" label="Sucursal Movil"></v-checkbox>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="danger" variant="text" @click="closeModal()">
                        Cancelar
                    </v-btn>
                    <v-btn color="primary" variant="text" :disabled="$v.$invalid"
                        @click="(idSucursalEditin != null ? updateSucursal() : saveSucursal())">
                        Guarda Sucursal
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { onMounted, onBeforeMount, ref, reactive } from 'vue';
import { supabase } from '@/plugins/supabase';
import emitter from '@/plugins/mitt';
import { getidUserLoggedInfoEmpresa } from '@/util/loggedUser';
import { convertBooleanToNumber, convertNumberToBoolean } from '@/util/functions'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import toaster from '@/plugins/toaster';

export default {
    setup() {
        const openModal = ref(false)
        const errors = ref({
        });
        const idSucursalEditin = ref(null);

        let sucursalPayload = reactive({
            nombre: '',
            direccion: '',
            sucursalmovil: false,
            telefono: ''
        })

        const rules = {
            nombre: { required, minLength: minLength(2) },
            direccion: { required, minLength: minLength(10) },
            sucursalmovil: { required },
            telefono: { required, minLength: minLength(10) }
        }

        const $v = useVuelidate(rules, sucursalPayload)

        const validate = () => {
            $v.value.$touch()
            errors.value.nombre = !$v.value.nombre.$invalid || "Nombre invalido , debe tener al menos 2 caracteres"
            errors.value.direccion = !$v.value.direccion.$invalid || "Direccion invalido , debe tener al menos 10 caracteres"
            errors.value.telefono = !$v.value.telefono.$invalid || "Telefono invalido , debe tener al menos 10 caracteres"
        }

        const abrirModal = async () => {
            openModal.value = true
        }

        const closeModal = async () => {
            openModal.value = false
            idSucursalEditin.value = null
            sucursalPayload.direccion = ''
            sucursalPayload.telefono = ''
            sucursalPayload.sucursalmovil = false
            sucursalPayload.nombre = ''
        }

        const rechargeCatalogo = async () => {
            emitter.emit("rechargeCatalogo")
        }

        const saveSucursal = async () => {

            const { error } = await supabase
                .from('sucursales')
                .insert({
                    idempresa: getidUserLoggedInfoEmpresa(), nombre: sucursalPayload.nombre,
                    direccion: sucursalPayload.direccion, telefono: sucursalPayload.telefono,
                    sucursalmovil: convertBooleanToNumber(sucursalPayload.sucursalmovil)
                })
            if (!error) {
                toaster.success(`sucursal agregada exitosamente`);
                rechargeCatalogo()
                closeModal()
            } else {
                toaster.error(`Error al agregar sucursal`);
            }
        }

        const updateSucursal = async () => {

            const { error } = await supabase
                .from('sucursales')
                .update({
                    idempresa: getidUserLoggedInfoEmpresa(), nombre: sucursalPayload.nombre,
                    direccion: sucursalPayload.direccion, telefono: sucursalPayload.telefono,
                    sucursalmovil: convertBooleanToNumber(sucursalPayload.sucursalmovil)
                })
                .eq('idsucursal', idSucursalEditin.value)
            if (!error) {
                toaster.success(`Sucursal actualizado exitosamente`);
                rechargeCatalogo()
                closeModal()
            } else {
                toaster.error(`Error: ${error} `);
            }
        }

        const deleteSucursal = async (evt) => {
            if (confirm("¿Realmente desea deshabilitar la sucursal?")) {
                const { error } = await supabase
                    .from('sucursales')
                    .update({ activo: 0 })
                    .eq('idsucursal', evt.idsucursal)
                if (!error) {
                    rechargeCatalogo()
                    toaster.success("Sucursal deshabilitada")
                }
            }
        }



        const setSucursalEdition = async (item) => {
            idSucursalEditin.value = item.idsucursal;
            sucursalPayload.direccion = item.direccion
            sucursalPayload.telefono = item.telefono
            sucursalPayload.sucursalmovil = convertNumberToBoolean(item.sucursalmovil)
            sucursalPayload.nombre = item.nombre

        }

        onMounted(() => {

        })

        onBeforeMount(() => {
            emitter.on("abrirModal", () => {
                abrirModal()
            })
            emitter.on("deleteItem", (evt) => {
                deleteSucursal(evt)
            })
            emitter.on("editItem", (evt) => {
                setSucursalEdition(evt)
                abrirModal()
            })
        })

        return {
            openModal,
            errors,
            validate,
            sucursalPayload: sucursalPayload,
            $v,
            saveSucursal,
            closeModal,
            idSucursalEditin,
            updateSucursal
        }
    }
}
</script>
<style></style>