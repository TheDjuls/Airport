<template>
    <div class="text-center">
        <v-menu v-model="menu" :close-on-content-click="false" location="start">
            <template v-slot:activator="{ props }">
                <v-btn prepend-icon="mdi-account" class="mr-2" v-bind="props">
                    {{ usuarioLogged != null ? usuarioLogged.nombre : 'Iniciar Sesion ' }}
                </v-btn>
            </template>

            <v-card v-if="usuarioLogged == null" min-width="300">
                <v-list>

                    <v-list-item>
                        <v-text-field density="compact" variant="outlined" label="Correo" 
                        single-line hide-details
                         v-model="userPayload.correo" :rules="[errors.correo]"></v-text-field>
                    </v-list-item>

                    <v-list-item>
                        <v-text-field density="compact" variant="outlined" label="Password" type="password"
                            single-line hide-details v-model="userPayload.password"
                            :rules="[errors.password]"></v-text-field>
                    </v-list-item>
                    <v-list-item v-if="isNewRegister">
                        <v-text-field  density="compact" variant="outlined" label="Nombre" single-line
                            hide-details v-model="userPayload.nombre" :rules="[errors.nombre]"></v-text-field>
                    </v-list-item>
                    <v-list-item v-if="isNewRegister">
                        <v-text-field  density="compact" variant="outlined" label="Apellido Paterno"
                            single-line hide-details v-model="userPayload.apellidoPaterno"
                            :rules="[errors.apellidoPaterno]"></v-text-field>
                    </v-list-item>
                    <v-list-item v-if="isNewRegister">
                        <v-text-field  density="compact" variant="outlined" label="Apellido Materno"
                            single-line hide-details v-model="userPayload.apellidoMaterno"
                            :rules="[errors.apellidoMaterno]"></v-text-field>
                    </v-list-item>
                    <v-list-item>
                        <div class="text-caption cursor-pointer text-center text-blue" @click="toogleTypeLogin">
                            {{ isNewRegister ? 'Ya tienes cuenta?' : 'Aun no te haz registrado?' }}</div>
                    </v-list-item>
                </v-list>

                <v-card-actions>
                    <v-btn class="mx-auto" color="primary" variant="text" :disabled="vuelidate.$invalid"
                        @click="isNewRegister ? registerNewUser() : login()">
                        {{ isNewRegister ? 'Registrar' : 'Iniciar Sesion' }}
                    </v-btn>
                </v-card-actions>
            </v-card>

            <v-card v-else min-width="300">
                <v-list>
                    <v-list-item prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
                        :title="(`${usuarioLogged.nombre} ${usuarioLogged.apellidoPaterno} ${usuarioLogged.apellidoMaterno}`)"
                        :subtitle="usuarioLogged.idTipoUsuario != 1 ? 'Premium' : 'Basico'">
                        <template v-slot:append>
                            <v-btn variant="text" icon="mdi-logout" @click="logout"></v-btn>
                        </template>
                    </v-list-item>
                    <v-list-item to="/myOrders" class="cursor-pointer">
                        <template v-slot:prepend>
                            <v-icon icon="mdi-note"></v-icon>
                        </template>

                        <v-list-item-title > Mis Ordenes</v-list-item-title>
                    </v-list-item>
                </v-list>

            </v-card>
        </v-menu>
    </div>
</template>
<script>
import { ref, reactive, onMounted } from 'vue'
import { email, required, minLength, maxLength, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useRouter } from 'vue-router';
import {
    saveUser,
    savePerson,
    getUserPerson
} from '@/services/mainpage.js'

export default {
    setup() {
        //variables
        const router = useRouter();
        const usuarioLogged = ref(null)
        const menu = ref(false)
        const isNewRegister = ref(false)
        const errors = ref({
        });

        let userPayload = reactive({
            nombre: '',
            correo: '',
            password: '',
            apellidoPaterno: '',
            apellidoMaterno: ''
        })

        const rules = {
            nombre: { requiredIf: requiredIf(isNewRegister), minLength: minLength(2), maxLength: maxLength(255) },
            correo: { required, email, maxLength: maxLength(255) },
            password: { required, minLength: minLength(6), maxLength: maxLength(10) },
            apellidoMaterno: { requiredIf: requiredIf(isNewRegister), minLength: minLength(2), maxLength: maxLength(255) },
            apellidoPaterno: { requiredIf: requiredIf(isNewRegister), minLength: minLength(2), maxLength: maxLength(255) },
        }

        const vuelidate = useVuelidate(rules, userPayload)

        const validate = () => {
            vuelidate.value.$touch()
            errors.value.nombre = !vuelidate.value.nombre.$invalid || "Nombre invalido , debe tener al menos 2 caracteres"
            errors.value.correo = !vuelidate.value.correo.$invalid || "Correo invalido, debe tener formato de correo. Ejemplo: correo@mail.com"
            errors.value.password = !vuelidate.value.password.$invalid || "Contraseña invalida, debe tener al menos 6 caracteres y maximo 10"
            errors.value.apellidoMaterno = !vuelidate.value.apellidoMaterno.$invalid || "Apellido invalido , debe tener al menos 2 caracteres"
            errors.value.apellidoPaterno = !vuelidate.value.apellidoPaterno.$invalid || "Apellido invalido , debe tener al menos 2 caracteres"
        }

        //methods
        const toogleTypeLogin = () => {
            isNewRegister.value = !isNewRegister.value;
        }

        const closeModal = () => {
            menu.value = false
        }

        const logout = () => {
            localStorage.clear()
            usuarioLogged.value = null
            router.go('/')
        }


        const updateDataSession = () => {
            usuarioLogged.value = { ...JSON.parse(localStorage.getItem("sessionPerson")), ...JSON.parse(localStorage.getItem("sessionUser")) }
            if (Object.keys(usuarioLogged.value).length === 0) {
                usuarioLogged.value = null
            }
        }

        const setSession = (user, person) => {
            localStorage.setItem('sessionUser', JSON.stringify(user));
            localStorage.setItem('sessionPerson', JSON.stringify(person));
            updateDataSession()
        }

        const login = () => {
            getUserPerson(userPayload.correo, userPayload.password).then((data) => {
                if (data.length > 0) {
                    setSession(data[0], data[0].personas[0])
                    closeModal()
                }
                else {
                    alert("Usuario o contraseña incorrecta")
                }
            }).catch((error) => { console.log(error) })
        }

        const registerNewUser = () => {
            saveUser(userPayload).then((responseUser) => {
                if (responseUser.length > 0) {
                    savePerson(userPayload, responseUser[0].id).then((responsePersona) => {
                        if (responsePersona.length > 0) {
                            setSession(responseUser[0], responsePersona[0])
                            closeModal()
                        }
                    }).catch((error) => { console.log(error) })
                }
            }).catch(error => {
                console.error(error)
            })
        }

        //lifecycle 
        onMounted(() => {
            updateDataSession()
        })

        return {
            login,
            logout,
            registerNewUser,
            validate,
            toogleTypeLogin,
            isNewRegister,
            menu,
            vuelidate,
            errors,
            userPayload,
            usuarioLogged
        }
    }
}
</script>
<style></style>