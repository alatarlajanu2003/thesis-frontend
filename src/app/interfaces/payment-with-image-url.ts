export interface PaymentWithImageUrl {
    id: number,
    flatId: string,
    payerId: number,
    paymentDate: string,
    paymentName: string,
    paymentAmount: number,
    isAcknowledged: boolean,
    imageName: string,
    imageContent: ArrayBuffer,
    imageContentType: string,
    imageUrl: string
}