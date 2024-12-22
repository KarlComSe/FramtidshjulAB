import { BACKEND_URL } from '../../config';
import { BatteryStatus } from '../types/BatteryStatus';
import type { BikeStatus } from '../types/BikeStatus';
import type { BikeType } from '../types/Bike';
import type { BikeAPIDto } from '$lib/types/BikeAPIDto';


export class Bike implements BikeType {
    id: string;
    status: BikeStatus;
    batteryLevel: number;
    speed: number | undefined;
    latitude: number | undefined;
    longitude: number | undefined;
    renter: string | undefined;
    name: string | undefined;

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

    updateLocation(latitude: number, longitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
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
        // Call the derived values to get their current values
        // it is working without this current... but it isn't working smoothly
        const currentBatteryStatus = this.batteryStatus;
        const currentMoving = this.moving;

        return `Bike {
    id: ${this.id},
    status: ${this.status},
    batteryLevel: ${this.batteryLevel},
    batteryStatus: ${currentBatteryStatus},
    speed: ${this.speed},
    moving: ${currentMoving},
    latitude: ${this.latitude},
    longitude: ${this.longitude},
    renter: ${this.renter},
    name: ${this.name}
}`;
    }
}