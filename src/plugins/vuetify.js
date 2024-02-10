import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
    },
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            primary: "#DA983C",
            secondary: "#3E5641",
            error: '#A24936',
            info: '#83BCA9',
            success: '#82D173',
            warning: '#DBFF76',
          }
        },
      },
    },
  })
  
export default vuetify