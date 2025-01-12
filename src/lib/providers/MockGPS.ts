import { GPSProvider } from '$lib/providers/GPSProvider';
import type { Position } from '$lib/types/Position';

interface MockGPSConfig {
    route: Position[];
    updateInterval?: number;
    loop?: boolean;
    currentPositionIndex?: number;
}

export class MockGPS extends GPSProvider {
    name = 'Mock GPS';

    private route: Position[];
    private updateInterval: number;
    private loop: boolean;
    private currentPositionIndex = 0;
    private intervalId: number | null = null;

    constructor({ route, updateInterval = 2000, loop = false, currentPositionIndex }: MockGPSConfig) {
        super();
        this.route = route;
        this.updateInterval = updateInterval;
        this.loop = loop;
        this.currentPositionIndex = currentPositionIndex !== undefined ? currentPositionIndex : Math.floor(Math.random() * route.length);
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
        { lat: 57.711885, lng: 11.907913 },
        // Lundbyvassen
        { lat: 57.720049, lng: 11.955415 },
        // götaplatsen
        { lat: 57.697447, lng: 11.979825 },
        // linneplatsen?
        { lat: 57.696271, lng: 11.986638 },
        // götaplatsen
        { lat: 57.697447, lng: 11.979825 },
        // Lundbyvassen
        { lat: 57.720049, lng: 11.955415 },
        // Byalagsgatan 1 / Kyrkbytorget,
        { lat: 57.711885, lng: 11.907 }
    ]);
    static lisebergRoute = MockGPS.createRouteFromPositions([
        // Near Liseberg
        { lat: 57.70887, lng: 11.97456 },
        // Near Korsvägen
        { lat: 57.71087, lng: 11.98456 },
        // Near Södra Vägen
        { lat: 57.71587, lng: 11.99456 },
        // Near Scandinavium
        { lat: 57.72087, lng: 11.98456 },
        // Back to Liseberg
        { lat: 57.70887, lng: 11.97456 }
    ]);

    static hisingenRoute = MockGPS.createRouteFromPositions([
        // Near Hisingen
        { lat: 57.69087, lng: 11.95056 },
        // Near Ramberget
        { lat: 57.69587, lng: 11.96056 },
        // Near Kvillebäcken
        { lat: 57.70087, lng: 11.97056 },
        // Near Backaplan
        { lat: 57.70587, lng: 11.96056 },
        // Back to Hisingen
        { lat: 57.69087, lng: 11.95056 }
    ]);

    static majornaRoute = MockGPS.createRouteFromPositions([
        // Near Majorna
        { lat: 57.68087, lng: 11.93056 },
        // Near Slottskogen
        { lat: 57.68587, lng: 11.94056 },
        // Near Linnéplatsen
        { lat: 57.69087, lng: 11.95056 },
        // Near Järntorget
        { lat: 57.69587, lng: 11.94056 },
        // Back to Majorna
        { lat: 57.68087, lng: 11.93056 }
    ]);

    static frolundaRoute = MockGPS.createRouteFromPositions([
        // Near Frölunda
        { lat: 57.67087, lng: 11.91056 },
        // Near Ruddalen
        { lat: 57.67587, lng: 11.92056 },
        // Near Högsbo
        { lat: 57.68087, lng: 11.93056 },
        // Near Flatås
        { lat: 57.68587, lng: 11.92056 },
        // Back to Frölunda
        { lat: 57.67087, lng: 11.91056 }
    ]);

    static molndalRoute = MockGPS.createRouteFromPositions([
        // Near Mölndal
        { lat: 57.66087, lng: 11.89056 },
        // Near Åby
        { lat: 57.66587, lng: 11.90056 },
        // Near Krokslätt
        { lat: 57.67087, lng: 11.91056 },
        // Near Lackarebäck
        { lat: 57.67587, lng: 11.90056 },
        // Back to Mölndal
        { lat: 57.66087, lng: 11.89056 }
    ]);

    static kalltorpRoute = MockGPS.createRouteFromPositions([
        // Near Kålltorp
        { lat: 57.65087, lng: 11.87056 },
        // Near Delsjön
        { lat: 57.65587, lng: 11.88056 },
        // Near Örgryte
        { lat: 57.66087, lng: 11.89056 },
        // Near Skatås
        { lat: 57.66587, lng: 11.88056 },
        // Back to Kålltorp
        { lat: 57.65087, lng: 11.87056 }
    ]);

    static partilleRoute = MockGPS.createRouteFromPositions([
        // Near Partille
        { lat: 57.64087, lng: 11.85056 },
        // Near Sävedalen
        { lat: 57.64587, lng: 11.86056 },
        // Near Utby
        { lat: 57.65087, lng: 11.87056 },
        // Near Kviberg
        { lat: 57.65587, lng: 11.86056 },
        // Back to Partille
        { lat: 57.64087, lng: 11.85056 }
    ]);

    static angeredRoute = MockGPS.createRouteFromPositions([
        // Near Angered
        { lat: 57.63087, lng: 11.83056 },
        // Near Hjällbo
        { lat: 57.63587, lng: 11.84056 },
        // Near Gårdsten
        { lat: 57.64087, lng: 11.85056 },
        // Near Hammarkullen
        { lat: 57.64587, lng: 11.84056 },
        // Back to Angered
        { lat: 57.63087, lng: 11.83056 }
    ]);

    static bergsjonRoute = MockGPS.createRouteFromPositions([
        // Near Bergsjön
        { lat: 57.62087, lng: 11.81056 },
        // Near Kortedala
        { lat: 57.62587, lng: 11.82056 },
        // Near Gamlestaden
        { lat: 57.63087, lng: 11.83056 },
        // Near Kviberg
        { lat: 57.63587, lng: 11.82056 },
        // Back to Bergsjön
        { lat: 57.62087, lng: 11.81056 }
    ]);

    static saveRoute = MockGPS.createRouteFromPositions([
        // Near Säve
        { lat: 57.61087, lng: 11.79056 },
        // Near Tuve
        { lat: 57.61587, lng: 11.80056 },
        // Near Backa
        { lat: 57.62087, lng: 11.81056 },
        // Near Brunnsbo
        { lat: 57.62587, lng: 11.80056 },
        // Back to Säve
        { lat: 57.61087, lng: 11.79056 }
    ]);

    static routes = [
        MockGPS.goteborgRoute,
        MockGPS.lisebergRoute,
        MockGPS.hisingenRoute,
        MockGPS.majornaRoute,
        MockGPS.frolundaRoute,
        MockGPS.molndalRoute,
        MockGPS.kalltorpRoute,
        MockGPS.partilleRoute,
        MockGPS.angeredRoute,
        MockGPS.bergsjonRoute,
        MockGPS.saveRoute
    ];
}