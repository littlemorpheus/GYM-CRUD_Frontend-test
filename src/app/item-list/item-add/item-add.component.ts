import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ItemRetrievalService } from 'services/item-retrieval.service';
import { ITEM_REFRENCE, TITLE_REFRENCE} from '../misc/refrence';

import { Exercise } from 'services/models/exercise.model';
import { MovementPattern } from 'services/models/movement-pattern.model';
import { Workout } from 'services/models/workout.model';

import exercise_data from 'services/forms/exercise.form.json';
import wo_child_data from 'services/forms/workout-child.form.json';
import workout_data from 'services/forms/workout.form.json';
import { JSONFormControls, JSONFormData } from 'services/forms/forms.models'
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.sass']
})
export class ItemAddComponent implements OnInit {

  form_options: itemForm = {
    'exercises': exercise_data,
    'workout-children': wo_child_data,
    'workouts': workout_data
  }
  form_data: JSONFormData;
  myForm: FormGroup = new FormGroup({});
  nestedForms: any[] = [];
  //cause only one of each usally can just use the controls dict as ref
  //but these onlyu refer to rules for one entry
  //as we want mutiple entries need an array to keep track
  //To start array just bascially is {name: FormArray[FormGroup]}

  //FormGroups - Class to tie different Form Controls together into One Big Form
  //FormBuilder - Service used to mak ebuilding Forms Easier

  list: any[] = [];
  child_list: any[] = [];
  ITEM: any = '';

  constructor(
    private _Activatedroute: ActivatedRoute,
    private _Itemreterieval: ItemRetrievalService,
    private _fb: FormBuilder
  ) { }

  /*ON INIT*/
  ngOnInit(): void {
    //Getting the ITEM from the URL extension
    this._Activatedroute.paramMap.subscribe((params) => {
      var ITEM = ITEM_REFRENCE[params.get("item") || ''];
      this.ITEM = ITEM;
      
      var dict : itemForm = Object.assign({}, exercise_data, wo_child_data, workout_data)
      this.list = dict[ITEM];
      this.form_data = this.form_options[ITEM]
      console.log("form data")
      console.log(this.form_data)
      this.myForm = this.createForm(this.form_options[ITEM]);
      console.log("This isnt even my Final Form:")
      console.log(this.myForm);
      this.myForm.valueChanges.subscribe(console.log)
      this.createLists(ITEM);

      console.log("This is my Final Form:")
      console.log(this.myForm);
      console.log(this.nestedForms[0])
      console.log(this.nestedForms[0]['variations'])
      for (var item of this.nestedForms[0]['variations'].controls){
        console.log('1')
        console.log(item)
      }
    })
    //Valid, Invalid, Dirty, Pristine, Untouched, Pending
  }
  createLists(item: String) {
    console.log(item);
    if (item == 'workouts') item = 'workout-children';
    if (item == 'workout-children') item = 'exercises'
    this._Itemreterieval.getAll(item).subscribe(
      data => this.child_list = data
    )
  }

  /* Form Logic */
  createControl(control: JSONFormControls) {
    //Form Control = Form Element
    //console.log(this.form_data);

    const validatorsToAdd = [];
    console.log(control)
    for (const [key, value] of Object.entries(control.validators)){
      switch(key) {
        case 'min':
          validatorsToAdd.push(Validators.min(value));
          break
        case 'max':
          validatorsToAdd.push(Validators.max(value));
          break
        case 'minLength':
          validatorsToAdd.push(Validators.minLength(value));
          break
        case 'maxLength':
          validatorsToAdd.push(Validators.maxLength(value));
          break
        case 'required':
          if (value) validatorsToAdd.push(Validators.required);
          break
      }
    }
    var form: any
    if (control.type == "nested" && control.nested) {
      form = this._fb.array([this.createForm(control.nested), this.createForm(control.nested)]);
      this.nestedForms.push({
        [control.name] : form//why is it title
      })
      //this.addNested(form, control.name)
    } else {
      form = this._fb.control(control.value, validatorsToAdd)
    }
    //Form Creation
    return [
      [control.name], 
      form
    ]
  }
  createForm(controls: JSONFormData) {
    var myForm = this._fb.group({})
    for (const control of controls.controls) {
      var item = this.createControl(control)
      myForm.addControl(item[0], item[1]);
    }
    return myForm;
  }

  isInput(type: string): boolean {
    var options = [
      'text', 'password', 'email', 'number'
    ]
    if (options.includes(type)) return true;
    return false;
  }
  isSelect(type: string): boolean {
    if (type == "select") return true;
    return false;
  }
  isRange(type: string): boolean {
    if (type == "range") return true;
    return false;
  } 
  isNested(type: string): boolean {
    if (type == "nested") return true;
    return false;
  }

  onSubmit() {
    //POST
    //this._Itemreterieval.add(this.myForm, this.ITEM)
    console.log("Form")
    //console.log(this.myForm)
  }

  getNested(controls: JSONFormData, name: String) {
    /*[
      {
        "name": FormArray[FormGroup]
      }
    ]*/
    //Dictionary with all Nested Forms Created, w/ one element in FormArray
    //As added an element is added to the FormArray
    for (let [key, val] of Object.entries(this.nestedForms[0])) {
      //return FormArray which correlates to the name(key)
      if (name == key) return val;//this.createForm(controls);
    }
  }
  addNested(form: any, name: string) {
    /*[
      {
        "name": [value, value]
      }
    ]*/
    //const nestedForm = ['', ''];//this.createForm(controls);//Create Form Group
    console.log("Adding a Form")
    if (form instanceof FormGroup) {
      console.log(this.nestedForms[0][name])
    } else {
      console.log("Not a Form")
    }
    //this.nestedForms[0][name] = form;//nestedForm;
    //add to FormArray
    //[array of Forms].push(nestedForm)
  }
  delNested(ontrols: JSONFormData) {

  }

}

interface itemForm {
  [id: string] : any
}
