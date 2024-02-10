import { createRouter, createWebHashHistory } from 'vue-router'
import Inicio from './../views/MainPage.vue'

const routes = [
    { path: '/', name: 'inicio', component: Inicio },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})


export default router