import { Exercise } from "./exercise.model";

export interface MovementPattern {
    //Key and Sub Parts
    id: string;
    name: string;
    variations: [variations];//Sort Later
    overall_reps: number;
    minimum_reps: number;
}

export interface MovementPattern1 {
    //Key and Sub Parts
    _id: string;
    name: string;
    variations: [variations1];
    overall_reps: number;
    minimum_reps: number;
}

interface variations {
    key: string,
    value: Object,
}

interface variations1 {
    key: string,
    value: Exercise
}