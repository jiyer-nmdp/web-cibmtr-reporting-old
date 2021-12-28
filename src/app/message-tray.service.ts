import { Injectable } from '@angular/core';
import {Observable, ReplaySubject, Subject} from "rxjs";

@Injectable({ providedIn: 'root' })

export class MessageTrayService {

  private _data: Subject<any> = new ReplaySubject<any>();
  public _onEvent: Observable<any>

  constructor() {
    this._onEvent = this._data.asObservable();
  }

  public getMessage(): Observable<any>{
    return this._onEvent;
  }

  public setMessage(message: any){
    this._data.next(message);
  }
}
