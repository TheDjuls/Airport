<template>
    <div>
        <v-dialog v-model="openModal" persistent width="1024">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Añadir Usuario</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Nombre" @blur="validate" :rules="[errors.nombre]"
                                    v-model="usuarioPayload.nombre" placeholder="Jane Doe" type="text"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Correo" @blur="validate" :rules="[errors.usuario]"
                                    v-model="usuarioPayload.usuario" placeholder="janedoe@mail.com"
                                    type="text"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Contraseña" @blur="validate" :rules="[errors.password]"
                                    v-model="usuarioPayload.password" type="password"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-select :items="listadoSucursales" @blur="validate" :rules="[errors.sucursales]"
                                    v-model="usuarioPayload.sucursales" label="Sucursales" multiple item-title="nombre"
                                    item-value="idsucursal" hint="Sucursales a la que podra acceder"
                                    persistent-hint></v-select>
                            </v-col>
                            <v-col cols="6">
                                <v-select :items="listadoModulos" @blur="validate" :rules="[errors.modulos]"
                                    v-model="usuarioPayload.modulos" label="Modulos" multiple item-title="nombre"
                                    item-value="idmodulo" hint="Modulos que puede visualizar" persistent-hint></v-select>
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
                        @click="(idUsuarioEditing != null ? updateUsuario() : saveUsuario())">
                        Guarda Usuario
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
import { useVuelidate } from '@vuelidate/core'
import { email, required, minLength } from '@vuelidate/validators'
import toaster from '@/plugins/toaster';

