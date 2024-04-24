import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { Router } from '@angular/router';
import { FlatCreationRequest } from '../../interfaces/requests/flat-creation-request';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-flat-creation',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './flat-creation.component.html'
})
export class FlatCreationComponent {
  flatCreationForm = new FormGroup({
    country: new FormControl('', [
      Validators.required,
      Validators.maxLength(28),
      Validators.pattern("^[a-zA-Z]+$")
    ]),
    city: new FormControl('', [
      Validators.required,
      Validators.maxLength(28),
      Validators.pattern("^[a-zA-Z]+$")
    ]),
    postalCode: new FormControl('', [
      Validators.required,
      Validators.maxLength(28)
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.maxLength(28)
    ])
  })

 get country() {
  return this.flatCreationForm.get("country")
 }

 get city() {
  return this.flatCreationForm.get("city")
 }

 get postalCode() {
  return this.flatCreationForm.get("postalCode")
 }

 get address() {
  return this.flatCreationForm.get("address")
 }

  constructor(private backendService: BackendService, private router: Router) { }

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
