import type { BikeAPIDto } from '$lib/types/BikeAPIDto';
import type { BatteryStatus } from '$lib/types/BatteryStatus';
import type { GPSProvider } from '../providers/GPSProvider';
import type { Position } from '$lib/types/Position';

export interface BikeType extends BikeAPIDto {
    id: string;
    speed?: number;
    renter?: string | undefined;
    readonly batteryStatus: BatteryStatus;
    readonly moving: boolean;
    name?: string;
    gpsProvider?: GPSProvider;
    gpsPosition?: Position;
    isEquipmentOn: boolean;
    isTravelling: boolean;
    toggleEquipment(): void;
    toString(): string;
    toggleIsTravelling(): void;
    startRide(): void;
    endRide(): void;
}