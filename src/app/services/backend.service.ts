import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Flat } from '../interfaces/flat';
import { Payment } from '../interfaces/payment';
import { Reading } from '../interfaces/reading';
import { AcceptInvitationRequest } from '../interfaces/requests/accept-invitation-request';
import { FlatCreationRequest } from '../interfaces/requests/flat-creation-request';
import { InvitationRequest } from '../interfaces/requests/invitation-request';
import { LoginRequest } from '../interfaces/requests/login-request';
import { RegistrationRequest } from '../interfaces/requests/registration-request';
import { User } from '../interfaces/user';
import { UpdateUserRequest } from '../interfaces/requests/update-user-request';

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

  getOwnedFlats(userId: number) {
    return this.httpClient.get<Array<Flat>>(`${this.baseUrl}/getOwnedFlats/${userId}`)
  }

  getUser(userId: number) {
    return this.httpClient.get<User>(`${this.baseUrl}/getUser/${userId}`)
  }

  getOwner(flatId: number) {
    return this.httpClient.get<User>(`${this.baseUrl}/getOwner/${flatId}`)
  }

  getTenants(flatId: number) {
    return this.httpClient.get<Array<User>>(`${this.baseUrl}/getTenants/${flatId}`)
  }

  createFlat(flatCreationRequest: FlatCreationRequest) {
    return this.httpClient.post<FlatCreationRequest>(`${this.baseUrl}/createFlat`, flatCreationRequest)
  }

  getPayments(flatId: number) {
    return this.httpClient.get<Array<Payment>>(`${this.baseUrl}/getPayments/${flatId}`)
  }

  getReadings(flatId: number) {
    return this.httpClient.get<Array<Reading>>(`${this.baseUrl}/getReadings/${flatId}`)
  }

  getFlat(flatId: number) {
    return this.httpClient.get<Flat>(`${this.baseUrl}/getFlat/${flatId}`)
  }

  invite(invitationRequest: InvitationRequest) {
    return this.httpClient.post<InvitationRequest>(`${this.baseUrl}/invite`, invitationRequest)
  }

  acceptInvitation(token: AcceptInvitationRequest) {
    return this.httpClient.post(`${this.baseUrl}/acceptInvitation`, token)
  }

  updateUser(updateUserRequest: UpdateUserRequest, userId: number) {
    return this.httpClient.post(`${this.baseUrl}/updateUser/${userId}`, updateUserRequest)
  }
}
