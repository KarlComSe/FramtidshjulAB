import { GPSProvider } from '$lib/providers/GPSProvider';
import type { Position } from '$lib/types/Position';

export class ManualGPS extends GPSProvider {
    name = 'Manual GPS';

    private watchId: number | null = null;

    startUpdate(callback: (position: Position) => void, interval: number, route: Position[]) {
        
        (position) => {
                callback({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    timestamp: position.timestamp,
                    accuracy: position.coords.accuracy,
                });
            }
    }

    create branch! untrack the readme for awhile... 

    stopUpdate() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    async getCurrentPosition(): Promise<Position> {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        timestamp: position.timestamp,
                        accuracy: position.coords.accuracy,
                    });
                },
                (error) => {
                    reject(error);
                },
                { enableHighAccuracy: true, maximumAge: 0 }
            );
        });
    }
}