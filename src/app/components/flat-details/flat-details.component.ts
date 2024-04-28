import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { Payment } from '../../interfaces/payment';
import { Reading } from '../../interfaces/reading';
import { BackendService } from '../../services/backend.service';
import { Flat } from '../../interfaces/flat';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InvitationRequest } from '../../interfaces/requests/invitation-request';
import { Reminder } from '../../interfaces/reminder';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-flat-details',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, DatePipe, SlicePipe, RouterLink, NgIf],
  templateUrl: './flat-details.component.html'
})
export class FlatDetailsComponent implements OnInit {
  owner?: User
  flat?: Flat
  flatId?: number
  tenants: Array<User> = []
  payments: Array<Payment> = []
  readings: Array<Reading> = []
  reminders: Array<Reminder> = []
  isOwner: Boolean = false

  constructor(private backendService: BackendService, private activatedRoute: ActivatedRoute, private authService: AuthService) { }

  invitationForm = new FormGroup({
    emailAddress: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  })

  get emailAddress() {
    return this.invitationForm.get('emailAddress')
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.flatId = Number(params['flatId'])
    })

    const userId = this.authService.getUserId()

    if (this.flatId) {
      this.backendService.getFlat(this.flatId).subscribe(flat => {
        this.flat = flat
      })
      this.backendService.getOwner(this.flatId).subscribe(owner => {
        this.owner = owner
        this.isOwner = userId == owner.id
      })
      this.refereshTenants(this.flatId)
      this.backendService.getPayments(this.flatId).subscribe(payments => {
        this.payments = payments
      })
      this.backendService.getReadings(this.flatId).subscribe(readings => {
        this.readings = readings
      })
      this.backendService.getReminders(this.flatId).subscribe(reminders => {
        this.reminders = this.getHumanReadableFrequency(reminders)
      })
    }
  }

  refereshTenants(flatId: number) {
    this.tenants = []
    const userId = this.authService.getUserId()
    if (userId && this.flatId) {
      this.backendService.getTenants(this.flatId).subscribe(tenants => {
        this.tenants = tenants
      })
    }
  }

  deleteTenant(flatId: number | undefined, tenantId: number) {
    if (confirm("Are you sure you want to delete this tenant?")) {
      if (flatId) {
        this.backendService.deleteTenant(flatId, tenantId).subscribe(_ =>
          this.refereshTenants(flatId)
        )
      }
    }
  }

  getHumanReadableFrequency(reminders: Reminder[]): Reminder[] {
    const remindersWithHumanReadableFrequency: Reminder[] = []
    for (let reminder of reminders) {
      const dayOfMonth: string = reminder.reminderFrequency.split(' ')[3]
      const monthFrequency: string = reminder.reminderFrequency.split(' ')[4].split('/')[1]

      remindersWithHumanReadableFrequency.push({
        id: reminder.id,
        flatId: reminder.flatId,
        reminderName: reminder.reminderName,
        reminderFrequency: `Every ${monthFrequency} month(s) on day ${dayOfMonth}`
      })
    }
    return remindersWithHumanReadableFrequency
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
