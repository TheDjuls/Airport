import { defineStore } from 'pinia'


export const useFliesStore = defineStore('flies', {
    state: () => {
        return {
            listFlies: [],
            flyInfo: {},
            typeSeatSeach: null,
            seatsSelected: [],
            priceSelected: 0
        }
    },
    actions: {
        setListFlies(arreglo) {
            this.listFlies = arreglo
        },
        setFlyInfo(objeto) {
            this.flyInfo = objeto
        },
        setTypeSeatSeach(type) {
            this.typeSeatSeach = type
        },
        addSeat(asiento){
            this.seatsSelected.push(asiento)
        },
        setSeatsSelected(newList) {
            this.seatsSelected = newList
        },
        setPriceSelected(price) {
            this.priceSelected = price
        }
    }
})