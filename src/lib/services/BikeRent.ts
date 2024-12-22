import { bikeStore } from "$lib/stores/bikeStore.svelte";
import { BikeStatus } from "$lib/types/BikeStatus";
import { BACKEND_URL } from "../../config";

export class BikeRentService {
    async startBike(bikeId: string) {
        const localBike = bikeStore.bikes.get(bikeId);

        if (!localBike) {
            throw new Error(`Bike with id ${bikeId} not found in local store`);
        }

        const backendBike = await this.getBike(bikeId);

        if (backendBike.status !== BikeStatus.Rented) {
            throw new Error(`Bike can only be started if it is rented.`);
        }

        bikeStore.addOrUpdateBike({
            ...localBike,
            status: BikeStatus.Rented,
            renter: backendBike.renter
        });

    }
    private async getBike(bikeId: string) {
        const response = await fetch(`${BACKEND_URL}/bikes/${bikeId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch bike state: ${response.statusText}`);
        }
        return await response.json();
    }

    stopRent(bikeId: string) {
        const localBike = bikeStore.bikes.get(bikeId);
        if (!localBike) {
            throw new Error(`Bike with id ${bikeId} not found in local store`);
        }

        const updatedBike = { ...localBike, status: BikeStatus.Available, renter: undefined };

        bikeStore.addOrUpdateBike(updatedBike);
    }
}