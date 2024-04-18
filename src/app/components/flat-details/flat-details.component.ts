import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { Payment } from '../../interfaces/payment';
import { Reading } from '../../interfaces/reading';
import { BackendService } from '../../services/backend.service';
import { Flat } from '../../interfaces/flat';
import { ActivatedRoute } from '@angular/router';
import { NgFor } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InvitationRequest } from '../../interfaces/requests/invitation-request';

@Component({
  selector: 'app-flat-details',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule],
  templateUrl: './flat-details.component.html'
})
export class FlatDetailsComponent implements OnInit {
  owner?: User
  flat?: Flat
  flatId?: number
  tenants: Array<User> = []
  payments: Array<Payment> = []
  readings: Array<Reading> = []

  constructor(private backendService: BackendService, private activatedRoute: ActivatedRoute) { }

  invitationForm = new FormGroup({
    emailAddress: new FormControl('', {nonNullable: true})
  });

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.flatId = Number(params['flatId'])
    })

    if (this.flatId) {
      this.backendService.getFlat(this.flatId).subscribe(flat => {
        this.flat = flat
      })
      this.backendService.getOwner(this.flatId).subscribe(owner => {
        this.owner = owner
      })
      this.backendService.getTenants(this.flatId).subscribe(tenants => {
        this.tenants = tenants
      })
      this.backendService.getPayments(this.flatId).subscribe(payments => {
        this.payments = payments
      })
      this.backendService.getReadings(this.flatId).subscribe(readings => {
        this.readings = readings
      })
    }
  }

  invite() {
    if (
      this.invitationForm.value.emailAddress &&
      this.flatId
    ) {
      const invitationRequest: InvitationRequest = {
        flatId: this.flatId,
        emailAddress: this.invitationForm.value.emailAddress
      }
      this.backendService.invite(invitationRequest).subscribe(response => {
        console.log(response)
      })
    }
  }
}
