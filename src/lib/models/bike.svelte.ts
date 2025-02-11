import { BatteryStatus } from '../types/BatteryStatus';
import { BikeStatus } from '../types/BikeStatus';
import type { BikeType } from '../types/Bike';
import type { BikeAPIDto } from '$lib/types/BikeAPIDto';
import type { Position } from '$lib/types/Position';
import { BikeRentService } from '$lib/services/BikeRent';
import { speedZoneStore } from '$lib/stores/speedZoneStore.svelte';

export class Bike implements BikeType {
  id = $state('');
  status = $state<BikeStatus | undefined>(undefined);
  batteryLevel = $state(0);
  speed = $state<number | undefined>(undefined);
  latitude = $state<number>(0);
  longitude = $state<number>(0);
  renter = $state<string | undefined>(undefined);
  name = $state<string | undefined>(undefined);
  gpsPosition = $state<Position | undefined>(undefined);
  isEquipmentOn = $state(true);
  isTravelling = $state(false);

  constructor(data: BikeAPIDto) {
    if (!data.id || !data.status || data.batteryLevel === undefined) {
      throw new Error('Missing required properties');
    }
    this.id = data.id;
    this.status = data.status;
    this.batteryLevel = data.batteryLevel;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
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

  readonly speedlimit = $derived.by(() => {
    if (!this.moving) {
      return undefined;
    }
    return (
      speedZoneStore.getSpeedLimitAtPoint({ latitude: this.latitude, longitude: this.longitude }) ??
      undefined
    );
  });

  async startRide(): Promise<void> {
    if (!this.isEquipmentOn) {
      throw new Error('Cannot start ride : equipment is off');
    }

    if (this.status !== BikeStatus.Rented || this.renter === undefined) {
      await BikeRentService.startBike(this.id);
    }

    this.isTravelling = true;
  }

  async endRide(): Promise<void> {
    this.renter = undefined;
    this.status = BikeStatus.Available;
    await BikeRentService.stopRent(this.id);
    this.isTravelling = false;
  }

  updateLocation(position: Position): void {
    this.latitude = position.lat + Math.random() * 0.0005;
    this.longitude = position.lng + Math.random() * 0.0005;
    this.gpsPosition = position;
  }

  updateStatus(status: BikeStatus): void {
    this.status = status;
  }

  updateBatteryLevel(batteryLevel: number): void {
    this.batteryLevel = batteryLevel;
  }

  updateSpeed(speed: number): void {
    this.speed = speed;
  }

  toggleIsTravelling(): void {
    if (!this.isEquipmentOn) {
      throw new Error('Cannot start ride : equipment is off');
    }

    if (this.status !== BikeStatus.Rented || this.renter === undefined) {
      this.startRide();
    }
    this.isTravelling = !this.isTravelling;
  }

  toString(): string {
    return `Bike {
    id: ${this.id},
    status: ${this.status},
    batteryLevel: ${this.batteryLevel},
    batteryStatus: ${this.batteryStatus},
    speed: ${this.speed},
    speedlimit: ${this.speedlimit},
    moving: ${this.moving},
    latitude: ${this.latitude},
    longitude: ${this.longitude},
    renter: ${this.renter},
    name: ${this.name}}`;
  }

  toggleEquipment(): void {
    this.isEquipmentOn = !this.isEquipmentOn;
    if (!this.isEquipmentOn) {
      this.isTravelling = false;
    }
  }
}
