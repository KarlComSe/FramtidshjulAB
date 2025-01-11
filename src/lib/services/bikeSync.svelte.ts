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

type BatchedPositionUpdate = {
    id: string;
    latitude: number;
    longitude: number;
}

export class BikeSyncService {
    private bikeStore: BikeStore;
    private subscribers: Map<string, Set<(status: boolean) => void>> = new Map();
    private intervals = $state(new Map<string, number>());
    private batchUpdates = $state<BatchedPositionUpdate[]>([]);
    private batchProcessingInterval: number | null = null;
    private lastProcessTime = $state(Date.now());
    private readonly BATCH_SIZE = 3000;
    private readonly BATCH_INTERVAL = 1000;
    private readonly MAX_BATCH_AGE = 1000;


    subscribe(bikeId: string, callback: (status: boolean) => void): () => void {
        if (!this.subscribers.has(bikeId)) {
            this.subscribers.set(bikeId, new Set());
        }
        this.subscribers.get(bikeId)!.add(callback);

        callback(this.isSyncRunning(bikeId));

        return () => {
            this.subscribers.get(bikeId)?.delete(callback);
            if (this.subscribers.get(bikeId)?.size === 0) {
                this.subscribers.delete(bikeId);
            }
        };
    }

    constructor(bikeStore: BikeStore) {
        this.bikeStore = bikeStore;
        this.startBatchProcessor();
    }

    private startBatchProcessor() {
        if (this.batchProcessingInterval) return;

        this.batchProcessingInterval = setInterval(() => {
            this.processBatch();
        }, this.BATCH_INTERVAL);
    }

    private async processBatch() {
        if (this.batchUpdates.length === 0) return;

        const currentTime = Date.now();
        const shouldProcess = 
            this.batchUpdates.length >= this.BATCH_SIZE || 
            currentTime - this.lastProcessTime >= this.MAX_BATCH_AGE;

        if (!shouldProcess) return;

        const updates = [...this.batchUpdates];
        this.batchUpdates = [];
        this.lastProcessTime = currentTime;

        try {
            await this.syncBatch(updates);
        } catch (error) {
            console.error('Failed to sync batch:', error);
            // Requeue failed updates
            this.batchUpdates.push(...updates);
        }
    }

    private async syncBatch(updates: BatchedPositionUpdate[]) {
        const response = await fetch(`${BACKEND_URL}/bike/batch/positions`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updates }),
        });

        if (!response.ok) {
            throw new Error(`Failed to sync batch: ${response.statusText}`);
        }
    }

    startSync(bikeId: string, interval: number = 2000) {
        console.log('Starting sync for bike:', bikeId);
        if (this.intervals.has(bikeId)) {
            console.warn(`Sync for bike ${bikeId} is already running. Restarting with new interval.`);
            return;
        }

        const newIntervals = new Map(this.intervals);
        newIntervals.set(bikeId, setInterval(() => {
            this.syncBike(bikeId);
        }, interval));
        this.intervals = newIntervals;

        this.subscribers.get(bikeId)?.forEach(callback => callback(this.isSyncRunning(bikeId)));
        console.log('Current intervals after start:', Array.from(this.intervals.keys()));
    }

    stopSync(bikeId: string) {
        console.log('Stopping sync for bike:', bikeId);
        const interval = this.intervals.get(bikeId);
        if (!interval) {
            throw new Error(`Sync for bike ${bikeId} is not running`);
        }

        // Clear the actual interval
        clearInterval(interval);

        // Update the intervals Map
        const newIntervals = new Map(this.intervals);
        newIntervals.delete(bikeId);
        this.intervals = newIntervals;

        this.subscribers.get(bikeId)?.forEach(callback =>
            callback(this.isSyncRunning(bikeId))
        );
        console.log('Current intervals after stop:', Array.from(this.intervals.keys()));
    }

    private syncBike(bikeId: string) {
        const bike = bikeStore.bikes.get(bikeId);
        if (!bike) {
            console.warn(`Bike with id ${bikeId} not found. Stopping sync.`);
            this.stopSync(bikeId);
            return;
        }

        this.syncBikePosition(bike);
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

    private syncBikePosition(bike: BikeType) {
        this.batchUpdates.push({
            id: bike.id,
            latitude: bike.latitude,
            longitude: bike.longitude
        });
        // try {
        //     const response = await fetch(`${BACKEND_URL}/bike/${bike.id}`, {
        //         method: 'PATCH',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({
        //             latitude: bike.latitude,
        //             longitude: bike.longitude,
        //         }),
        //     });

        //     if (!response.ok) {
        //         console.error(`Failed to sync bike ${bike.id} position: ${response.statusText}`);
        //     } else {
        //         console.info(`Bike ${bike.id} position synced successfully.`);
        //     }
        // } catch (error) {
        //     console.error(`Error syncing bike ${bike.id} position:`, error);
        // }
    }

    isSyncRunning(bikeId: string): boolean {
        return this.intervals.has(bikeId);
    }

    getRunningSyncs(): string[] {
        return Array.from(this.intervals.keys());
    }

    async cleanup() {
        if (this.batchProcessingInterval) {
            clearInterval(this.batchProcessingInterval);
            this.batchProcessingInterval = null;
        }
        this.intervals.forEach((_, bikeId) => {
            this.stopSync(bikeId);
        });

        if (this.batchUpdates.length > 0) {
            try {
                const finalUpdates = [...this.batchUpdates];
                this.batchUpdates.length = 0;
                await this.syncBatch(finalUpdates);
                console.log(`Final batch of ${finalUpdates.length} updates processed successfully`);
            } catch (error) {
                console.error('Failed to process final batch during cleanup:', error);
                throw error;
            }
        }
    }
}

export const bikeSyncService = new BikeSyncService(bikeStore);