import type { SpeedZone } from '$lib/types/Polygon';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import type { Feature, Point, Position, Polygon, BBox } from 'geojson';
import { bbox } from '@turf/turf';

interface GeoJSONSpeedZone {
  id: string;
  speedLimit: number;
  name: string;
  polygon: Feature<Polygon>;
}

export class SpeedZoneStore {
  private speedZones = $state<GeoJSONSpeedZone[]>([]);
  private zoneBboxes = new Map<string, BBox>();
  private cache = new Map<string, number>();

  private createPointFeature(latitude: number, longitude: number): Feature<Point> {
    return {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [longitude, latitude],
      },
      properties: {},
    };
  }

  private convertToGeoJSONZone(speedZone: SpeedZone): GeoJSONSpeedZone {
    const polygon: Feature<Polygon> = {
      type: 'Feature' as const,
      geometry: {
        type: 'Polygon' as const,
        coordinates: [speedZone.points.map((point) => [point.lng, point.lat])],
      },
      properties: {},
    };

    const geoJSONZone: GeoJSONSpeedZone = {
      name: speedZone.name,
      id: speedZone.id,
      speedLimit: speedZone.speedLimit,
      polygon,
    };

    // Calculate and cache the bounding box
    this.zoneBboxes.set(speedZone.id, bbox(polygon));

    return geoJSONZone;
  }

  add(speedZone: SpeedZone): void {
    const geoJSONZone = this.convertToGeoJSONZone(speedZone);
    this.speedZones = [...this.speedZones, geoJSONZone];
  }

  remove(speedZoneId: string): void {
    if (!this.speedZones.some((speedZone) => speedZone.id === speedZoneId)) {
      console.warn(`Speed zone with id ${speedZoneId} not found. Cannot delete.`);
      throw new Error(`Speed zone with id ${speedZoneId} not found. Cannot delete.`);
    }

    this.speedZones = this.speedZones.filter((speedZone) => speedZone.id !== speedZoneId);
  }

  getSpeedZone(speedZoneId: string): GeoJSONSpeedZone | undefined {
    return this.speedZones.find((zone) => zone.id === speedZoneId);
  }

  /**
   * Will this be reactive in another Svelte component?
   *
   */
  getSpeedZones(): GeoJSONSpeedZone[] {
    return this.speedZones;
  }

  getSpeedLimitAtPoint(bikePosition: { latitude: number; longitude: number }): number | undefined {
    this.validateBikePosition(bikePosition);

    const point = this.createPointFeature(bikePosition.latitude, bikePosition.longitude);

    const key = `${Math.round(bikePosition.latitude * 10000)},${Math.round(bikePosition.longitude * 10000)}`;
    if (this.cache.has(key)) {
      console.error('Cache hit');
      console.warn('Cache hit');
      return this.cache.get(key);
    }

    for (const zone of this.speedZones) {
      const boundingBox = this.zoneBboxes.get(zone.id);
      if (!boundingBox) continue;

      if (this.isWithinBoundingBox(boundingBox, point.geometry.coordinates)) {
        if (booleanPointInPolygon(point, zone.polygon)) {
          const limit = zone.speedLimit;
          this.cache.set(key, limit);
          return limit;
        }
      }
    }

    return undefined;
  }

  private isWithinBoundingBox(boundingBox: BBox, coordinates: Position): boolean {
    const [minX, minY, maxX, maxY] = boundingBox;
    const [longitude, latitude] = coordinates;
    return longitude >= minX && longitude <= maxX && latitude >= minY && latitude <= maxY;
  }

  private validateBikePosition(bikePosition: { latitude: number; longitude: number }): void {
    if (
      !bikePosition ||
      typeof bikePosition.latitude !== 'number' ||
      typeof bikePosition.longitude !== 'number'
    ) {
      throw new Error('Invalid bike position');
    }
  }
}

export const speedZoneStore = new SpeedZoneStore();
