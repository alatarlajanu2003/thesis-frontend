import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authTokenKey = 'AUTH_TOKEN'
  private profileId: number | null = this.getUserId()
  private profileIdSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(this.getUserId())

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
    if (this.getToken()) {
      return JSON.parse(window.atob(this.getToken()?.split('.')[1] as string))["userId"]
    }
    return null
  }

  getObservableUserId(): Observable<number | null> {
    return this.profileIdSubject.asObservable()
  }
}
