import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginRequest } from '../../interfaces/requests/login-request';
import { BackendService } from '../../services/backend.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  constructor(private backendService: BackendService, private router: Router, private authService: AuthService) { }

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
      this.backendService.login(loginRequest).subscribe(token => {
        console.log(token)
        this.authService.saveToken(token)
        this.router.navigate(["/home"])
      })
    }
  }
}
