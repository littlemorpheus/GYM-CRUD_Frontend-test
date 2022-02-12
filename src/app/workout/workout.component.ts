import { Component, OnInit } from '@angular/core';
import { ItemRetrievalService } from 'services/item-retrieval.service';
import { Workout, Workout_md } from 'services/models/workout.model';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.sass']
})
export class WorkoutComponent implements OnInit {

  constructor(
    private _Itemreterieval: ItemRetrievalService
  ) { }

  workout_list: Workout_md[] | null = [];
  TITLE = 'Options';
  current_workout: Workout | null = null;

  onClick(item: Workout) {
    this.current_workout = item;
    this.TITLE  = item.name;
  }

  ngOnInit(): void {
    this._Itemreterieval.getAllWorkout().subscribe(
      data => {

      }
    )
  }

  recursion(i: number, data_list: []): Workout_md | null {
    if (i >  data_list.length) return null;
    var id = data_list[i]['id'];
    this._Itemreterieval.getAllWorkoutChild().subscribe(
      data => {
        var dict: Workout_md = {
          'id': id,
          'name': data_list[i]['name'],
          'sections': data
        };
        this.workout_list.push(this.recursion(i+1, data_list));
        return dict;
      }
    )
  }
}
