import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
import { ItemRetrievalService } from 'services/item-retrieval.service';

import { Exercise } from '../services/models/exercise.model';
import { MovementPattern } from '../services/models/movement-pattern.model';
import { Workout } from '../services/models/workout.model';

import { ITEM_REFRENCE, TITLE_REFRENCE} from './misc/refrence';


@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.sass']
})
export class ItemListComponent implements OnInit {

  constructor(
    private _Activatedroute: ActivatedRoute,
    private _Itemreterieval: ItemRetrievalService
  ) { }

  add_item: boolean = false;
  TITLE_REF = TITLE_REFRENCE;
  ITEM = '';
  list: any[] = [];


  onClick() {
    console.log(this.list)
    switch(this.add_item){
      case false:
        this.add_item = true;
        break
      case true:
        this.add_item = false
        break
    }
  }

  ngOnInit(): void {
    /*
    Workout
    Movement Pattern (Workout Child)
    Exercise
    */ 
    var list;
    this._Activatedroute.paramMap.subscribe((params) => {
      this.ITEM = params.get("item") || '';
      this.internalOnInit();
    })
  }

  internalOnInit(): void {
    this.add_item = false;
    var ITEM = ITEM_REFRENCE[this.ITEM];
    this.list = [{name: 'Loading...'}]
    if (ITEM) {
      this._Itemreterieval.getAll(ITEM).subscribe(
        data => this.list = data
      )
      return;
    }
    this.list = [];
  }

  itemAdded(event: any) {
    if (event) this.internalOnInit();
  }

  itemRemove(item: any) {
    console.log(item);
    var carry_on = window.confirm("This may cause problems with other items in other list, are you sure you want to delete " +item.name)
    if (carry_on || !this.add_item) {
      var ITEM = ITEM_REFRENCE[this.ITEM];
      console.log("Delete")
      this._Itemreterieval.del(item._id, ITEM)?.subscribe(
        data=> {this.internalOnInit();}
      )
    } 
  }

}
