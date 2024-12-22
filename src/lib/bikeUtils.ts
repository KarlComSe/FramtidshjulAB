import type { BikeAPIDto } from './types/BikeAPIDto';
import type { BikeType } from '$lib/types/Bike';
import { Bike } from '$lib/models/bike.svelte';
import type { BikePatchAPIDto } from './types/BikePatchAPIDto';

export function mapDtoToBike(dto: BikeAPIDto): BikeType {
    const bike = new Bike(dto);
    return bike;
}

export function mapBikeToPatchAPIDto(bike: BikeType): BikePatchAPIDto {
    return {
        batteryLevel: bike.batteryLevel,
        latitude: bike.latitude,
        longitude: bike.longitude,
        status: bike.status,
    };
}