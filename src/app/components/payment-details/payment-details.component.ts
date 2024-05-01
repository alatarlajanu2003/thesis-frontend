import { CurrencyPipe, DatePipe, NgFor, NgIf, NgStyle } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { Flat } from '../../interfaces/flat'
import { PaymentWithImageUrl } from '../../interfaces/payment-with-image-url'
import { AuthService } from '../../services/auth.service'
import { BackendService } from '../../services/backend.service'
import { ImageService } from '../../services/image.service'
import { Payment } from '../../interfaces/payment'

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [NgFor, DatePipe, CurrencyPipe, NgIf, RouterLink, NgStyle],
  templateUrl: './payment-details.component.html'
})
export class PaymentDetailsComponent implements OnInit {
  flatId?: number
  flat?: Flat
  isOwner: boolean = false
  userId?: number
  selectedFile: File = new File([], "")
  displayStyle = "none"
  currentPayment?: PaymentWithImageUrl
  paymentsWithPayerName: [PaymentWithImageUrl, string][] = []

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
    this.paymentsWithPayerName = []
    this.backendService.getPayments(flatId).subscribe(payments => {
      for (let payment of payments) {
        const paymentWithImage = this.initializePaymentsWithImageUrl(payment)
        this.backendService.getNameOfUser(payment.payerId).subscribe(name => {
          this.paymentsWithPayerName.push([paymentWithImage, name])
          this.paymentsWithPayerName.sort((first, second) => first[0].id - second[0].id)
        })
      }
    })
  }

  initializePaymentsWithImageUrl(payment: Payment) {
    return {
      id: payment.id,
      flatId: payment.flatId,
      payerId: payment.payerId,
      paymentDate: payment.paymentDate,
      paymentName: payment.paymentName,
      paymentAmount: payment.paymentAmount,
      isAcknowledged: payment.isAcknowledged,
      imageName: payment.imageName,
      imageContent: payment.imageContent,
      imageContentType: payment.imageContentType,
      imageUrl: this.imageService.getEvidenceUrl(payment)
    }
  }

  deletePayment(paymentId: number) {
    if (confirm("Are you sure you want to delete this payment?")) {
      this.backendService.deletePayment(paymentId).subscribe(() => {
        if (this.flatId) {
          this.refreshPaymentData(this.flatId)
        }
      })
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0]
  }

  uploadPaymentEvidence(paymentId: number): void {
    this.imageService.uploadPaymentEvidence(paymentId, this.selectedFile)
  }

  deletePaymentEvidence(paymentId: number) {
    if (confirm("Are you sure you want to delete this payment evidence?")) {
      this.backendService.deletePaymentEvidence(paymentId).subscribe(() => {
        if (this.flatId) {
          this.refreshPaymentData(this.flatId)
        }
      })
    }
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
