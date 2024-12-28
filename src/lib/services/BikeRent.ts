import { bikeStore } from "$lib/stores/bikeStore.svelte";
import { BikeStatus } from "$lib/types/BikeStatus";
import { BACKEND_URL } from "../../config";

export class BikeRentService {
    static async startBike(bikeId: string) {
        const localBike = bikeStore.bikes.get(bikeId);

        if (!localBike) {
            throw new Error(`Bike with id ${bikeId} not found in local store`);
        }

        const backendBike = await this.getBike(bikeId);

        if (backendBike.status !== BikeStatus.Rented) {
            throw new Error(`Bike can only be started if it is rented.`);
        }

        if (localBike.renter === undefined) {
            localBike.renter = backendBike.renter;
        }
        localBike.status = BikeStatus.Rented;
        localBike.isTravelling = true;
        localBike.renter = backendBike.renter || localBike.renter;

        console.log(localBike);
        console.log(localBike.id); // real id
        console.log(localBike.status); // rented
        console.log(localBike.batteryLevel); //real battery level
        bikeStore.addOrUpdateBike(localBike);
    }
    private static async getBike(bikeId: string) {
        const response = await fetch(`${BACKEND_URL}/bike/${bikeId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch bike state: ${response.statusText}`);
        }
        return await response.json();
    }

    static async stopRent(bikeId: string) {
        // http://localhost:3535/rental/bike/6093c61e-a1f2-4a32-81db-b420a796d681/end-active
        const response = await fetch(`${BACKEND_URL}/rental/bike/${bikeId}/end-active`, {
            method: "POST",
        });
        if (!response.ok) {
            throw new Error(`Failed to stop rental: ${response.statusText}`);
        }
    }

    private static async getOngoingRental(bikeId: string) {
        const response = await fetch(`${BACKEND_URL}/rental/bike/${bikeId}/active`);
        if (!response.ok) {
            throw new Error(`Failed to fetch bike state: ${response.statusText}`);
        }
        return await response.json();
    }

}