import { GPSProvider } from '$lib/providers/GPSProvider';
import type { Position } from '$lib/types/Position';

export class BrowserGPS extends GPSProvider {
    name = 'Browser GPS';

    private watchId: number | null = null;

    startUpdate(callback: (position: Position) => void) {
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                callback({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    timestamp: position.timestamp,
                    accuracy: position.coords.accuracy,
                });
            },
            (error) => {
                console.error('Error getting position', error);
            },
            { enableHighAccuracy: true, maximumAge: 0 }
        );
    }

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