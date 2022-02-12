//Workout Diary
export interface WorkoutEntry {
    workout_plan: string;//ObjectID
    completed: CompletedWOSection[];
    notes: String;
    date: Date;
}

interface CompletedWOSection {
    workout_section: string;//ObjectID
    completed_exercises: CompletedExercise[];
}

interface CompletedExercise {
    exercise: string;//ObjectID
    set_number: number;
    reps: number;
}
