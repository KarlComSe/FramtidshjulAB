/**
 * @file tripStore.ts
 * @description This file contains the TripStore class which manages the state of trips in a Svelte application.
 * It provides methods to start and end trips, save and load trips from localStorage, and clear all trips.
 */
import { browser } from '$app/environment';
import type { TripDto } from '$lib/models/trips.svelte.ts';

export class TripStore {
  trips = $state<TripDto[]>([]);

  constructor() {
    if (browser) {
      this.trips = this.load();
    }
  }

  startNewTrip(
    tripId: string,
    bikeId: string,
    renter: string,
    startLatitude: number,
    startLongitude: number
  ): string {
    if (this.hasOngoingTrip(bikeId)) {
      throw new Error(`Bike with id ${bikeId} is already in a trip. Will not add new trip.`);
    }
    console.log('Starting new trip', tripId, bikeId, renter, startLatitude, startLongitude);

    const trip: TripDto = {
      tripId,
      bikeId,
      renter,
      startTime: new Date().toISOString(),
      startLatitude,
      startLongitude,
    };
    this.trips = [...this.trips, trip];
    this.save();
    return trip.tripId;
  }

  endTrip(bikeId: string, endLatitude: number, endLongitude: number): void {
    const trip = this.trips.find((trip) => trip.bikeId === bikeId && !trip.endTime);

    if (!trip) {
      throw new Error(`Ongoing trip with bike id ${bikeId} not found. Cannot end trip.`);
    }

    trip.endTime = new Date().toISOString();
    trip.endLatitude = endLatitude;
    trip.endLongitude = endLongitude;
    this.save();
  }

  hasOngoingTrip(bikeId: string): boolean {
    return this.trips.some((trip) => trip.bikeId === bikeId && !trip.endTime);
  }

  private save() {
    localStorage.setItem('trips', JSON.stringify(this.trips));
  }

  private load(): TripDto[] {
    const trips = localStorage.getItem('trips');
    if (!trips) return [];

    try {
      const parsed = JSON.parse(trips) as TripDto[];
      if (!Array.isArray(parsed)) return [];

      return parsed.map((trip) => {
        if (
          !trip.tripId ||
          !trip.bikeId ||
          !trip.renter ||
          !trip.startTime ||
          !trip.startLatitude ||
          !trip.startLongitude
        ) {
          console.error('Invalid trip data:', trip);
          throw new Error('Invalid trip data in localStorage');
        }
        return {
          tripId: trip.tripId,
          bikeId: trip.bikeId,
          renter: trip.renter,
          startTime: trip.startTime,
          startLatitude: trip.startLatitude,
          startLongitude: trip.startLongitude,
          endLatitude: trip.endLatitude || null,
          endLongitude: trip.endLongitude || null,
          endTime: trip.endTime || null,
        } as TripDto;
      });
    } catch (error) {
      console.error('Failed to parse trips from localStorage:', error);
      throw error;
    }
  }

  clear(): void {
    this.trips = [];
    localStorage.removeItem('trips');
  }
}

// singleton design pattern to ensure that there is only one instance of the store
export const tripStore = new TripStore();
