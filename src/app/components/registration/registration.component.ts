import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationRequest } from '../../interfaces/requests/registration-request';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './registration.component.html'
})

export class RegistrationComponent {
  registrationForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.maxLength(28),
      Validators.pattern("[a-zA-Z]")
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.maxLength(28),
      Validators.pattern("[a-zA-Z]")
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern("^\\+[0-9]{7,15}$")
    ]),
    emailAddress: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
      Validators.pattern("^.*[a-z].*$"),
      Validators.pattern("^.*[A-Z].*$"),
      Validators.pattern("^.*[0-9].*$"),
      Validators.pattern("^.*[!@#$%^&*_].*$")
    ]),
    preferredLanguage: new FormControl('', [
      Validators.required
    ]),
  })


  get firstName() {
    return this.registrationForm.get('firstName')
  }

  get lastName() {
    return this.registrationForm.get('lastName')
  }

  get phoneNumber() {
    return this.registrationForm.get('phoneNumber')
  }

  get emailAddress() {
    return this.registrationForm.get('emailAddress')
  }

  get password() {
    return this.registrationForm.get('password')
  }

  get preferredLanguage() {
    return this.registrationForm.get('preferredLanguage')
  }

  constructor(private backendService: BackendService, private router: Router) { }

  register() {
    if (
      this.registrationForm.value.firstName &&
      this.registrationForm.value.lastName &&
      this.registrationForm.value.phoneNumber &&
      this.registrationForm.value.emailAddress &&
      this.registrationForm.value.password &&
      this.registrationForm.value.preferredLanguage
    ) {
      const registrationRequest: RegistrationRequest = {
        firstName: this.registrationForm.value.firstName,
        lastName: this.registrationForm.value.lastName,
        phoneNumber: this.registrationForm.value.phoneNumber,
        emailAddress: this.registrationForm.value.emailAddress,
        password: this.registrationForm.value.password,
        preferredLanguage: this.registrationForm.value.preferredLanguage
      }
      this.backendService.register(registrationRequest).subscribe(() => {
        this.router.navigate(['/login'])
      })
    }
  }

}
