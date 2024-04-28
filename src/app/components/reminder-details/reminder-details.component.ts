import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { Reminder } from '../../interfaces/reminder';

@Component({
  selector: 'app-reminder-details',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './reminder-details.component.html'
})
export class ReminderDetailsComponent implements OnInit {

  flatId?: number
  userId?: number
  isOwner: boolean = false
  reminders: Reminder[] = []

  constructor(
    private backendService: BackendService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.flatId = Number(params['flatId'])
    })

    this.userId = this.authService.getUserId()

    if (this.flatId) {
      this.backendService.getFlat(this.flatId).subscribe(flat => {
        if (this.userId) {
          if (flat.ownerId == this.userId) {
            this.isOwner = true
          }
        }
      })
      this.refreshReminderData(this.flatId)
    }
  }

  refreshReminderData(flatId: number) {
    this.reminders = []
    this.backendService.getReminders(flatId).subscribe(reminders => {
      for (let reminder of reminders) {
        const dayOfMonth: string = reminder.reminderFrequency.split(' ')[3]
        const monthFrequency: string = reminder.reminderFrequency.split(' ')[4].split('/')[1]

        this.reminders.push({
          id: reminder.id,
          flatId: reminder.flatId,
          reminderName: reminder.reminderName,
          reminderFrequency: `Every ${monthFrequency} month(s) on day ${dayOfMonth}`
        })
      }
    })
  }

  deleteReminder(reminderId: number) {
    if (confirm("Are you sure you want to delete this reminder?")) {
      this.backendService.deleteReminder(reminderId).subscribe(() => {
        if (this.flatId) {
          this.refreshReminderData(this.flatId)
        }
      })
    }
  }
}

