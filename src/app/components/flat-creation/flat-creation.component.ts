import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { Router } from '@angular/router';
import { FlatCreationRequest } from '../../interfaces/requests/flat-creation-request';

@Component({
  selector: 'app-flat-creation',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './flat-creation.component.html'
})
export class FlatCreationComponent {
  flatCreationForm = new FormGroup({
    country: new FormControl('', { nonNullable: true }),
    city: new FormControl('', { nonNullable: true }),
    postalCode: new FormControl('', { nonNullable: true }),
    address: new FormControl('', { nonNullable: true })
  });

  constructor(private backendService: BackendService, private router: Router) {}

  createFlat() {
    if (
      this.flatCreationForm.value.country &&
      this.flatCreationForm.value.city &&
      this.flatCreationForm.value.postalCode &&
      this.flatCreationForm.value.address
    ) {
      const flatCreationRequest: FlatCreationRequest = {
        country: this.flatCreationForm.value.country,
        city: this.flatCreationForm.value.city,
        postalCode: this.flatCreationForm.value.postalCode,
        address: this.flatCreationForm.value.address
      }
      this.backendService.createFlat(flatCreationRequest).subscribe(response => {
        console.log(response)
        this.router.navigate(['/home'])
      })
    }
  }

}
