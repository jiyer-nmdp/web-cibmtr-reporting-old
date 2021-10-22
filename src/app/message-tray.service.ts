import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({ providedIn: 'root' })

export class MessageTrayService {

  private _data: BehaviorSubject<string> = new BehaviorSubject('');
  public _onEvent: Observable<string>

  constructor() {
    this._onEvent = this._data.asObservable();
  }

  public getMessage(): Observable<any>{
    return this._onEvent;
  }

  public get Data(): Observable<string>{
    return this._data.asObservable();
  }

  setMessage(message: string){
    this._data.next(message);
  }
}
