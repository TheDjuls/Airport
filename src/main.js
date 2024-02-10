import {createApp} from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './plugins/router'
import pinia from './plugins/pinia'
import emitter from './plugins/mitt'

const app = createApp(App)
app.config.globalProperties.emitter = emitter

app.use(vuetify)
app.use(router)
app.use(pinia)

app.mount('#app')
