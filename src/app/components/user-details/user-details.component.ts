import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UpdateUserRequest } from '../../interfaces/requests/update-user-request';
import { AuthService } from '../../services/auth.service';
import { BackendService } from '../../services/backend.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-details.component.html'
})
export class UserDetailsComponent implements OnInit {
  user?: User
  userId?: number
  userDetailsForm = new FormGroup({
    firstName: new FormControl('', { nonNullable: true }),
    lastName: new FormControl('', { nonNullable: true }),
    phoneNumber: new FormControl('', { nonNullable: true }),
    emailAddress: new FormControl('', { nonNullable: true }),
    preferredLanguage: new FormControl('', { nonNullable: true })
  })

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
      this.backendService.updateUser(updateRequest, this.authService.getUserId()).subscribe(() => {

      })
    }
  }

}