export default {
    setup() {
        const openModal = ref(false)
        const listadoSucursales = ref([])
        const listadoModulos = ref([])
        const errors = ref({
        });
        const idUsuarioEditing = ref(null);

        let usuarioPayload = reactive({
            nombre: '',
            usuario: '',
            password: '',
            sucursales: [],
            modulos: []
        })

        const rules = {
            nombre: { required, minLength: minLength(2) },
            usuario: { required, email },
            password: { required, minLength: minLength(6) },
            sucursales: { required, minLength: minLength(1) },
            modulos: { required, minLength: minLength(1) },
        }

        const $v = useVuelidate(rules, usuarioPayload)

        const validate = () => {
            $v.value.$touch()
            errors.value.nombre = !$v.value.nombre.$invalid || "Nombre invalido , debe tener al menos 2 caracteres"
            errors.value.usuario = !$v.value.usuario.$invalid || "Usuario invalido, debe tener formato de correo. Ejemplo: correo@mail.com"
            errors.value.password = !$v.value.password.$invalid || "Contraseña invalida"
            errors.value.sucursales = !$v.value.sucursales.$invalid || "Selecciona al menos 1 sucursal"
            errors.value.modulos = !$v.value.modulos.$invalid || "Selecciona al menos 1 modulo"
        }

        const abrirModal = async () => {
            openModal.value = true
            await Promise.all([
                getSucursalesByEmpresa(),
                getModulos()
            ]);
        }

        const closeModal = async () => {
            openModal.value = false
            idUsuarioEditing.value = null
            usuarioPayload.nombre = ''
            usuarioPayload.usuario = ''
            usuarioPayload.password = ''
            usuarioPayload.sucursales = []
            usuarioPayload.modulos = []
        }

        const getSucursalesByEmpresa = async () => {
            const { data, error } = await supabase.from('sucursales')
                .select('')
                .eq('idempresa', getidUserLoggedInfoEmpresa())
            if (!error && data.length > 0) {
                listadoSucursales.value = data
            }
        }

        const getModulos = async () => {
            const { data, error } = await supabase.from('modulos')
                .select('')
            if (!error && data.length > 0) {
                listadoModulos.value = data
            }
        }

        const rechargeCatalogo = async () => {
            emitter.emit("rechargeCatalogo")
        }

        const saveUsuario = async () => {
            const arregloSucursales = [];
            const arregloModulos = [];


            const { data, error } = await supabase
                .from('usuarios')
                .insert({ idempresa: getidUserLoggedInfoEmpresa(), nombre: usuarioPayload.nombre, usuario: usuarioPayload.usuario, password: usuarioPayload.password })
                .select()
            if (!error) {
                for (const sucursal of usuarioPayload.sucursales) {
                    arregloSucursales.push({ idusuario: data[0].idusuario, idsucursal: sucursal })
                }
                for (const modulo of usuarioPayload.modulos) {
                    arregloModulos.push({ idusuario: data[0].idusuario, idmodulo: modulo, estatus: 1 })
                }
                const { error: errorSucursales } = await supabase
                    .from('usuarios_sucursales')
                    .insert(arregloSucursales)

                const { error: errorModulos } = await supabase
                    .from('usuarios_modulos')
                    .insert(arregloModulos)

                if (!errorModulos && !errorSucursales) {
                    toaster.success(`Usuario agregado exitosamente`);
                    rechargeCatalogo()
                    closeModal()
                } else {
                    toaster.error(`Error: ${errorModulos ? errorModulos : errorSucursales}`);
                }

            } else {
                toaster.error(`Error al agregar usuario`);
            }
        }

        const updateUsuario = async () => {
            const arregloSucursales = [];
            const arregloModulos = [];

            const { error } = await supabase
                .from('usuarios')
                .update({ idempresa: getidUserLoggedInfoEmpresa(), nombre: usuarioPayload.nombre, usuario: usuarioPayload.usuario, password: usuarioPayload.password })
                .eq('idusuario', idUsuarioEditing.value)
            if (!error) {
                for (const sucursal of usuarioPayload.sucursales) {
                    arregloSucursales.push({ idusuario: idUsuarioEditing.value, idsucursal: sucursal })
                }
                for (const modulo of usuarioPayload.modulos) {
                    arregloModulos.push({ idusuario: idUsuarioEditing.value, idmodulo: modulo, estatus: 1 })
                }

                const { error: eliminadoSucursales } = await supabase
                    .from('usuarios_sucursales')
                    .delete()
                    .eq('idusuario', idUsuarioEditing.value)
                const { error: eliminadoModulos } = await supabase
                    .from('usuarios_sucursales')
                    .delete()
                    .eq('idusuario', idUsuarioEditing.value)

                if (!eliminadoSucursales && !eliminadoModulos) {
                    const { error: errorSucursales } = await supabase
                        .from('usuarios_sucursales')
                        .upsert(arregloSucursales, { onConflict: ['idusuario', 'idsucursal'] });

                    const { error: errorModulos } = await supabase
                        .from('usuarios_modulos')
                        .upsert(arregloModulos, { onConflict: ['idusuario', 'idmodulo'] });

                    if (!errorModulos && !errorSucursales) {
                        toaster.success(`Usuario actualizado exitosamente`);
                        rechargeCatalogo()
                        closeModal()
                    } else {
                        toaster.error(`Error: ${errorModulos ? errorModulos : errorSucursales}`);
                    }
                }



            }
        }

        const deleteUsuario = async (evt) => {
            if (confirm("¿Realmente desea deshabilitar el usuario?")) {
                const { error } = await supabase
                    .from('usuarios')
                    .update({ activo: 0 })
                    .eq('idusuario', evt.idusuario)
                if (!error) {
                    rechargeCatalogo()
                    toaster.success("Usuario deshabilitado")
                }
            }
        }

        const getSucursalesAndModulosByUsuario = async (idusuario) => {
            const { data, error } = await supabase.rpc('getsucursalesandmodulosbyusuario', { pidusuario: idusuario });
            if (!error) {
                if (data.length > 0) {
                    const { resultado1, resultado2 } = data[0]
                    usuarioPayload.sucursales = resultado2
                    usuarioPayload.modulos = resultado1
                }
            }
        }

        const setUsuarioEdition = async (item) => {
            idUsuarioEditing.value = item.idusuario;
            usuarioPayload.nombre = item.nombre
            usuarioPayload.password = item.password
            usuarioPayload.usuario = item.usuario
            await getSucursalesAndModulosByUsuario(item.idusuario)
        }

        onMounted(() => {

        })

        onBeforeMount(() => {
            emitter.on("abrirModal", () => {
                abrirModal()
            })
            emitter.on("deleteItem", (evt) => {
                deleteUsuario(evt)
            })
            emitter.on("editItem", (evt) => {
                setUsuarioEdition(evt)
                abrirModal()
            })
        })

        return {
            openModal,
            listadoSucursales,
            listadoModulos,
            errors,
            validate,
            usuarioPayload,
            $v,
            saveUsuario,
            closeModal,
            idUsuarioEditing,
            updateUsuario
        }
    }
}
</script>
<style></style>