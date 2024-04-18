import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subject, interval, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authTokenKey = 'AUTH_TOKEN'
  private profileId: number | null = this.getUserId()
  private profileIdSubject: Subject<number | null> = new Subject<number | null>()
  private tokenExpirationSubject: Subject<boolean> = new Subject<boolean>()

  constructor(private jwtHelper: JwtHelperService) { }

  saveToken(token: string) {
    localStorage.setItem(this.authTokenKey, token)
    this.refreshProfile()
  }

  refreshProfile() {
    this.profileId = this.getUserId()
    this.profileIdSubject.next(this.profileId)
  }

  deleteToken() {
    localStorage.removeItem(this.authTokenKey)
    this.refreshProfile()
  }

  getToken() {
    return localStorage.getItem(this.authTokenKey)
  }

  getUserId() {
    const token = this.getToken()
    if (token) {
      return this.jwtHelper.decodeToken(token)["userId"]
    }
    return null
  }

  startExpirationCountDown() {
    const unsubscribe = new Subject<void>()

    interval(1000)
      .pipe(takeUntil(unsubscribe))
      .subscribe(() => {
        if (this.jwtHelper.isTokenExpired(this.getToken())) {
          this.tokenExpirationSubject.next(true)
          unsubscribe.next()
        }
      })
  }

  getObservableUserId(): Observable<number | null> {
    return this.profileIdSubject
  }

  getObservableTokenExpiration(): Observable<boolean> {
    return this.tokenExpirationSubject
  }
}
