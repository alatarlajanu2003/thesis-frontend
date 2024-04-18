export interface Reading {
    id: number,
    flatId: string,
    readingId: number,
    readingDate: string,
    readingName: string,
    readingAmount: number,
    isAcknowledged: boolean,
    imageName: string,
    imageContent: ArrayBuffer,
    imageContentType: string
}
