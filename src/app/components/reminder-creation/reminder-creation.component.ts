import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ReminderCreationRequest } from '../../interfaces/requests/reminder-creation-request';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-reminder-creation',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './reminder-creation.component.html'

})

export class ReminderCreationComponent {

  flatId?: number
  possibleMonthFrequences: number[] = []
  possibleDaysOfMonth: number[] = []
  reminderCreationForm = new FormGroup({
    reminderName: new FormControl('', [
      Validators.required,
      Validators.maxLength(28)
    ]),

    dayOfMonth: new FormControl('1', [
      Validators.required
    ]),

    monthFrequency: new FormControl('1', [
      Validators.required
    ])
  });

  get reminderName() {
    return this.reminderCreationForm.get("reminderName")
  }

  get dayOfMonth() {
    return this.reminderCreationForm.get("dayOfMonth")
  }

  get monthFrequency() {
    return this.reminderCreationForm.get("monthFrequency")
  }

  constructor(private backendService: BackendService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.flatId = Number(params['flatId'])
    })
    this.initiatePossibleMonthFrequences()
    this.initiatePossibleDaysOfMonth()
  }

  initiatePossibleMonthFrequences() {
    for (let i = 1; i < 13; i++) {
      this.possibleMonthFrequences.push(i)
    }
  }

  initiatePossibleDaysOfMonth() {
    for (let i = 1; i < 29; i++) {
      this.possibleDaysOfMonth.push(i)
    }
  }

  createReminder() {
    if (
      this.flatId &&
      this.reminderCreationForm.value.reminderName &&
      this.reminderCreationForm.value.dayOfMonth &&
      this.reminderCreationForm.value.monthFrequency
    ) {
      const reminderCreationRequest: ReminderCreationRequest = {
        flatId: this.flatId,
        reminderName: this.reminderCreationForm.value.reminderName,
        dayOfMonth: Number(this.reminderCreationForm.value.dayOfMonth),
        monthFrequency: Number(this.reminderCreationForm.value.monthFrequency)
      }
      this.backendService.createReminder(reminderCreationRequest).subscribe(() => {
        this.router.navigate([`/reminder-details/${this.flatId}`])
      })
    }
  }

}
