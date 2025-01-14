import { bikeStore } from '$lib/stores/bikeStore.svelte';
import { BikeStatus } from '$lib/types/BikeStatus';
import { BACKEND_URL } from '../../config';
import { tripStore, type TripStartParams } from '$lib/stores/tripStore.svelte';

interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

interface BikeResponse {
  id: string;
  batteryLevel: number;
  latitude: number | null;
  longitude: number | null;
  status: 'Rented' | 'Available' | 'Service';
  city: City | null;
  createdAt: string | null;
  updatedAt: string | null;
}

interface User {
  githubId: string;
  username: string;
}

interface TravelResponse {
  id: number;
  bike: BikeResponse;
  startTime: string | null;
  latStart: number | null;
  longStart: number | null;
  stopTime: string | null;
  latStop: number | null;
  longStop: number | null;
  customer: User;
  cost: number;
  startZoneType: 'Free' | 'Parking';
  endZoneType: 'Free' | 'Parking' | null;
  createdAt: string;
  updatedAt: string;
}

export class BikeRentService {
  static async startBike(bikeId: string): Promise<void> {
    const localBike = bikeStore.bikes.get(bikeId);

    if (!localBike) {
      throw new Error(`Bike with id ${bikeId} not found in local store`);
    }

    const backendBike = await this.getBike(bikeId);
    const ongoingRental = await this.getOngoingRental(bikeId);

    if (backendBike.status !== BikeStatus.Rented) {
      throw new Error(`Bike can only be started if it is rented, i.e. Status: Rented.`);
    }

    if (!ongoingRental) {
      throw new Error(
        `Bike can only be started if it is in an ongoing rental / trip. Contact support....`
      );
    }

    if (
      localBike.renter === undefined ||
      localBike.renter !== ongoingRental.renter ||
      localBike.status !== BikeStatus.Rented
    ) {
      this.updateBikeStoreRentedElements(
        bikeId,
        BikeStatus.Rented,
        ongoingRental.customer.username
      );
    }

    if (!tripStore.hasOngoingTrip(bikeId)) {
      const tripParams: TripStartParams = {
        tripId: ongoingRental.id,
        bikeId,
        renter: ongoingRental.customer.username,
        startLatitude: localBike.latitude,
        startLongitude: localBike.longitude,
      };
      tripStore.startNewTrip(tripParams);
    }
  }

  private static async getBike(bikeId: string): Promise<BikeResponse> {
    const response = await fetch(`${BACKEND_URL}/bike/${bikeId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch bike state: ${response.statusText}`);
    }
    return await response.json();
  }

  static async stopRent(bikeId: string): Promise<void> {
    const localBike = bikeStore.bikes.get(bikeId);
    if (!localBike) {
      throw new Error(`Bike with id ${bikeId} not found in local store`);
    }
    const response = await fetch(`${BACKEND_URL}/rental/bike/${bikeId}/end-active`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`Failed to stop rental: ${response.statusText}`);
    }
    tripStore.endTrip(bikeId, localBike.latitude, localBike.longitude);
    this.updateBikeStoreRentedElements(bikeId, BikeStatus.Available, undefined);
  }

  private static async getOngoingRental(bikeId: string): Promise<TravelResponse | undefined> {
    const response = await fetch(`${BACKEND_URL}/rental/bike/${bikeId}/active`);
    if (!response.ok) {
      throw new Error(`Failed to fetch bike state: ${response.statusText}`);
    }
    return await response.json();
  }

  private static updateBikeStoreRentedElements(
    bikeId: string,
    status: BikeStatus,
    renter: string | undefined
  ): void {
    const bike = bikeStore.bikes.get(bikeId);
    if (bike) {
      bike.status = status;
      bike.renter = renter;
      bikeStore.addOrUpdateBike(bike);
    }
  }
}
