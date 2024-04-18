export interface Payment {
    id: number,
    flatId: string,
    payerId: number,
    paymentDate: string,
    paymentName: string,
    paymentAmount: number,
    isAcknowledged: boolean,
    imageName: string,
    imageContent: ArrayBuffer,
    imageContentType: string
}
