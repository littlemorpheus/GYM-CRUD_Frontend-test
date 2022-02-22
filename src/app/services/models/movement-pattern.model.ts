import { Exercise } from "./exercise.model";

export interface MovementPattern {
    //Key and Sub Parts
    id: string;
    name: string;
    variations: Map<string, string>;//Sort Later
    overall_reps: number;
    minimum_reps: number;
}

export interface MovementPattern1 {
    //Key and Sub Parts
    _id: string;
    name: string;
    variations: Map<string, Exercise>;
    overall_reps: number;
    minimum_reps: number;
}
