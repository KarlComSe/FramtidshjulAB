import type { BikeAPIDto } from '$lib//types/BikeAPIDto';
import type { BikeType } from '$lib/types/Bike';
import { Bike } from '$lib/models/bike.svelte';
import type { BikePatchAPIDto } from './types/BikePatchAPIDto';

export function mapDtoToBike(dto: BikeAPIDto): BikeType {
  return new Bike(dto);
}

export function mapBikeToPatchAPIDto(bike: BikeType): BikePatchAPIDto {
  return {
    batteryLevel: bike.batteryLevel,
    latitude: bike.latitude,
    longitude: bike.longitude,
    status: bike.status,
  };
}
