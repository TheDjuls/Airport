<template>
  <v-container fluid class="contenedor">
    <v-row align="center" justify="center" class="fila">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Iniciar Sesión</v-toolbar-title>
          </v-toolbar>
          <v-form class="form">
            <div class="contenedorLogin">
              <h1 style="width: 100%;text-align: center;">RestaurantAll</h1>
              <v-text-field v-model="loginPayload.emailAddress" @blur="validate" :rules="[errors.emailAddress]"
                label="Correo" name="email" type="email" />
              <v-text-field v-model="loginPayload.password" @blur="validate" :rules="[errors.password]" id="password"
                label="Contraseña" name="password" type="password" />
            </div>
          </v-form>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" :disabled="$v.$invalid" @click="login">Entrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { supabase } from '@/plugins/supabase'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'

export default {
  setup() {
    const router = useRouter();
    const errors = ref({
      emailAddress: true
    });

    const loginPayload = reactive({
      password: '',
      emailAddress: ''
    })
    const rules = {
      password: { required },
      emailAddress: { required, email }
    }

    const $v = useVuelidate(rules, loginPayload)

    const validate = () => {
      $v.value.$touch()
      errors.value.emailAddress = !$v.value.emailAddress.$invalid || "Correo invalido"
      errors.value.password = !$v.value.password.$invalid || "Contraseña invalida"
    }

    const getUserInfo = async (userInfo) => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*, empresas(*)')
        .eq('usuario', userInfo.email)
        if(!error){
          if(data.length > 0){
            localStorage.setItem("user_db", JSON.stringify(data[0]))
          }
        }
    }

    const login = async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginPayload.emailAddress,
        password: loginPayload.password,
      })
      if (!error) {
        await getUserInfo(data.user)
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("session", JSON.stringify(data.session))
        router.push({ name: 'menu' });
        return
      }

      console.log(error)
    }

    return {
      loginPayload,
      errors,
      $v,
      login,
      validate
    }
  },
}
</script>

<style scoped>
.contenedor {
  height: 100vh;
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-position: center;
}

.contenedorLogin {
  width: 90%;
  margin: auto;
}

.fila {
  margin-top: 25vh;
}

.form {
  margin-top: 2%;
}</style>