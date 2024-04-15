import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../interfaces/requests/login-request';
import { Observable } from 'rxjs';
import { RegistrationRequest } from '../interfaces/requests/registration-request';
import { Flat } from '../interfaces/flat';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private baseUrl: string = 'http://localhost:9000'

  constructor(private httpClient: HttpClient) { }

  login(loginRequest: LoginRequest) {
    return this.httpClient.post<string>(`${this.baseUrl}/login`, loginRequest)
  }

  register(registrationRequest: RegistrationRequest) {
    return this.httpClient.post<string>(`${this.baseUrl}/register`, registrationRequest)
  }

  getRentedFlats(userId: number) {
    return this.httpClient.get<Array<Flat>>(`${this.baseUrl}/getRentedFlats/${userId}`)
  }

  getUser(userId: number) {
    return this.httpClient.get<User>(`${this.baseUrl}/getUser/${userId}`)
  }

}
