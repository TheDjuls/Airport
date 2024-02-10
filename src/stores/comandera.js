import { defineStore } from 'pinia'


export const useComanderaStore = defineStore('sesion', {
    state: () => {
        return {
            mostrarProductos: false,
            listadoProductos: [],
            ubicacionSeleccionada: {
                idmesa: 0,
                idComanda: 0,
                nombreMesa: '',
                productos: []
            }
        }
    },
    actions: {
        toggleMostrarProductos() {
            this.mostrarProductos = !this.mostrarProductos
        },
        setMostrarProductos(value) {
            this.mostrarProductos = value
        },
        setListadoProductos(arreglo) {
            this.listadoProductos = arreglo
        },
        setMesa(idMesa, nombre){
            this.ubicacionSeleccionada.idmesa = idMesa;
            this.ubicacionSeleccionada.nombreMesa = nombre;
        },
        setComandaAsignada(idComanda){
            this.ubicacionSeleccionada.idComanda = idComanda;
        },
        setProductos(productos){
            this.ubicacionSeleccionada.productos = productos;
        },
        clearComandera(){
            this.listadoProductos = [],
            this.ubicacionSeleccionada = {
                idmesa: 0,
                idComanda: 0,
                nombreMesa: '',
                productos: []
            }
        }
    }
})