import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { Payment } from '../interfaces/payment';
import { PaymentWithImageUrl } from '../interfaces/payment-with-image-url';
import { EvidenceUploadRequest } from '../interfaces/requests/evidence-upload-request';
import { Reading } from '../interfaces/reading';
import { ReadingEnriched } from '../interfaces/reading-enriched';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private backendService: BackendService) { }

  arrayBufferToByteArray(arrayBuffer: ArrayBuffer): number[] {
    const uint8Array = new Uint8Array(arrayBuffer)
    return Array.from(uint8Array).map(value => {
      // Convert values from 0-255 to -128-127
      return value > 127 ? value - 256 : value
    })
  }

  uploadPaymentEvidence(paymentId: number, file: File): void {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = () => {
      const paymentEvidenceUploadRequest: EvidenceUploadRequest = {
        imageName: file.name,
        imageContent: this.arrayBufferToByteArray(reader.result as ArrayBuffer),
        imageContentType: file.type
      }

      this.backendService.uploadPaymentEvidence(paymentEvidenceUploadRequest, paymentId).subscribe(() => {
        window.location.reload()
      })
    }
  }

  uploadReadingEvidence(readingId: number, file: File) {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = () => {
      const readingEvidenceUploadRequest: EvidenceUploadRequest = {
        imageName: file.name,
        imageContent: this.arrayBufferToByteArray(reader.result as ArrayBuffer),
        imageContentType: file.type
      }

      this.backendService.uploadReadingEvidence(readingEvidenceUploadRequest, readingId).subscribe(() => {
        window.location.reload()
      })
    }
  }

  getEvidenceUrl(object: Payment | Reading) {
    if (object.imageContent && object.imageContentType) {
      const blob = new Blob([new Uint8Array(object.imageContent)], { type: object.imageContentType })
      return URL.createObjectURL(blob)
    }
    return ""
  }

  initializePaymentsWithImageUrl(payments: Payment[]) {
    const paymentsWithImageUrl: PaymentWithImageUrl[] = []
    for (let payment of payments) {
      const paymentWithImageUrl: PaymentWithImageUrl = {
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
        imageUrl: this.getEvidenceUrl(payment)
      }
      paymentsWithImageUrl.push(paymentWithImageUrl)
    }
    return paymentsWithImageUrl
  }
}
