export interface Reading {
    id: number,
    flatId: string,
    readerId: number,
    readingDate: string,
    readingName: string,
    readingAmount: number,
    isAcknowledged: boolean,
    imageName: string,
    imageContent: ArrayBuffer,
    imageContentType: string
}
