import type { SpeedZone } from "$lib/types/Polygon";
import booleanPointInPolygon from "@turf/points-within-polygon";
import type { Feature, Point, Polygon } from "geojson";


export class SpeedZoneStore {
    private speedZones = $state<SpeedZone[]>([]);

    add(speedZone: SpeedZone) {
        this.speedZones = [...this.speedZones, speedZone];
    }

    remove(speedZoneId: string): void {
        if (!this.speedZones.some(speedZone => speedZone.id === speedZoneId)) {
            console.warn(`Speed zone with id ${speedZoneId} not found. Cannot delete.`);
            throw new Error(`Speed zone with id ${speedZoneId} not found. Cannot delete.`);
            return;
        }

        this.speedZones = this.speedZones.filter(speedZone => speedZone.id !== speedZoneId);
    }

    getSpeedZone(speedZoneId: string): SpeedZone | undefined {
        return this.speedZones.find(speedZone => speedZone.id === speedZoneId);
    }

    /**
     * Will this be reactive in another Svelte component?
     * 
     */
    getSpeedZones(): SpeedZone[] {
        return this.speedZones
    }

    getSpeedLimitAtPoint(bikePosition: { latitude: number, longitude: number }): number | undefined {
        if (!bikePosition || typeof bikePosition.latitude !== 'number' || typeof bikePosition.longitude !== 'number') {
            throw new Error('Invalid bike position');
            return undefined;
        }
        // Add before creating the polygon


        const position: Feature<Point> = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [bikePosition.longitude, bikePosition.latitude]
            },
            properties: {}
        };

        for (const speedZone of this.speedZones) {
            if (speedZone.points.length < 3) {
                console.warn(`Speed zone ${speedZone.id} has fewer than 3 points and cannot form a valid polygon`);
                return undefined;
            }

            const polygon: Polygon = {
                type: 'Polygon',
                coordinates: [speedZone.points.map(point => [point.lng, point.lat])]
            };


            const isInPolygon = booleanPointInPolygon(position, polygon).features.length;
            if (isInPolygon) {
                return speedZone.speedLimit;
            }
        }

        return undefined;
    }
}

export const speedZoneStore = new SpeedZoneStore();