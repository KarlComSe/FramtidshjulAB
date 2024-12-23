import { BACKEND_URL } from '../../config';
import { BatteryStatus } from '../types/BatteryStatus';
import type { BikeStatus } from '../types/BikeStatus';
import type { BikeType } from '../types/Bike';
import type { BikeAPIDto } from '$lib/types/BikeAPIDto';
import type { Position } from '$lib/types/Position';


export class Bike implements BikeType {
    id = $state('');
    status = $state<BikeStatus | undefined>(undefined);
    batteryLevel = $state(0);
    speed = $state<number | undefined>(undefined);
    latitude = $state<number | undefined>(undefined);
    longitude = $state<number | undefined>(undefined);
    renter = $state<string | undefined>(undefined);
    name = $state<string | undefined>(undefined);
    gpsPosition = $state<Position | undefined>(undefined);

    constructor(data: BikeAPIDto) {
        if (!data.id || !data.status || data.batteryLevel === undefined) {
            throw new Error("Missing required properties");
        }
        this.id = data.id;
        this.status = data.status;
        this.batteryLevel = data.batteryLevel;
        this.latitude = data.latitude;
        this.longitude = data.longitude;
        //this.name = ScooterNameGenerator.getInstance().popName();
    }

    // Use class fields with $derived
    readonly batteryStatus = $derived.by(() => {
        if (this.batteryLevel > 50) {
            return BatteryStatus.Green;
        }
        if (this.batteryLevel > 20) {
            return BatteryStatus.Yellow;
        }
        return BatteryStatus.Red;
    });

    readonly moving = $derived.by(() => {
        return this.speed !== undefined && this.speed > 0.5;
    });

    startRide(renter: string) {
        this.renter = renter;
    }

    endRide() {
        this.renter = undefined;
    }

    updateLocation(position: Position) {
        this.latitude = position.lat;
        this.longitude = position.lng;
        this.gpsPosition = position;
    }

    updateStatus(status: BikeStatus) {
        this.status = status;
    }

    updateBatteryLevel(batteryLevel: number) {
        this.batteryLevel = batteryLevel;
    }

    updateSpeed(speed: number) {
        this.speed = speed;
    }
    toString() {

        return `Bike {
    id: ${this.id},
    status: ${this.status},
    batteryLevel: ${this.batteryLevel},
    batteryStatus: ${this.batteryStatus},
    speed: ${this.speed},
    moving: ${this.moving},
    latitude: ${this.latitude},
    longitude: ${this.longitude},
    renter: ${this.renter},
    name: ${this.name}}`;

    }
}