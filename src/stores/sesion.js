import { defineStore } from 'pinia'


export const useSesionStore = defineStore('sesion', {
    state: () => {
        return {
            usuario: {},
            sucursal: 0
        }
    },
    actions: {
        setUsuario(newUsuario) {
            this.usuario = newUsuario
        },
        setSucursal(newSucursal) {
            this.sucursal = newSucursal
        },
    }
})