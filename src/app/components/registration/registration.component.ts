import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RegistrationRequest } from '../../interfaces/requests/registration-request';
import { BackendService } from '../../services/backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registration.component.html'
})
export class RegistrationComponent {
  registrationForm = new FormGroup({
    firstName: new FormControl('', { nonNullable: true }),
    lastName: new FormControl('', { nonNullable: true }),
    phoneNumber: new FormControl('', { nonNullable: true }),
    emailAddress: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
    preferredLanguage: new FormControl('', { nonNullable: true }),
  });

  constructor(private backendService: BackendService, private router: Router) {}

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
      this.backendService.register(registrationRequest).subscribe(response => {
        console.log(response)
        this.router.navigate(['/login'])
      })
    }
  }

}
