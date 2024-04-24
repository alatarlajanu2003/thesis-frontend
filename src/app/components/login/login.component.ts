import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginRequest } from '../../interfaces/requests/login-request';
import { AuthService } from '../../services/auth.service';
import { BackendService } from '../../services/backend.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  constructor(private backendService: BackendService, private router: Router, private authService: AuthService) { }

  loginForm = new FormGroup({
    emailAddress: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  })

  get emailAddress() {
    return this.loginForm.get('emailAddress')
  }

  get password() {
    return this.loginForm.get('password')
  }

  ngOnInit(): void {
    this.authService.deleteToken()
  }

  login() {
    if (this.loginForm.value.emailAddress && this.loginForm.value.password) {
      const loginRequest: LoginRequest = {
        emailAddress: this.loginForm.value.emailAddress,
        password: this.loginForm.value.password
      }
      this.backendService.login(loginRequest).subscribe(token => {
        this.authService.saveToken(token)
        this.router.navigate(["/home"])
      })
    }
  }
}
