import { CurrencyPipe, DatePipe, NgFor, NgIf, NgStyle } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { Flat } from '../../interfaces/flat'
import { Payment } from '../../interfaces/payment'
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
  isOwner: boolean = false
  userId?: number
  selectedFile: File = new File([], "")
  displayStyle = "none"
  currentPayment?: Payment
  paymentsWithPayerName: [Payment, string][] = []
  currentImageUrl: string = ""

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
        this.backendService.getNameOfUser(payment.payerId).subscribe(name => {
          this.paymentsWithPayerName.push([payment, name])
          this.paymentsWithPayerName.sort((first, second) => first[0].id - second[0].id)
        })
      }
    })
  }

  deletePayment(paymentId: number) {
    if (confirm("Are you sure you want to delete this payment?")) {
      this.backendService.deletePayment(paymentId).subscribe(_ => {
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
      this.backendService.deletePaymentEvidence(paymentId).subscribe(_ => {
        if (this.flatId) {
          this.refreshPaymentData(this.flatId)
        }
      })
    }
  }

  acknowledgePaymentEvidence(paymentId: number) {
    if (confirm("Are you sure you want to acknowledge this payment evidence?")) {
      this.backendService.acknowledgePaymentEvidence(paymentId).subscribe(_ => {
        if (this.flatId) {
          this.refreshPaymentData(this.flatId)
        }
      })
    }
  }

  openPopup(payment: Payment) {
    this.backendService.getPaymentEvidence(payment.id).subscribe(evidence => {
      payment.imageContent = evidence
      this.currentImageUrl = this.imageService.getEvidenceUrl(payment)
      this.displayStyle = "block"
    })
  }

  closePopup() {
    this.displayStyle = "none"
  }
}
