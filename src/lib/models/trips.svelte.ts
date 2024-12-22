
export interface TripDto {
    id: string;
    bikeId: string;
    renter: string;
    startTime: string;
    endTime?: string;
    startLatitude: number;
    startLongitude: number;
    endLatitude?: number;
    endLongitude?: number;
}