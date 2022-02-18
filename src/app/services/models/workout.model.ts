import { WorkoutChild } from "./workout-child.model";

export interface Workout {
    _id: string;
    name: string;
    sections: string[];//ObjectID
}

export interface Workout1 {
    id: string;
    name: string;
    sections: WorkoutChild[];
}

/*export interface Workout_lg {
    name: string;
    sections: WorkoutChild_md[];
}*/