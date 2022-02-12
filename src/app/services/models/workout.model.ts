import { WorkoutChild, WorkoutChild_md } from "./workout-child.model";

export interface Workout {
    id: string;
    name: string;
    sections: string[];//ObjectID
}

export interface Workout_md {
    id: string;
    name: string;
    sections: WorkoutChild[];
}

export interface Workout_lg {
    name: string;
    sections: WorkoutChild_md[];
}