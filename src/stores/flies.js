import { defineStore } from 'pinia'


export const useFliesStore = defineStore('flies', {
    state: () => {
        return {
            listFlies: [],
            flyInfo: {}
        }
    },
    actions: {
        setListFlies(arreglo) {
            this.listFlies = arreglo
        },
        setFlyInfo(objeto) {
            this.flyInfo = objeto
        }
    }
})