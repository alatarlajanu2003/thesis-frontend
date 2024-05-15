import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-accept-invitation',
  standalone: true,
  imports: [],
  templateUrl: './accept-invitation.component.html'
})
export class AcceptInvitationComponent implements OnInit {

  constructor(
    private backendService: BackendService, 
    private activatedRoute: ActivatedRoute, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (this.authService.getUserId()) {
        this.backendService.acceptInvitation({'token': params['token']}).subscribe({
          next: value => this.router.navigate(['/home']),
          error: err => this.router.navigate(['/home'])
        })
      } else {
        this.router.navigate(["/login"])
      }
    })
  }

}
