import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SpinnerService {
  private count = 0;
  private spinner$ = new BehaviorSubject<string>("");

  constructor() {}

  getSpinnerObserver(): Observable<string> {
    return this.spinner$.asObservable();
  }

  start() {
    if (++this.count === 1) {
      this.spinner$.next("start");
    }
  }

  end() {
    if (this.count === 0 || --this.count === 0) {
      this.spinner$.next("stop");
    }
  }

  reset() {
    this.count = 0;
    this.spinner$.next("stop");
  }
}
