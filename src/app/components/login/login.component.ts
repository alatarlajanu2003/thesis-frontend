import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginRequest } from '../../interfaces/requests/login-request';
import { BackendService } from '../../services/backend.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  constructor(private backendService: BackendService) { }

  loginForm = new FormGroup({
    emailAddress: new FormControl('', {nonNullable: true}),
    password: new FormControl('', {nonNullable: true}),
  });

  login() {
    if(this.loginForm.value.emailAddress && this.loginForm.value.password) {
      const loginRequest: LoginRequest = {
        emailAddress: this.loginForm.value.emailAddress,
        password: this.loginForm.value.password
      }
      this.backendService.login(loginRequest).subscribe(response => {
        console.log(response)
      })
    }
  }
}
