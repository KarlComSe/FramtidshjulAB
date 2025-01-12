/**
 * @file bikeStore.ts
 * @description This file defines a BikeStore class that manages the state of bikes in a Svelte application.
 * It provides methods to add, update, select, unselect, and clear bikes. The store uses Svelte's reactive 
 * stores to notify the application of state changes. The BikeStore class follows the singleton design pattern 
 * to ensure that there is only one instance of the store.
 */
import type { BikeType } from "$lib/types/Bike";
import { GPSProvider } from "$lib/providers/GPSProvider";
import { Bike } from "$lib/models/bike.svelte";
// import { bikeSyncService } from "$lib/services/bikeSync.svelte";

export class BikeStore {
    private readonly UPDATE_INTERVAL = 1000; // Base interval
    private mainInterval: number | null = null;

    constructor() {
        this.startMainInterval();
    }

    private startMainInterval() {
        this.mainInterval = setInterval(() => {
            const now = Date.now();
            
            // Check speed timeouts
            for (const [bikeId, bike] of this.bikes.entries()) {
                const timeSinceUpdate = now - (bike.gpsPosition?.timestamp ?? Infinity);
                if (timeSinceUpdate > 5000 && bike.speed !== 0) {
                    bike.speed = 0;
                    console.log('No GPS update in 5 seconds. Resetting speed to 0');
                }
            }
        }, this.UPDATE_INTERVAL);
    }

    bikes = $state<Map<string, BikeType>>(new Map());
    private gpsProviders = new Map<string, GPSProvider>();
    private gpsTimeoutCheckers = new Map<string, number>();

    selectedBikeId = $state<string | null>(null);

    // it is not needed to create a new map, Svelte should be deeply reactive
    addOrUpdateBike(bike: BikeType) {
        const properBike = bike instanceof Bike ? bike : new Bike(bike);
        this.bikes.set(properBike.id, properBike);
        // this.bikes = new Map(this.bikes).set(properBike.id, properBike);
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

    setGPSProvider(bikeId: string, provider: GPSProvider) {
        this.stopGPSProvider(bikeId);
        console.log('Starting GPS provider for bike', bikeId);

        provider.startUpdate((position) => {
            console.log('New position', position);
            const bike = this.bikes.get(bikeId);

            if (!provider.validatePosition(position)) {
                console.warn('Invalid position', position);
                return;
            }

            if (bike instanceof Bike) {
                console.log('Updating bike position');
                const lastPosition = bike.gpsPosition;
                bike.updateLocation(position);
                if (lastPosition) {
                    bike.updateSpeed(provider.calculateSpeed(lastPosition, position));
                }
            }
        });

        // const timeoutChecker = setInterval(() => {
        //     const bike = this.bikes.get(bikeId);
        //     if (bike instanceof Bike) {
        //         const timeSinceUpdate = Date.now() - (bike.gpsPosition?.timestamp ?? Infinity);
        //         if (timeSinceUpdate > 5000 && bike.speed !== 0) {
        //             console.warn('No GPS update in 5 seconds. Resetting speed to 0');
        //             bike.updateSpeed(0);
        //         }
        //     }
        // }, 5000);

        // this.gpsTimeoutCheckers.set(bikeId, timeoutChecker);
        this.gpsProviders.set(bikeId, provider);
    }

    stopGPSProvider(bikeId: string) {
        const existing = this.gpsProviders.get(bikeId);
        if (existing) {
            existing.stopUpdate();
            this.gpsProviders.delete(bikeId);
        }
    }


    clear() {
        for (const bikeId of this.gpsProviders.keys()) {
            this.stopGPSProvider(bikeId);
        }

        // bikeSyncService.cleanup();
        
        this.bikes = new Map();
        this.selectedBikeId = null;
    }

}

// singleton design pattern to ensure that there is only one instance of the store
export const bikeStore = new BikeStore();