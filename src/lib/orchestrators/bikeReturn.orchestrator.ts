import { BikeRentService } from '$lib/services/BikeRent';
import { tripStore } from '$lib/stores/tripStore.svelte';
import { BikeStatus } from '$lib/types/BikeStatus';
import { bikeStore } from '$lib/stores/bikeStore.svelte';
import { BACKEND_URL } from '../../config';

export class BikeReturnOrchestrator {
    constructor(private bikeRentService: BikeRentService) {}

    async stopRent(bikeId: string) {
        try {
            this.bikeRentService.stopRent(bikeId);
            await this.backendEndBikeTrip(bikeId);
            await this.backendMakeBikeAvailable(bikeId);
            tripStore.endTrip(bikeId);
        } catch (error) {
            console.error('Error stopping rent:', error);
            throw new Error(`Failed to process bike return`);
        }
    }
    private async backendMakeBikeAvailable(bikeId: string) {
        const response = await fetch(`${BACKEND_URL}/bike/${bikeId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: BikeStatus.Available })
        });

        if (!response.ok) {
            throw new Error(`Failed to update backend about bike return: ${response.statusText}`);
        }
        
    }
    private async backendEndBikeTrip(bikeId: string) {
        const renter = bikeStore.bikes.get(bikeId)?.renter;

        if (!renter) {
            throw new Error(`Bike ${bikeId} has no renter`);
        }

        console.log('Ending trip for bike', bikeId);
        console.log('Method not implemented in backend');
    }
}