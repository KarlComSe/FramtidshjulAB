import type { BikeStatus } from "$lib/types/BikeStatus";

export interface BikePatchAPIDto {
    batteryLevel?: number;
    latitude?: number;
    longitude?: number;
    status: BikeStatus;
}
