import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Exercise } from '../services/models/exercise.model';
import { MovementPattern } from './models/movement-pattern.model';
import { Workout, Workout1 } from '../services/models/workout.model';
import { WorkoutEntry } from './models/workout-entry.model';

@Injectable({
  providedIn: 'root'
})
export class ItemRetrievalService {

  constructor(
    private http: HttpClient
  ) { }

  private _apiURL = '/api/'
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  /*        GET        */
  get(id: String, item: String, version = 0) {
    switch (item) {
      case 'exercise':
        return this.getExercise(id);
      case 'workout-section':
        return this.getMovementPattern(id, version);
      case 'workout':
        return this.getWorkout(id, version);
    }
    return null
    /*
    var url = this._apiURL + item
    return this.http.get(url).pipe(
      tap(_ => console.log("Fetched all " + item)),
      catchError(this.errorHandler(`get ${item} | id=${id}`))
    )
    */
   
  }
  getWorkout(id: String, version: number) :Observable<any> {
    var ext = '';
    if (version > 0 && version < 3) ext = '/' +version;
    var url = this._apiURL + 'workout/' + id + ext;
    console.log(url)
    return this.http.get<Workout>(url).pipe(
      tap(_ => console.log("Fetched single  Workouts")),
      catchError(this.errorHandler<Workout>(`get single workout | id=${id}`))
    )
  }
  getMovementPattern(id: String, version: number) :Observable<MovementPattern> {
    var ext = '';
    if (version > 0 && version < 2) ext = '/' +version;
    var url = this._apiURL + 'workout-child/' + id + ext;
    return this.http.get<MovementPattern>(url).pipe(
      tap(_ => console.log("Fetched single Workout Child")),
      catchError(this.errorHandler<MovementPattern>(`get single workout child | id=${id}`))
    )
  }
  getExercise(id: String) :Observable<Exercise> {
    var url = this._apiURL + 'exercise/' + id;
    return this.http.get<Exercise>(url).pipe(
      tap(_ => console.log("Fetched single Exercise")),
      catchError(this.errorHandler<Exercise>(`get single exercise | id=${id}`))
    )
  }

  /*        GET all        */
  getAll(item: String) :Observable<Workout[] | MovementPattern[] | Exercise[]> {
    console.log('getAll()')
    console.log(item);
    switch (item) {
      case 'exercises':
        return this.getAllExercise();
      case 'workout-children':
        return this.getAllMovementPattern();
      case 'workouts':
        return this.getAllWorkout();
    }
    return this.getAllExercise();//QUICK BAD FIX
    /*
    var url = this._apiURL + item
    return this.http.get(url).pipe(
      tap(_ => console.log("Fetched all " + item)),
      catchError(this.errorHandler(`get all ${item}`))
    )
    */
  }
  getAllWorkout() :Observable<Workout[]> {
    var url = this._apiURL + 'workouts';
    return this.http.get<Workout[]>(url).pipe(
      tap(_ => console.log("Fetched all Workouts")),
      catchError(this.errorHandler<Workout[]>(`get all workout`))
    )
  }
  getAllMovementPattern() :Observable<MovementPattern[]> {
    var url = this._apiURL + 'workout-children';
    return this.http.get<MovementPattern[]>(url).pipe(
      tap(_ => console.log("Fetched all Movement Patterns")),
      catchError(this.errorHandler<MovementPattern[]>(`get all movement patterns`))
    )
  }
  getAllExercise() :Observable<Exercise[]> {
    var url = this._apiURL + 'exercises';
    return this.http.get<Exercise[]>(url).pipe(
      tap(_ => console.log("Fetched all Exercise")),
      catchError(this.errorHandler<Exercise[]>(`get all exercise`))
    )
  }


  add(formData: FormData, item: String, version = 0) {
    switch (item) {
      case 'exercises':
        return this.addExercise(formData);
      case 'workout-children':
        return this.addMovementPattern(formData);
      case 'workouts':
        return this.addWorkout(formData);
    }
    return null
  }
  addWorkout(formData: FormData) {
    var url = this._apiURL + 'workout';
    return this.http.post(url, formData).pipe(
      tap(_ => console.log("Sent of Workout")),
      catchError(this.errorHandler<Workout[]>(`POST a workout`))
    )
  }
  addMovementPattern(formData: FormData) {
    var url = this._apiURL + 'workout-child';
    return this.http.post(url, formData).pipe(
      tap(_ => console.log("Sent of Movement Pattern")),
      catchError(this.errorHandler<Workout[]>(`POST a movement pattern`))
    )
  }
  addExercise(formData: FormData) {
    var url = this._apiURL + 'exercise';
    return this.http.post(url, formData, this.httpOptions).pipe(
      tap(_ => console.log("Sent of Exercise")),
      catchError(this.errorHandler<Workout[]>(`POST a exercise`))
    )
  }
  addWorkoutEntry(data: WorkoutEntry) {
    var url = this._apiURL + 'workout-diary';
    return this.http.post(url, data).pipe(
      tap(_ => console.log("Sent of Workout Entry")),
      catchError(this.errorHandler<Workout[]>(`POST a workout entry`))
    )
  }

  
  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
   errorHandler<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      //this.log(`${operation} failed: ${error.message}`);
      //Message Servic????
      return of(result as T);
    };
  }

}
