import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { Payment } from '../../interfaces/payment';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { User } from '../../interfaces/user';
import { Flat } from '../../interfaces/flat';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [NgFor, DatePipe, CurrencyPipe, NgIf],
  templateUrl: './payment-details.component.html'
})
export class PaymentDetailsComponent implements OnInit {
  flatId?: number
  flat?: Flat
  payments: Payment[] = []
  namesOfPayers: string[] = []
  isOwner: boolean = false
  userId?: number

  constructor(
    private backendService: BackendService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.flatId = Number(params['flatId'])
    })

    this.userId = this.authService.getUserId()

    if (this.flatId) {
      this.backendService.getFlat(this.flatId).subscribe(flat => {
        const userId = this.authService.getUserId()
        if (userId) {
          if (flat.ownerId == userId) {
            this.isOwner = true
          }
        }
      })
      this.refreshPaymentData(this.flatId)
    }
  }

  refreshPaymentData(flatId: number) {
    this.payments = []
    this.namesOfPayers = []
    this.backendService.getPayments(flatId).subscribe(payments => {
      for (let payment of payments) {
        this.backendService.getNameOfUser(payment.payerId).subscribe(name => {
          this.payments.push(payment)
          this.namesOfPayers.push(name)
        })
      }
    })
  }


  acknowledgePayment(paymentId: number) {
    this.backendService.acknowledgePayment(paymentId).subscribe(() => {
      if (this.flatId) {
        this.refreshPaymentData(this.flatId)
      }
    })
  }

  deletePayment(paymentId: number) {
    this.backendService.deletePayment(paymentId).subscribe(() => {
      if (this.flatId) {
        this.refreshPaymentData(this.flatId)
      }
    })
  }
}
