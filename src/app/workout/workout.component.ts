import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ItemRetrievalService } from 'services/item-retrieval.service';
import { Workout, Workout1 } from 'services/models/workout.model';
import { WorkoutEntry } from 'services/models/workout-entry.model';

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
  TITLE = 'Options';

  canChangeChild: boolean = false;
  canChangeWorkout: boolean = false;
  setDone: boolean = false;
  
  _workout: WorkoutEntry;
  current_workout: any = null;
  current_child: any = null;
  current_exercise: any = null;
  _progress: number = 0;
  _min_prog: number = 50;//dont want a defualt value
  number_input: FormControl;

  onClickWorkout(item: Workout) {
    console.log(this.workout_list)
    this.canChangeChild = true
    this.TITLE  = item.name;
    this._Itemreterieval.getWorkout(item._id, 2).subscribe(
      data => {
        this.current_workout = data 
        console.log(this.current_workout)
      }
    )
 }
 onClickChild(item: any) {
   console.log("Clicked")
   this.canChangeWorkout = false
   if (this.canChangeChild) {
    if (this.current_child == item){
      this.current_child = '';
    } else {
      this.current_child = item;
    }
   }
 }

 onClickExercise(item: any) {
  console.log("Clicked")
  console.log(item)
  this.newExercise();
  this.current_exercise = item;
}

  ngOnInit(): void {
    console.log("18");
    this._Itemreterieval.getAllWorkout().subscribe(
      data => {
        //Recursivley go through Workout Plans
        console.log("19");
        this.workout_list = data
        console.log(this.workout_list)
        console.log("20");
        this.canChangeWorkout = true;
      }
    )
    console.log("21");
  }

  onSubmit(event: any) {
    console.log("submitted")
    var prog = event.target.prog.value;
    this._progress += +prog
    event.target.prog.value = '';

    if (this._progress > this._min_prog - 1) this.setDone = true;
  }
  newWorkout() {
    this.canChangeWorkout = false;
    /*this._workout = {
      workout_plan: this.current_workout._id,
      completed: {},
      notes: '',
    };*/
  }
  newExercise() {
    //When new Exercise Pressed
    this.setDone = false;
    this._progress = 0;
    this.canChangeChild = false;
  }
  finExercise() {
    //When finished Pressed
    this.canChangeChild = true;
    //Need to signfy the one is done
  }
  get progress() {
    return this._progress;
  }
}
