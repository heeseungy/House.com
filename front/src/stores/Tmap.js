// TmapStore.js
import { defineStore } from 'pinia';

export const useTmapStore = defineStore('tmap', {
    state: () => ({
        time: 0,
        distance: 0,
    }),
    actions: {
        setTime(time) {
            this.time = time;
        },
        setDistance(distance) {
            this.distance = distance;
        },
    },
    getters: {
        getTime: (state) => state.time,
        getDistance: (state) => state.distance,
    },
});