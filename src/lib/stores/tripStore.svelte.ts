/**
 * @file tripStore.ts
 * @description This file contains the TripStore class which manages the state of trips in a Svelte application. 
 * It provides methods to start and end trips, save and load trips from localStorage, and clear all trips.
 */

import type { TripDto } from "$lib/models/trips.svelte.ts";
import { readable } from "svelte/store";
import { v4 as uuidv4 } from 'uuid';

export class TripStore {

    trips = $state<TripDto[]>(this.load());

    tripsStore = readable(this.trips, (set) => {
        $effect(() => {
            set(this.trips); // Notify Svelte of state changes
        });
    });

    constructor() {
        $effect(() => {
            this.save();
        });
    }

    startNewTrip(bikeId: string, renter: string, startLatitude: number, startLongitude: number) {
        if (this.trips.some(trip => trip.bikeId === bikeId && !trip.endTime)) {
            console.info(`Bike with id ${bikeId} is already in a trip. Will not add new trip.`);
            return;
        }

        const trip: TripDto = {
            id: uuidv4(),
            bikeId,
            renter,
            startTime: new Date().toISOString(),
            startLatitude,
            startLongitude,
        };
        this.addTrip(trip);

        return trip.id;
    }

    private addTrip(trip: TripDto) {
        this.trips = [...this.trips, trip];
        // need to send start position and time to backend -- will be done separately ("separation of concerns")
    }

    endTrip(bikeId: string) {
        const trip = this.trips.find(trip => trip.bikeId === bikeId && !trip.endTime);

        if (!trip) {
            throw new Error(`Ongoing trip with bike id ${bikeId} not found. Cannot end trip.`);
        }

        trip.endTime = new Date().toISOString();
        this.trips = this.trips.map(t => t.id === trip.id ? trip : t);
    }

    save() {
        localStorage.setItem('trips', JSON.stringify(this.trips));
    }

    // some effort in parsing the trips from localStorage
    load() {
        const trips = localStorage.getItem('trips');
        if (trips) {
            try {
                const parsed = JSON.parse(trips);
                if (Array.isArray(parsed)) {
                    return parsed.map(trip => ({
                        id: trip.id || uuidv4(),
                        bikeId: trip.bikeId || '',
                        renter: trip.renter || '',
                        startTime: trip.startTime || new Date().toISOString(),
                        startLatitude: trip.startLatitude || null,
                        startLongitude: trip.startLongitude || null,
                        endLatitude: trip.endLatitude || null,
                        endLongitude: trip.endLongitude || null,
                        endTime: trip.endTime || null,
                    })) as TripDto[];
                }
            } catch (error) {
                console.error("Failed to parse trips from localStorage:", error);
            }
        }
        return [];
    }

    clear() {
        this.trips = [];
        localStorage.removeItem('trips');
    }
}

// singleton design pattern to ensure that there is only one instance of the store
export const tripStore = new TripStore();