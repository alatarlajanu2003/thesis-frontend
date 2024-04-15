import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../interfaces/requests/login-request';
import { Observable } from 'rxjs';
import { RegistrationRequest } from '../interfaces/requests/registration-request';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private baseUrl: string = 'http://localhost:9000'

  constructor(private httpClient: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<string> {
    return this.httpClient.post<string>(`${this.baseUrl}/login`, loginRequest)
  }

  register(registrationRequest: RegistrationRequest) {
    return this.httpClient.post<string>(`${this.baseUrl}/register`, registrationRequest)
  }
}
