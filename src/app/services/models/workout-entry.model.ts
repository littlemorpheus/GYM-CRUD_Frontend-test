//Workout Diary
export interface WorkoutEntry {
    workout_plan: string;//ObjectID
    completed: CompletedWOSection[];
    notes: String;
}

export interface CompletedWOSection {
    workout_section: string;//ObjectID
    completed_exercises: CompletedExercise[];
}

export interface CompletedExercise {
    exercise: string;//ObjectID
    set_number: number;
    reps: number;
}
