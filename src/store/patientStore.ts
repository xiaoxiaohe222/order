import { defineStore } from 'pinia'

export const usePatientStore = defineStore('patient', {
    state: () => {
        return {
            currentPatient: { name: '', _id: '' }
        };
    },
    actions: {
        savePatient(patient: { name: string, _id: string }) {
            this.currentPatient = patient
        },
    },
})