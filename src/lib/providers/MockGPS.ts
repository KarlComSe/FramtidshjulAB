import { GPSProvider } from '$lib/providers/GPSProvider';
import type { Position } from '$lib/types/Position';

interface MockGPSConfig {
    route: Position[];
    updateInterval?: number;
    loop?: boolean;
}

export class MockGPS extends GPSProvider {
    name = 'Mock GPS';

    private route: Position[];
    private updateInterval: number;
    private loop: boolean;
    private currentPositionIndex = 0;
    private intervalId: number | null = null;

    constructor({ route, updateInterval = 1000, loop = false }: MockGPSConfig) {
        super();
        this.route = route;
        this.updateInterval = updateInterval;
        this.loop = loop;
    }

    private watchId: number | null = null;

    startUpdate(callback: (position: Position) => void) {
        if (this.route.length === 0) {
            throw new Error('No route defined, route.length === 0');
        }

        this.intervalId = setInterval(() => {
            const position = {
                ...this.route[this.currentPositionIndex],
                timestamp: Date.now(),
            };
            callback(position);

            this.currentPositionIndex++;
            if (this.currentPositionIndex >= this.route.length) {
                if (this.loop) {
                    this.currentPositionIndex = 0;
                } else {
                    this.stopUpdate();
                }
            }
        }, this.updateInterval);
    }

    stopUpdate() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    // this isn't async, neither does it return a promise... will it be problematic? :) 
    async getCurrentPosition(): Promise<Position> {
        if (this.route.length === 0) {
            throw new Error('No route defined, route.length === 0');
        }
        if (this.currentPositionIndex >= this.route.length || this.currentPositionIndex < 0) {
            throw new Error('Undefined behavior, currentPositionIndex out of bounds');
        }
        
        return this.route[this.currentPositionIndex];
    }

    // mostly AI-generated code
    static createRouteFromPositions(positions: Position[], pointsPerSegment = 50) {
        const route: Position[] = [];
        for (let i = 0; i < positions.length - 1; i++) {
            const start = positions[i];
            const end = positions[i + 1];
            const latDiff = end.lat - start.lat;
            const lngDiff = end.lng - start.lng;
            for (let j = 0; j < pointsPerSegment; j++) {
                route.push({
                    lat: start.lat + (latDiff / pointsPerSegment) * j,
                    lng: start.lng + (lngDiff / pointsPerSegment) * j,
                });
            }
        }
        route.push(positions[positions.length - 1]);
        return route;
    }

    static goteborgRoute = MockGPS.createRouteFromPositions([
        // Byalagsgatan 1 / Kyrkbytorget,
        { lat: 57.711885, lng: 11.907913},
        // Lundbyvassen
        { lat: 57.720049, lng: 11.955415},
        // götaplatsen
        { lat: 57.697447, lng: 11.979825},
        // linneplatsen?
        { lat: 57.696271, lng: 11.986638}
    ]);
}