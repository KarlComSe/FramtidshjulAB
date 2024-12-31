import type { Point } from "./Point";

export interface Polygon {
    id?: string;
    name?: string;
    type?: string;
    color?: string;
    points: Point[];
}

export interface SpeedZone extends Polygon {
    speedLimit: number;
}