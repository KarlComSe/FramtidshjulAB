import type { Position } from '$lib/types/Position';

export abstract class GPSProvider {
  abstract name: string;

  abstract startUpdate(callback: (position: Position) => void): void;
  abstract stopUpdate(): void;
  abstract getCurrentPosition(): Promise<Position>;

  validatePosition(position: Position): boolean {
    return position.lat >= -90 && position.lat <= 90 && position.lng >= -180 && position.lng <= 180;
  }

  // mostly AI-generated code
  calculateSpeed(lastPosition: Position | null, position: Position): number {
    if (!lastPosition) return 0;

    const lat1 = lastPosition.lat;
    const lon1 = lastPosition.lng;
    const lat2 = position.lat;
    const lon2 = position.lng;

    if (!position.timestamp || !lastPosition.timestamp) return 0;

    const timeMs = position.timestamp - lastPosition.timestamp;

    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    const timeSeconds = timeMs / 1000;
    const speedMps = distance / timeSeconds;
    const speedKph = speedMps * 3.6;

    console.log('Speed', speedKph);
    return Math.round(speedKph * 10) / 10;
  }
}
