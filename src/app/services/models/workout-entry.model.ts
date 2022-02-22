//Workout Diary
export interface WorkoutEntry {
    workout_plan: string;//ObjectID
    completed: doneMovementPattern[];
    notes: String;
}

export interface doneMovementPattern {
    workout_section: string;//ObjectID
    completed_sets: doneSet[];
}

export interface doneSet {
    exercise: string;//ObjectID
    set_index: number;
    reps: number;
}
