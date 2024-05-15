import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentCreationRequest } from '../../interfaces/requests/payment-creation-request';
import { BackendService } from '../../services/backend.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-payment-creation',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './payment-creation.component.html'
})
export class PaymentCreationComponent implements OnInit {
  flatId?: number
  
  constructor(private backendService: BackendService, private activatedRoute: ActivatedRoute, private router: Router) { }

  paymentCreationForm = new FormGroup({
    paymentName: new FormControl('', [
      Validators.required,
      Validators.maxLength(28)
    ]),
    paymentAmount: new FormControl('', [
      Validators.required,
      Validators.pattern("^[0-9]+$")
    ])
  })

  get paymentName() {
    return this.paymentCreationForm.get("paymentName")
  }

  get paymentAmount() {
    return this.paymentCreationForm.get("paymentAmount")
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.flatId = Number(params['flatId'])
    })
  }

  createPayment() {
    if (
      this.flatId &&
      this.paymentCreationForm.value.paymentName &&
      this.paymentCreationForm.value.paymentAmount
    ) {
      const paymentCreationRequest: PaymentCreationRequest = {
        flatId: this.flatId,
        paymentName: this.paymentCreationForm.value.paymentName,
        paymentAmount: Number(this.paymentCreationForm.value.paymentAmount)
      }
      this.backendService.createPayment(paymentCreationRequest).subscribe(_ => {
        this.router.navigate([`/payment-details/${this.flatId}`])
      })
    }
  }
}
