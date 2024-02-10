import { createRouter, createWebHashHistory } from 'vue-router'
import Inicio from './../views/PaginaInicio.vue'

const Menu = () => import('./../views/MenuView.vue')
const ComanderaRestaurante = () => import('./../views/ComanderaRestaurante.vue')
const TicketDigital = () => import('./../components/caja/TicketDigital.vue')
const AdministracionView = () => import('./../views/AdministracionView.vue')

const routes = [
    { path: '/', name: 'inicio', component: Inicio },
    { path: '/Menu', name: 'menu', component: Menu },
    { path: '/Comandera', name: 'comandera', component: ComanderaRestaurante },
    { path: '/Ticket', name: 'ticket', component: TicketDigital },
    { path: '/Administracion', name: 'admin', component: AdministracionView },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

function validateAuth(to, from, next) {
    const isAuthenticated = localStorage.getItem("session");
    if (isAuthenticated) {
        next();
      } else {
        if (to.path !== '/') {
          next('/');
        } else {
          next();
        }
      }
}

// Agregar la función de validación globalmente para todas las rutas
router.beforeEach(validateAuth);


export default router