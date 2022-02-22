import { MovementPattern1 } from "./movement-pattern.model";

export interface Workout {
    _id: string;
    name: string;
    sections: string[];//ObjectID
}

export interface Workout1 {
    _id: string;
    name: string;
    sections: MovementPattern1[];
}

/*export interface Workout_lg {
    name: string;
    sections: WorkoutChild_md[];
}*/