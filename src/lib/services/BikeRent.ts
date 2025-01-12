import { bikeStore } from '$lib/stores/bikeStore.svelte';
import { BikeStatus } from '$lib/types/BikeStatus';
import { BACKEND_URL } from '../../config';
import { tripStore } from '$lib/stores/tripStore.svelte';

export class BikeRentService {
  static async startBike(bikeId: string) {
    const localBike = bikeStore.bikes.get(bikeId);

    if (!localBike) {
      throw new Error(`Bike with id ${bikeId} not found in local store`);
    }

    const backendBike = await this.getBike(bikeId);
    const ongoingRental = await this.getOngoingRental(bikeId);
    console.log(ongoingRental);

    if (backendBike.status !== BikeStatus.Rented) {
      throw new Error(`Bike can only be started if it is rented, i.e. Status: Rented.`);
    }

    if (!ongoingRental) {
      console.log(ongoingRental);
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
      tripStore.startNewTrip(
        ongoingRental.id,
        bikeId,
        ongoingRental.customer.username,
        localBike.latitude,
        localBike.longitude
      );
    }
  }

  private static async getBike(bikeId: string) {
    const response = await fetch(`${BACKEND_URL}/bike/${bikeId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch bike state: ${response.statusText}`);
    }
    return await response.json();
  }

  static async stopRent(bikeId: string) {
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

  private static async getOngoingRental(bikeId: string) {
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
  ) {
    const bike = bikeStore.bikes.get(bikeId);
    if (bike) {
      bike.status = status;
      bike.renter = renter;
      bikeStore.addOrUpdateBike(bike);
    }
  }
}
