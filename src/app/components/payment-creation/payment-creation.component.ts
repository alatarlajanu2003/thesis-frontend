import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentCreationRequest } from '../../interfaces/requests/payment-creation-request';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-payment-creation',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './payment-creation.component.html'
})
export class PaymentCreationComponent implements OnInit {
  flatId?: number

  constructor(private backendService: BackendService, private activatedRoute: ActivatedRoute, private router: Router) { }

  paymentCreationForm = new FormGroup({
    paymentName: new FormControl('', { nonNullable: true }),
    paymentAmount: new FormControl('', { nonNullable: true })
  });

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
      this.backendService.createPayment(paymentCreationRequest).subscribe(() => {
        this.router.navigate([`/payment-details/${this.flatId}`])
      })
    }
  }
}
