import { Exercise } from "./exercise.model";

export interface WorkoutChild {
    //Key and Sub Parts
    id: string;
    name: string;
    variations: Object;//Sort Later
    overall_reps: number;
    minimum_reps: number;
}

/*export interface WorkoutChild_md {
    //Key and Sub Parts
    name: string;
    variations: Object;
    overall_reps: number;
    minimum_reps: number;
}*/
