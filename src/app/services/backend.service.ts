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
import { PaymentCreationRequest } from '../interfaces/requests/payment-creation-request';
import { EvidenceUploadRequest } from '../interfaces/requests/evidence-upload-request';
import { ReadingCreationRequest } from '../interfaces/requests/reading-creation-request';
import { Reminder } from '../interfaces/reminder';
import { ReminderCreationRequest } from '../interfaces/requests/reminder-creation-request';

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

  getReminders(flatId: number) {
    return this.httpClient.get<Array<Reminder>>(`${this.baseUrl}/getReminders/${flatId}`)
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

  getNameOfUser(userId: number) {
    return this.httpClient.get<string>(`${this.baseUrl}/getNameOfUser/${userId}`)
  }

  createPayment(paymentCreationRequest: PaymentCreationRequest) {
    return this.httpClient.post(`${this.baseUrl}/createPayment`, paymentCreationRequest)
  }

  deletePayment(paymentId: number) {
    return this.httpClient.delete(`${this.baseUrl}/deletePayment/${paymentId}`)
  }

  uploadPaymentEvidence(paymentEvidenceUploadRequest: EvidenceUploadRequest, paymentId: number) {
    return this.httpClient.post(`${this.baseUrl}/uploadPaymentEvidence/${paymentId}`, paymentEvidenceUploadRequest)
  }

  deletePaymentEvidence(paymentId: number) {
    return this.httpClient.delete(`${this.baseUrl}/deletePaymentEvidence/${paymentId}`)
  }

  acknowledgePaymentEvidence(paymentId: number) {
    return this.httpClient.post(`${this.baseUrl}/acknowledgePaymentEvidence/${paymentId}`, null)
  }

  createReading(paymentCreationRequest: ReadingCreationRequest) {
    return this.httpClient.post(`${this.baseUrl}/createReading`, paymentCreationRequest)
  }

  deleteReading(readingId: number) {
    return this.httpClient.delete(`${this.baseUrl}/deleteReading/${readingId}`)
  }

  uploadReadingEvidence(readingEvidenceUploadRequest: EvidenceUploadRequest, readingId: number) {
    return this.httpClient.post(`${this.baseUrl}/uploadReadingEvidence/${readingId}`, readingEvidenceUploadRequest)
  }

  deleteReadingEvidence(readingId: number) {
    return this.httpClient.delete(`${this.baseUrl}/deleteReadingEvidence/${readingId}`)
  }

  acknowledgeReadingEvidence(readingId: number) {
    return this.httpClient.post(`${this.baseUrl}/acknowledgeReadingEvidence/${readingId}`, null)
  }

  deleteReminder(reminderId: number) {
    return this.httpClient.delete(`${this.baseUrl}/deleteReminder/${reminderId}`)
  }

  createReminder(reminderCreationRequest: ReminderCreationRequest) {
    return this.httpClient.post(`${this.baseUrl}/createReminder`, reminderCreationRequest)
  }

}
