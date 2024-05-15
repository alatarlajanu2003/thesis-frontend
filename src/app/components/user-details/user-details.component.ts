import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateUserRequest } from '../../interfaces/requests/update-user-request';
import { AuthService } from '../../services/auth.service';
import { BackendService } from '../../services/backend.service';
import { User } from '../../interfaces/user';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './user-details.component.html'
})
export class UserDetailsComponent implements OnInit {
  user?: User
  userId?: number

  userDetailsForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.maxLength(28),
      Validators.pattern("^[a-zA-Z]+$")
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.maxLength(28),
      Validators.pattern("^[a-zA-Z]+$")
    ]),
    phoneNumber: new FormControl(this.user?.phoneNumber, [
      Validators.required,
      Validators.pattern("^\\+[0-9]{7,15}$")
    ]),
    emailAddress: new FormControl(
      {value: '', disabled: true}
    ),
    preferredLanguage: new FormControl('', [
      Validators.required
    ]),
  })

  get firstName() {
    return this.userDetailsForm.get('firstName')
  }

  get lastName() {
    return this.userDetailsForm.get('lastName')
  }

  get phoneNumber() {
    return this.userDetailsForm.get('phoneNumber')
  }

  get emailAddress() {
    return this.userDetailsForm.get('emailAddress')
  }

  get preferredLanguage() {
    return this.userDetailsForm.get('preferredLanguage')
  }

  constructor(
    private backendService: BackendService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
      this.userId = this.authService.getUserId()
      if(this.userId) {
        this.backendService.getUser(this.userId).subscribe(user => {
          this.userDetailsForm.patchValue(
            {
              firstName: user.firstName,
              lastName: user.lastName,
              phoneNumber: user.phoneNumber,
              emailAddress: user.emailAddress,
              preferredLanguage: user.preferredLanguage
            }
          )
        })
      }
  }

  update() {
    if (
      this.userDetailsForm.value.firstName &&
      this.userDetailsForm.value.lastName &&
      this.userDetailsForm.value.phoneNumber &&
      this.userDetailsForm.value.preferredLanguage
    ) {
      const updateRequest: UpdateUserRequest = {
        firstName: this.userDetailsForm.value.firstName,
        lastName: this.userDetailsForm.value.lastName,
        phoneNumber: this.userDetailsForm.value.phoneNumber,
        preferredLanguage: this.userDetailsForm.value.preferredLanguage
      }
      this.backendService.updateUser(updateRequest, this.authService.getUserId()).subscribe(_ => {
        window.location.reload()
      })
    }
  }

}
