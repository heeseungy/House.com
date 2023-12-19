// placesStore.js
import { defineStore } from 'pinia';

export const usePlacesStore = defineStore('places', {
    state: () => ({
        martDist: 0,
        storeDist: 0,
        schoolDist: 0,
        oilDist: 0,
        subwayDist: 0,
        bankDist: 0,
        restaurantDist: 0,
        cafeDist: 0,
        hospitalDist: 0,
        pharmacyDist: 0,
    }),
    actions: {
        setMartDist(distance) {
            this.martDist = distance;
        },
        setStoreDist(distance) {
            this.storeDist = distance;
        },
        setSchoolDist(distance) {
            this.schoolDist = distance;
        },
        setOilDist(distance) {
            this.oilDist = distance;
        },
        setSubwayDist(distance) {
            this.subwayDist = distance;
        },
        setBankDist(distance) {
            this.bankDist = distance;
        },
        setRestaurantDist(distance) {
            this.restaurantDist = distance;
        },
        setCafeDist(distance) {
            this.cafeDist = distance;
        },
        setHospitalDist(distance) {
            this.hospitalDist = distance;
        },
        setPharmacyDist(distance) {
            this.pharmacyDist = distance;
        }
    },
    getters: {
        getMartDist: (state) => state.martDist,
        getStoreDist: (state) => state.storeDist,
        getSchoolDist: (state) => state.schoolDist,
        getOilDist: (state) => state.oilDist,
        getSubwayDist: (state) => state.subwayDist,
        getBankDist: (state) => state.bankDist,
        getRestaurantDist: (state) => state.restaurantDist,
        getCafeDist: (state) => state.cafeDist,
        getHospitalDist: (state) => state.hospitalDist,
        getPharmacyDist: (state) => state.pharmacyDist,
    },
});