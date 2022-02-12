
interface refrence {
    [id: string]: string
}

var TITLE_REFRENCE: refrence = {
    'exercises': 'Exercise',
    'movement-patterns': 'Movement Pattern',
    'workouts': 'Workout'
}
var ITEM_REFRENCE: refrence = {
    'exercises': 'exercises',
    'movement-patterns': 'workout-children',
    'workouts': 'workouts'
  }

export { TITLE_REFRENCE, ITEM_REFRENCE };