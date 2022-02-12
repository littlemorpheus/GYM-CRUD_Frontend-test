import { Exercise } from "./exercise.model";

export interface WorkoutChild {
    //Key and Sub Parts
    id: string;
    name: string;
    level_one: string;//ObjectID
    level_two: string;//ObjectID
    level_three: string;//ObjectID
    level_four: string;//ObjectID
    gym_replacement: string;//ObjectID

    overall_reps: number;
    minimum_reps: number;
}

export interface WorkoutChild_md {
    //Key and Sub Parts
    name: string;
    level_one: Exercise;//ObjectID
    level_two: Exercise;//ObjectID
    level_three: Exercise;//ObjectID
    level_four: Exercise;//ObjectID
    gym_replacement: Exercise;//ObjectID

    overall_reps: number;
    minimum_reps: number;
}
