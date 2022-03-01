import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  @Output() itemAdded = new EventEmitter<boolean>();

  form_options: itemForm = {
    'exercises': exercise_data,
    'workout-children': wo_child_data,
    'workouts': workout_data
  }
  form_data: JSONFormData;
  myForm: FormGroup = new FormGroup({});
  //nestedForms: FormArray = new FormArray([]);
  nested_form_name = '';
  nestedControls: JSONFormData;
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
      var item_to_list = params.get("item")
      var ITEM = ITEM_REFRENCE[item_to_list || ''];
      this.ITEM = ITEM;
      
      var dict : itemForm = Object.assign({}, exercise_data, wo_child_data, workout_data)
      this.list = dict[ITEM];
      this.form_data = this.form_options[ITEM]
      console.log("form data: ")
      console.log(this.form_data)
      
      this.myForm = this.createForm(this.form_options[ITEM]);
      console.log("This isnt even my Final Form:")
      console.log(this.myForm);
      this.myForm.valueChanges.subscribe(console.log)

      this.createLists(ITEM);

      console.log("This is my Final Form:")
      console.log(this.myForm);
      console.log("Nested Form:")
      console.log(this.nestedForms)

      /**
       * Form Group has group of the controls + variation Form Array
       *      Form Array has Array of Form Groups
       *            These Form Groups each have the Form Control for each entry
       * 
       * Form Group -> Form Array -> Form Group -> Form Control
       * Movement Pattern -> Variations -> Single Level Variations -> Name, Exercise
       * 
       */
    })
    //Valid, Invalid, Dirty, Pristine, Untouched, Pending
  }
  createLists(item: String) {
    if (item == 'workouts') {
      this._Itemreterieval.getAll('workout-children').subscribe(
        data => this.child_list = data
      )
      return
    }
    if (item == 'workout-children') {
      this._Itemreterieval.getAll('exercises').subscribe(
        data => this.child_list = data
      )
      return
    }
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
      this.nestedControls = control.nested;

      form = this._fb.array([this.createForm(control.nested)]);

      this.nested_form_name = control.name;
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
      console.log(item)
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
  isHidden(type: string) {
    if (type == "hidden") return true;
    return false;
  }
  isSelect(type: string): boolean {
    if (type == "select") return true;
    return false;
  }
  isSelectMutiple(type: string) {
    if (type == "select-mutiple") return true;
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
    var form = this.myForm.value;

    console.log("Form")
    console.log(form)
    console.log(this.ITEM)
    this._Itemreterieval.add(form, this.ITEM)?.subscribe(
      res => { 
        console.log(res);
        if ('err' in res) console.log('Theres an error');
        if ('msg' in res) {
          console.log('Sucess');
          this.itemAdded.emit(true);
        }
      }
    )
  }

  addNested() {
    this.nestedForms.push(this.createForm(this.nestedControls))
  }
  delNested(index: number) {
    this.nestedForms.removeAt(index);
  }

  get nestedForms() {
    return this.myForm.get(this.nested_form_name) as FormArray
  }

  output(output: any) {
    console.log("Outputting Function:")
    console.log(output)
  }

}

interface itemForm {
  [id: string] : any
}
