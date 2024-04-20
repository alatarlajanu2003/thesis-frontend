import { CurrencyPipe, DatePipe, NgFor, NgIf, NgStyle } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { Flat } from '../../interfaces/flat'
import { PaymentWithImageUrl } from '../../interfaces/payment-with-image-url'
import { AuthService } from '../../services/auth.service'
import { BackendService } from '../../services/backend.service'
import { ImageService } from '../../services/image.service'

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [NgFor, DatePipe, CurrencyPipe, NgIf, RouterLink, NgStyle],
  templateUrl: './payment-details.component.html'
})
export class PaymentDetailsComponent implements OnInit {
  flatId?: number
  flat?: Flat
  paymentsWithImageUrl: PaymentWithImageUrl[] = []
  namesOfPayers: string[] = []
  isOwner: boolean = false
  userId?: number
  selectedFile: File = new File([], "")
  displayStyle = "none"
  currentPayment?: PaymentWithImageUrl

  constructor(
    private backendService: BackendService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.flatId = Number(params['flatId'])
    })

    this.userId = this.authService.getUserId()

    if (this.flatId) {
      this.backendService.getFlat(this.flatId).subscribe(flat => {
        if (this.userId) {
          if (flat.ownerId == this.userId) {
            this.isOwner = true
          }
        }
      })
      this.refreshPaymentData(this.flatId)
    }
  }

  refreshPaymentData(flatId: number) {
    this.paymentsWithImageUrl = []
    this.namesOfPayers = []
    this.backendService.getPayments(flatId).subscribe(payments => {
      for (let payment of payments) {
        this.backendService.getNameOfUser(payment.payerId).subscribe(name => {
          this.namesOfPayers.push(name)
        })
        this.paymentsWithImageUrl = this.imageService.initializePaymentsWithImageUrl(payments)
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

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0]
  }

  uploadPaymentEvidence(paymentId: number): void {
      this.imageService.uploadPaymentEvidence(paymentId, this.selectedFile)
    }

  deletePaymentEvidence(paymentId: number) {
    this.backendService.deletePaymentEvidence(paymentId).subscribe(() => {
      if (this.flatId) {
        this.refreshPaymentData(this.flatId)
      }
    })
  }

  acknowledgePaymentEvidence(paymentId: number) {
    this.backendService.acknowledgePaymentEvidence(paymentId).subscribe(() => {
      if (this.flatId) {
        this.refreshPaymentData(this.flatId)
      }
    })
  }

  openPopup(payment: PaymentWithImageUrl) {
    this.currentPayment = payment
    this.displayStyle = "block"
  }

  closePopup() {
    this.displayStyle = "none"
  }
}
