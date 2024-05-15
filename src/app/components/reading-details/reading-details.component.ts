import { CurrencyPipe, DatePipe, DecimalPipe, NgFor, NgIf, NgStyle } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { AgChartsAngular } from 'ag-charts-angular'
import { Flat } from '../../interfaces/flat'
import { Reading } from '../../interfaces/reading'
import { ReadingEnriched } from '../../interfaces/reading-enriched'
import { AuthService } from '../../services/auth.service'
import { BackendService } from '../../services/backend.service'
import { ImageService } from '../../services/image.service'


@Component({
  selector: 'app-reading-details',
  standalone: true,
  imports: [NgFor, DatePipe, CurrencyPipe, NgIf, RouterLink, NgStyle, AgChartsAngular, DecimalPipe],
  templateUrl: './reading-details.component.html'
})
export class ReadingDetailsComponent implements OnInit {
  flatId?: number
  flat?: Flat
  isOwner: boolean = false
  userId?: number
  selectedFile: File = new File([], "")
  displayStyle = "none"
  currentReading?: ReadingEnriched
  waterChartOptions: any
  gasChartOptions: any
  electricityChartOptions: any
  readingsWithReaderName: [ReadingEnriched, string][] = []
  currentImageUrl: string = ""

  myTheme = {
    palette: {
      fills: ['#555']
    }
  };

  constructor(
    private backendService: BackendService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.flatId = Number(params['flatId'])
      this.userId = this.authService.getUserId()

      this.waterChartOptions = {
        theme: this.myTheme,
        data: [],
        series: [
          { type: 'bar', xKey: 'month', yKey: 'water' }
        ]
      }
      this.gasChartOptions = {
        theme: this.myTheme,
        data: [],
        series: [
          { type: 'bar', xKey: 'month', yKey: 'gas' }
        ]
      }
      this.electricityChartOptions = {
        theme: this.myTheme,
        data: [],
        series: [
          { type: 'bar', xKey: 'month', yKey: 'electricity' }
        ]
      }

      if (this.flatId && this.userId) {
        this.backendService.getFlat(this.flatId).subscribe(flat => {
          if (flat.ownerId == this.userId) {
            this.isOwner = true
          }

          this.refreshReadingData(flat.id)
        })
      }
    })
  }

  refreshReadingData(flatId: number) {
    this.readingsWithReaderName = []
    this.backendService.getReadings(flatId).subscribe(readings => {
      for (let reading of readings) {
        const readingEnriched = this.initializeReadingWithConsumption(reading)
        this.backendService.getNameOfUser(reading.readerId).subscribe(name => {
          this.readingsWithReaderName.push([readingEnriched, name])
          this.readingsWithReaderName.sort((first, second) => first[0].id - second[0].id)

          this.calculateConsumption(this.readingsWithReaderName.map(readingWithUser => readingWithUser[0]))
          this.initializeCharts()
        })
      }
      this.initializeCharts()
    })
  }

  initializeReadingWithConsumption(reading: Reading): ReadingEnriched {
    return {
      id: reading.id,
      flatId: reading.flatId,
      readerId: reading.readerId,
      readingDate: reading.readingDate,
      readingName: reading.readingName,
      readingAmount: reading.readingAmount,
      isAcknowledged: reading.isAcknowledged,
      imageName: reading.imageName,
      imageContent: reading.imageContent,
      imageContentType: reading.imageContentType,
      consumption: 0
    }
  }

  initializeCharts() {
    let months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    this.waterChartOptions.data = []
    this.gasChartOptions.data = []
    this.electricityChartOptions.data = []
    let currentYear = new Date().getFullYear().toString()

    for (let month of months) {
      this.waterChartOptions.data.push({ month: month, water: this.getConsumption('Water', month, currentYear) })
      this.gasChartOptions.data.push({ month: month, gas: this.getConsumption('Gas', month, currentYear) })
      this.electricityChartOptions.data.push({ month: month, electricity: this.getConsumption('Electricity', month, currentYear) })
    }

    this.refreshChartOptionsData(this.waterChartOptions, this.gasChartOptions, this.electricityChartOptions)
  }

  getConsumption(readingType: string, month: string, year: string): number {
    return this.readingsWithReaderName.map(readingWithUser => readingWithUser[0]).filter(r => {
      const readingDate = new Date(r.readingDate).toString().split(' ')
      return readingDate[3] == year && readingDate[1] == month && r.readingName == readingType
    })
      .map(r => r.consumption)
      .reduce((a, b) => a + b, 0)
  }

  refreshChartOptionsData(waterChartOptions: any, gasChartOptions: any, electricityChartOptions: any) {
    this.waterChartOptions = {
      theme: waterChartOptions.theme,
      data: waterChartOptions.data,
      series: waterChartOptions.series
    }

    this.gasChartOptions = {
      theme: gasChartOptions.theme,
      data: gasChartOptions.data,
      series: gasChartOptions.series
    }

    this.electricityChartOptions = {
      theme: electricityChartOptions.theme,
      data: electricityChartOptions.data,
      series: electricityChartOptions.series
    }
  }

  findPreviousReading(reading: Reading, readings: ReadingEnriched[]): ReadingEnriched | null {
    const previousRelevantReadings =
      readings
        .filter(r =>
          r.id < reading.id
          && r.readingName == reading.readingName
        ).sort(
          (a, b) => b.id - a.id
        )

    if (previousRelevantReadings.length > 0) {
      return previousRelevantReadings[0]
    }

    return null
  }

  calculateConsumption(readings: ReadingEnriched[]) {
    for (let reading of readings) {
      const previousReading = this.findPreviousReading(reading, readings)
      if (previousReading) {
        reading.consumption = reading.readingAmount - previousReading.readingAmount
      } else {
        reading.consumption = reading.readingAmount
      }
    }
  }

  deleteReading(readingId: number) {
    if (confirm("Are you sure you want to delete this reading?")) {
      this.backendService.deleteReading(readingId).subscribe(_ => {
        if (this.flatId) {
          this.refreshReadingData(this.flatId)
        }
      })
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0]
  }

  uploadReadingEvidence(readingId: number): void {
    this.imageService.uploadReadingEvidence(readingId, this.selectedFile)
  }

  deleteReadingEvidence(readingId: number) {
    if (confirm("Are you sure you want to delete this reading evidence?")) {
      this.backendService.deleteReadingEvidence(readingId).subscribe(_ => {
        if (this.flatId) {
          this.refreshReadingData(this.flatId)
        }
      })
    }
  }

  acknowledgeReadingEvidence(readingId: number) {
    if (confirm("Are you sure you want to acknowledge this reading evidence?")) {
      this.backendService.acknowledgeReadingEvidence(readingId).subscribe(_ => {
        if (this.flatId) {
          this.refreshReadingData(this.flatId)
        }
      })
    }
  }

  getUnit(readingName: string) {
    switch (readingName) {
      case "Water": return "m³"
      case "Electricity": return "kWh"
      case "Gas": return "m³"
      default: return ''
    }
  }

  openPopup(reading: Reading) {
    this.backendService.getReadingEvidence(reading.id).subscribe(evidence => {
      reading.imageContent = evidence
      this.currentImageUrl = this.imageService.getEvidenceUrl(reading)
      this.displayStyle = "block"
    })
  }

  closePopup() {
    this.displayStyle = "none"
  }
}
