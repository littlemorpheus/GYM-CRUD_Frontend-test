import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ItemRetrievalService } from 'services/item-retrieval.service';
import { Workout, Workout1 } from 'services/models/workout.model';
import { MovementPattern, MovementPattern1 } from 'services/models/movement-pattern.model'
import { WorkoutEntry, doneMovementPattern, doneSet } from 'services/models/workout-entry.model';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Exercise } from 'services/models/exercise.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.sass']
})
export class WorkoutComponent implements OnInit {

  constructor(
    private _Itemreterieval: ItemRetrievalService
  ) { }

  workout_list: Workout[] = [];

  canChangeChild: boolean = false;
  canChangeWorkout: boolean = false;
  workoutDone: boolean = false;
  
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
    for (var i = 0; i < this.movement_patterns?.length; i++) {
      //Not ideal as works of assumputions no movement patterns reapeat
      if (this.movement_patterns[i].workout_section===movement_pattern._id) return false
    }

    if (this.current_workout && this.canChangeChild) return true;
    if (this.compare(this.current_movement_pattern, movement_pattern)) return true;

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
    this.pushJSON('sets', set);
    console.log("SET DONE")

    var prog = event.target.prog.value;
    this.incrementCounter('rep', +prog);
    this.incrementCounter('set', 1);
    event.target.prog.value = '';

  }
  onMovementPatternDone() {
    //movement_pattern = (workout_section: movement pattern id, completed_sets: [set])
    var movement_pattern: doneMovementPattern = {
      workout_section: this.current_movement_pattern!._id,
      completed_sets: this.sets
      //is sets[] being global good?
    }
    this.pushJSON("movement patterns", movement_pattern)
    console.log("MOVEMENT PATTERN DONE");

    console.log("this.movement_patterns.length: " +this.movement_patterns?.length)
    console.log("this.movement_patterns: " +JSON.stringify(this.movement_patterns))
    console.log("this.current_workout?.sections.length: " +this.current_workout?.sections.length)
    if (this.movement_patterns?.length == this.current_workout?.sections.length) this.onWorkoutDone()
    this.setJSON('current exercise', null)

    this.newMovementPattern();
  }
  onWorkoutDone() {
    //workout = (workout_plan: workout plan id, completed_sections: [movement pattern])#
    var workout: WorkoutEntry = {
      workout_plan: this.current_workout?._id || '',
      completed: this.movement_patterns,
      notes: ''
      //is movement_patterns[] being global good?
    }
    this.setJSON('workout', workout)
    this.workoutDone = true;
    console.log("WORKOUT DONE")
    
  }
  onDone() {
    /* POST workout to as Workout entry */
    if (!this.workout) return
    this._Itemreterieval.addWorkoutEntry(this.workout).subscribe(
      data=> {
        console.log("res: " + data)
        this.reset();
      }
    );

  }
  reset() {
    this.setCounter('res', 0)
    this.setCounter('set', 0)
    this.setJSON("workout", null);
    this.setJSON("movement patterns", null);
    this.setJSON("sets", null);
    this.setJSON("current workout", null);
    this.setJSON("current movement pattern", null);
    this.setJSON("current exercise", null);
    window.location.reload();
  }

  /*        Starting a new [WORKOUT, SET]        */
  newWorkout() {
    /* Starting Movement Patterns afresh */
    this.setJSON('movement patterns', {list: []});
  }
  newMovementPattern() {
    this.canChangeChild = true

    /* Starting sets afresh */
    this.setCounter('rep', 0);
    this.setCounter('set', 0);
    this.setJSON('sets', {list: []});
  }

  /*        Choosing a new [EXERCISE, MOVEMENT PATTERN, WORKOUT]        */
  setExercise(exercise: Exercise) { 
    this.setJSON('current exercise', exercise)

    /*
    *Once an Exercise for a Movement Pattern is choosen,
    *that movement pattern is locked in
    */
    this.canChangeChild = false;
  }
  setMovementPattern(item: MovementPattern1) {
    console.log("Setting MV")
    if (this.canChangeChild) {

      if (this.current_movement_pattern == item) {
        this.setJSON('current movement pattern', null)
        return
      }
      this.setJSON('current movement pattern', item)
      console.log(this.current_movement_pattern);
    }
  }
  setWorkout(item: Workout) {
    this.newMovementPattern()/* new Movement Pattern to be picked */
    this.newWorkout();
    sessionStorage.setItem('TITLE', item.name);/* Set title */
    this.canChangeWorkout = false;/* Can no longer change Workout */
    this._Itemreterieval.getWorkout(item._id, 2).subscribe(
      data => {
        /* Retreieve Workout Plan Data */
        this.setJSON('current workout', data)
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

  output(item: any, key: any = '') {
    //console.log("Output Function for "+key+": ")
    //console.log(item)
  }

  /*                GETTERS & SETTER                */
  compare(item1: Object | null, item2: Object | null) {
    if (!item1 || !item2) return false
    return JSON.stringify(item1) === JSON.stringify(item2)
  }
  setJSON(key: string, item: any) {
    if (item) { 
      item = JSON.stringify(item) 
      sessionStorage.setItem(key, item);
    }
    else { sessionStorage.removeItem(key); }
  }
  pushJSON(key: string, item: any) {
    var val = sessionStorage.getItem(key);
    console.log(val);
    console.log(val);
    if (val) { 
      var list = JSON.parse(val).list;
      console.log(JSON.stringify(list));
      list.push(item);
      console.log(JSON.stringify(list));
      this.setJSON(key, {list: list});
    }
  }
  get current_workout(): Workout1 | null {
    var item = sessionStorage.getItem('current workout');
    var wo = null;
    if (item) wo = JSON.parse(item)
    return wo;
  }
  get current_movement_pattern(): MovementPattern1 | null {
    var item = sessionStorage.getItem('current movement pattern');
    var mv = null;
    if (item) mv = JSON.parse(item)
    return mv;
  }
  get current_exercise(): Exercise | null {
    var item = sessionStorage.getItem('current exercise');
    var ex = null;
    if (item) ex = JSON.parse(item)
    return ex;
  }

  //workout = (workout_plan: workout plan id, completed_sections: [movement pattern])
  //movement_pattern = (workout_section: movement pattern id, completed_sets: [set])
  //set = (exercise: exercise id, set index: set index, reps: no. of reps in set)
  get workout(): WorkoutEntry {
    var item = sessionStorage.getItem('workout');
    var wo = null;
    if (item) wo = JSON.parse(item)
    return wo;
  }
  get movement_patterns(): doneMovementPattern[] {
    var item = sessionStorage.getItem('movement patterns');
    var mv = null;
    if (item) mv = JSON.parse(item).list
    return mv;
  }
  get sets(): doneSet[] {
    var item = sessionStorage.getItem('sets');
    var set = null;
    if (item) set = JSON.parse(item).list
    return set;
  }

  get TITLE() {
    return sessionStorage.getItem('TITLE');
  }

  getCounter(key: string) {
    switch(key) {
      case 'rep':
        return '_repCounter';
      case 'set':
        return '_setCounter';
      default:
        return null
    }
  }
  setCounter(arg: string, i: number) {
    var key = this.getCounter(arg); 
    if (key) sessionStorage.setItem(key, i.toString());
  }
  incrementCounter(arg: string, i: number) {
    var key = this.getCounter(arg);
    if(key) {
      var num = sessionStorage.getItem(key) || 0;
      i += +num;
      console.log(key + ' | ' + i)
      console.log(`${key}: i: ${i}   num: ${num}   stored:${sessionStorage.getItem(key)}`)
      sessionStorage.setItem(key, i.toString());
    }
  }
  get _setCounter(): number {
    var item = sessionStorage.getItem('_setCounter') || 0
    return +item
  }
  get _repCounter(): number {
    var item = sessionStorage.getItem('_repCounter') || 0
    return +item
  }
  get setDone() {
    if (this._repCounter > this._min_prog - 1) return true;
    return false;;
  }
}
