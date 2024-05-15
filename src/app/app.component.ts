import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { User } from './interfaces/user';
import { AuthService } from './services/auth.service';
import { BackendService } from './services/backend.service';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false
  user?: User
  isSpinning?: boolean
  constructor(
    private authService: AuthService,
    private router: Router,
    private backendService: BackendService,
    private spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.spinnerService.getObservableSpinner().subscribe(isSpinning => {
      this.isSpinning = isSpinning
      this.cdr.detectChanges()
    })

    this.router.events.subscribe(value => {
      if (value instanceof NavigationEnd) {
        if (this.router.url.toString() == "/login") {
          this.authService.deleteToken()
        }
      }
    })

    this.authService.getObservableUserId().subscribe(userId => {
      if (userId) {
        this.isAuthenticated = true
        this.authService.startExpirationCountDown()
        this.backendService.getUser(userId).subscribe(user => {
          this.user = user
        })
      } else {
        this.isAuthenticated = false
      }
    })

    this.authService.getObservableTokenExpiration().subscribe(_ => {
      this.authService.deleteToken()
      this.router.navigate(['/login'])
    })
  }

  logout() {
    this.authService.deleteToken()
    this.router.navigate(["/login"])
  }
}
