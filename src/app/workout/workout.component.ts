import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ItemRetrievalService } from 'services/item-retrieval.service';
import { Workout, Workout1 } from 'services/models/workout.model';
import { MovementPattern, MovementPattern1 } from 'services/models/movement-pattern.model'
import { WorkoutEntry, doneMovementPattern, doneSet } from 'services/models/workout-entry.model';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Exercise } from 'services/models/exercise.model';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.sass']
})
export class WorkoutComponent implements OnInit {

  constructor(
    private _Itemreterieval: ItemRetrievalService
  ) { }

  //workout = (workout_plan: workout plan id, completed_sections: [movement pattern])
  //movement_pattern = (workout_section: movement pattern id, completed_sets: [set])
  //set = (exercise: exercise id, set index: set index, reps: no. of reps in set)
  workout: WorkoutEntry;
  movement_patterns: doneMovementPattern[] = [];
  sets: doneSet[] = [];

  workout_list: Workout[] = [];
  TITLE = 'Options';

  canChangeChild: boolean = false;
  canChangeWorkout: boolean = false;
  setDone: boolean = false;
  workoutDone: boolean = false;

  _setCounter: number = 0;
  _repCounter: number = 0;

  current_workout: Workout1 | null = null;
  current_movement_pattern: MovementPattern1 | null = null;
  current_exercise: Exercise | null = null;
  
  _workout: WorkoutEntry;
  _min_prog: number = 50;//dont want a defualt value
  number_input: FormControl;

  ngOnInit(): void {
    this._Itemreterieval.getAllWorkout().subscribe(
      data => {
        //Recursivley go through Workout Plans
        this.workout_list = data
        this.canChangeWorkout = true;
      }
    )
  }

  showMovementPatternDone(movement_pattern: MovementPattern1): boolean {
    /* Check whether a Movement Pattern is done */
    for (var i = 0; i < this.movement_patterns.length; i++) {
      //Not ideal as works of assumputions no movement patterns reapeat
      if (this.movement_patterns[i].workout_section===movement_pattern._id) return false
    }

    if (this.current_workout && this.canChangeChild) return true;
    if (this.current_movement_pattern==movement_pattern) return true;

    //movementPattern is done
    return false;
  }

  /*          On [SET, MOVEMENT PATTERN, WORKOUT] done        */
  onSetDone(event: any) {
    //set = (exercise: exercise id, set index: set index, reps: no. of reps in set)
    var reps = event.target.prog.value;
    if (!reps || reps < 1) return;//later will add some error thingy

    var set: doneSet = {
      exercise: this.current_exercise!._id,
      set_index: this._setCounter,
      reps: reps
    }
    this.sets.push(set);
    console.log("SET DONE")

    var prog = event.target.prog.value;
    this._repCounter += +prog
    event.target.prog.value = '';
    if (this._repCounter > this._min_prog - 1) this.setDone = true;
  }
  onMovementPatternDone() {
    //movement_pattern = (workout_section: movement pattern id, completed_sets: [set])
    var movement_pattern: doneMovementPattern = {
      workout_section: this.current_movement_pattern!._id,
      completed_sets: this.sets
      //is sets[] being global good?
    }
    this.movement_patterns.push(movement_pattern);
    console.log("MOVEMENT PATTERN DONE");

    console.log("this.movement_patterns.length: " +this.movement_patterns.length)
    console.log("this.current_workout?.sections.length: " +this.current_workout?.sections.length)
    if (this.movement_patterns.length == this.current_workout?.sections.length) this.onWorkoutDone()

    this.newMovementPattern();
  }
  onWorkoutDone() {
    //workout = (workout_plan: workout plan id, completed_sections: [movement pattern])#
    var workout = {
      workout_plan: this.current_workout?._id,
      completed_sections: this.movement_patterns
      //is movement_patterns[] being global good?
    }
    this.workoutDone = true;
    console.log("WORKOUT DONE")
    
  }
  onDone() {
    /* POST workout to as Workout entry */
    if (!this.workout) return;
    this._Itemreterieval.addWorkoutEntry(this.workout);

  }

  /*        Starting a new [WORKOUT, SET]        */
  newWorkout() {
    /* Starting Movement Patterns afresh */
    this.movement_patterns = [];
  }
  newMovementPattern() {
    this.canChangeChild = true

    /* Starting sets afresh */
    this._setCounter = 0;
    this._repCounter = 0;
    this.setDone = false;
    this.sets = []
  }

  /*        Choosing a new [EXERCISE, MOVEMENT PATTERN, WORKOUT]        */
  setExercise(exercise: Exercise) { 
    this.current_exercise = exercise;//Sets the current exercise globally

    /*
    *Once an Exercise for a Movement Pattern is choosen,
    *that movement pattern is locked in
    */
    this.canChangeChild = false;
  }
  setMovementPattern(item: MovementPattern1) {
    if (this.canChangeChild) {

      if (this.current_movement_pattern == item) {
        this.current_movement_pattern = null;
        return
      } 

      this.current_movement_pattern = item;
    }
  }
  setWorkout(item: Workout) {
    this.newMovementPattern()/* new Movement Pattern to be picked */
    this.TITLE  = item.name;/* Set title */
    this.canChangeWorkout = false;/* Can no longer change Workout */
    this._Itemreterieval.getWorkout(item._id, 2).subscribe(
      data => {
        /* Retreieve Workout Plan Data */
        this.current_workout = data 
        console.log(this.current_workout)
      }
    )
  }

  /*        GETTERS & SETTERS        */
  getDict(item: any) {
    var key = Object.keys(item)[0];
    var value = item[key];
    return [key, value]
  }
  get progress() {
    return this._repCounter;
  }

  output(item: any) {
    console.log("Output Function: ")
    console.log(item)
  }
}
