/**
 * @file bikeStore.ts
 * @description This file defines a BikeStore class that manages the state of bikes in a Svelte application.
 * It provides methods to add, update, select, unselect, and clear bikes. The store uses Svelte's reactive 
 * stores to notify the application of state changes. The BikeStore class follows the singleton design pattern 
 * to ensure that there is only one instance of the store.
 */
import type { BikeType } from "$lib/types/Bike";
import { readable } from "svelte/store";

export class BikeStore {
    bikes = $state<Map<string, BikeType>>(new Map());

    bikesStore = readable(this.bikes, (set) => {
        $effect(() => {
            set(this.bikes); // Notify Svelte of state changes
        });
    });

    selectedBikeId = $state<string | null>(null);

    addOrUpdateBike(bike: BikeType) {
        this.bikes = new Map(this.bikes).set(bike.id, bike);
    }

    selectedBike = $derived(() => {
        if (!this.selectedBikeId) return null;
        return this.bikes.get(this.selectedBikeId) ?? null;
    });

    selectBike(bikeId: string) {
        if (!this.bikes.has(bikeId)) {
            console.warn(`Bike with id ${bikeId} not found`);
            return;
        }
        this.selectedBikeId = bikeId;
    }

    unselectBike() {
        this.selectedBikeId = null;
    }

    clear() {
        this.bikes = new Map();
        this.selectedBikeId = null;
    }

}

// singleton design pattern to ensure that there is only one instance of the store
export const bikeStore = new BikeStore();