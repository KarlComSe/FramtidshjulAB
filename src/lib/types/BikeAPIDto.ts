import type { BikeStatus } from "$lib/types/BikeStatus";

export interface BikeAPIDto {
    id : string;
    batteryLevel?: number;
    latitude?: number;
    longitude?: number;
    status: BikeStatus | undefined;
}
