/**
 * @file bikeSync.ts
 * @description This file defines a BikeSyncService class that manages the 
 * synchronization of bike data with a backend server.
 * 
 * This is one way communication only. The backend is updated with the latest back. If update to the bike is included,
 * it will break the reactive nature implemented in the store.
 * 
 *  */

import { BikeStore, bikeStore } from "$lib/stores/bikeStore.svelte";
import { BACKEND_URL } from "../../config";
import { mapBikeToPatchAPIDto } from "$lib/bikeUtils";
import type { BikeType } from "$lib/types/Bike";

export class BikeSyncService {
    private bikeStore: BikeStore;

    constructor(bikeStore: BikeStore) {
        this.bikeStore = bikeStore;
    }

    private intervals = new Map<string, number>();

    startSync(bikeId: string, interval: number = 2000) {
        if (this.intervals.has(bikeId)) {
            console.warn(`Sync for bike ${bikeId} is already running. Restarting with new interval.`);
            this.stopSync(bikeId);
        }

        this.intervals.set(bikeId, setInterval(() => {
            this.syncBike(bikeId);
        }, interval));
    }

    stopSync(bikeId: string) {
        const interval = this.intervals.get(bikeId);
        if (!interval) {
            throw new Error(`Sync for bike ${bikeId} is not running`);
        }
        clearInterval(interval);
        this.intervals.delete(bikeId);
    }

    private syncBike(bikeId: string) {
        const bike = bikeStore.bikes.get(bikeId);
        if (!bike) {
            console.warn(`Bike with id ${bikeId} not found. Stopping sync.`);
            this.stopSync(bikeId);
            return;
        }

        this.syncBikeData(bike);
    }

    private async syncBikeData(bike: BikeType) {
        try {
            const response = await fetch(`${BACKEND_URL}/bike/${bike.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mapBikeToPatchAPIDto(bike)),
            });

            if (!response.ok) {
                console.error(`Failed to sync bike ${bike.id}: ${response.statusText}`);
            } else {
                console.info(`Bike ${bike.id} synced successfully.`);
            }
        } catch (error) {
            console.error(`Error syncing bike ${bike.id}:`, error);
        }
    }

    isSyncRunning(bikeId: string): boolean {
        return this.intervals.has(bikeId);
    }

    getRunningSyncs(): string[] {
        return Array.from(this.intervals.keys());
    }
}

export const bikeSyncService = new BikeSyncService(bikeStore);