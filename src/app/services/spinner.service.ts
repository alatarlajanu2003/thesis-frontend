import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private spinnerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  private activeBackendCallCount = 0

  constructor() { }

  turnSpinnerOn() {
    this.activeBackendCallCount += 1
    this.spinnerSubject.next(true)
  }

  turnSpinnerOff() {
    this.activeBackendCallCount -= 1
    if (this.activeBackendCallCount == 0) {
      this.spinnerSubject.next(false)
    }
  }

  getObservableSpinner(): Observable<boolean> {
    return this.spinnerSubject
  }
}
