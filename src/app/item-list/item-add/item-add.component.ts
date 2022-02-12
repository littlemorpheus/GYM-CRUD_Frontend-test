import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ItemRetrievalService } from 'services/item-retrieval.service';
import { ITEM_REFRENCE, TITLE_REFRENCE} from '../misc/refrence';

import { Exercise } from 'services/models/exercise.model';
import { WorkoutChild } from 'services/models/workout-child.model';
import { Workout } from 'services/models/workout.model';

import exercise_data from '../../services/forms/exercise.form.json';
import wo_child_data from '../../services/forms/workout-child.form.json';
import workout_data from '../../services/forms/workout.form.json';

@Component({
  selector: 'item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.sass']
})
export class ItemAddComponent implements OnInit {

  /**
   * Im going to have to actually look into Angular Forms for this 
   */

  constructor(
    private _Activatedroute: ActivatedRoute,
    private _Itemreterieval: ItemRetrievalService
  ) { }

  list: any[] = [];
  child_list: any[] = [];

  createLists(item: String) {
    console.log(item);
    if (item == 'workouts') item = 'workout-children';
    if (item == 'workout-children') item = 'exercises'
    this._Itemreterieval.getAll(item).subscribe(
      data => this.child_list = data
    )
  }

  generateInput(formComponent: itemForm): string {
    var element = '';
    switch(formComponent.type){
      case 'select':
        element =  `<select> \n`
        element += `<option *ngFor=\"let jtem of child_list\">${formComponent.label}</option> \n`
        element += `</select>`
        return element
      case 'text':
        element =  `<label>${formComponent.label}</label> \n
        <input type='text'>`
        return element
      case 'text':
          element =  `<label>${formComponent.label} </label> \n
          <input type='text'>`
    }
  return ''
  }

  ngOnInit(): void {
    this._Activatedroute.paramMap.subscribe((params) => {
      var ITEM = ITEM_REFRENCE[params.get("item") || ''];

      var dict : itemForm = Object.assign({}, exercise_data, wo_child_data, workout_data)
      this.list = dict[ITEM];
      this.createLists(ITEM);
    })
  }

}

interface itemForm {
  [id: string] : any
}
