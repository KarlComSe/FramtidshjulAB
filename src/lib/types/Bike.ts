import type { BikeAPIDto } from '$lib/types/BikeAPIDto';
import type { BatteryStatus } from '$lib/types/BatteryStatus';

export interface BikeType extends BikeAPIDto {
    id: string;
    speed?: number;
    renter?: string;
    readonly batteryStatus: BatteryStatus;
    readonly moving: boolean;
    name?: string;
}


    // startRide(renter: string): void;
    // endRide(): void;
    // updateLocation(latitude: number, longitude: number): void;
    // updateStatus(status: BikeStatus): void;
    // updateBatteryLevel(batteryLevel: number): void;