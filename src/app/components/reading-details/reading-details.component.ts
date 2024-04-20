import { CurrencyPipe, DatePipe, NgFor, NgIf, NgStyle } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { Flat } from '../../interfaces/flat'
import { ReadingEnriched } from '../../interfaces/reading-enriched'
import { AuthService } from '../../services/auth.service'
import { BackendService } from '../../services/backend.service'
import { ImageService } from '../../services/image.service'
import { Reading } from '../../interfaces/reading'
import { AgChartsAngular } from 'ag-charts-angular'


@Component({
  selector: 'app-reading-details',
  standalone: true,
  imports: [NgFor, DatePipe, CurrencyPipe, NgIf, RouterLink, NgStyle, AgChartsAngular],
  templateUrl: './reading-details.component.html'
})
export class ReadingDetailsComponent implements OnInit {
  flatId?: number
  flat?: Flat
  readingsEnriched: ReadingEnriched[] = []
  namesOfReaders: string[] = []
  isOwner: boolean = false
  userId?: number
  selectedFile: File = new File([], "")
  displayStyle = "none"
  currentReading?: ReadingEnriched
  waterChartOptions: any
  gasChartOptions: any
  electricityChartOptions: any


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
        data: [],
        series: [
          { type: 'bar', xKey: 'month', yKey: 'water' }
        ]
      }
      this.gasChartOptions = {
        data: [],
        series: [
          { type: 'bar', xKey: 'month', yKey: 'gas' }
        ]
      }
      this.electricityChartOptions = {
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
    this.readingsEnriched = []
    this.namesOfReaders = []
    this.backendService.getReadings(flatId).subscribe(readings => {
      for (let reading of readings) {
        this.backendService.getNameOfUser(reading.readerId).subscribe(name => {
          this.namesOfReaders.push(name)
        })
      }
      this.readingsEnriched = this.imageService.initializeReadingsWithImageUrl(readings)
      this.calculateConsumption(this.readingsEnriched)

      this.initializeCharts()
    })
  }

  initializeCharts() {
    let waterMonths: string[] = []
    let gasMonths: string[] = []
    let electricityMonths: string[] = []
    this.waterChartOptions.data = []
    this.gasChartOptions.data = []
    this.electricityChartOptions.data = []

    for (let reading of this.readingsEnriched) {
      const monthAsString = new Date(reading.readingDate).toString().split(' ')[1]
      if (reading.readingName == 'Water' && !(monthAsString in waterMonths)) {
        waterMonths.push(monthAsString)
      } else if (reading.readingName == 'Gas' && !(monthAsString in gasMonths)) {
        gasMonths.push(monthAsString)
      } else if (reading.readingName == 'Electricity' && !(monthAsString in electricityMonths)) {
        electricityMonths.push(monthAsString)
      }
    }

    for (let waterMonth of waterMonths) {
      const consumption = this.readingsEnriched.filter(r => new Date(r.readingDate).toString().split(' ')[1] == waterMonth && r.readingName == 'Water').map(r => r.consumption).reduce((a, b) => a + b)
      this.waterChartOptions.data.push({ month: waterMonth, water: consumption })
    }

    for (let gasMonth of gasMonths) {
      const consumption = this.readingsEnriched.filter(r => new Date(r.readingDate).toString().split(' ')[1] == gasMonth && r.readingName == 'Gas').map(r => r.consumption).reduce((a, b) => a + b)
      this.gasChartOptions.data.push({ month: gasMonth, gas: consumption })
    }

    for (let electricityMonth of electricityMonths) {
      const consumption = this.readingsEnriched.filter(r => new Date(r.readingDate).toString().split(' ')[1] == electricityMonth && r.readingName == 'Electricity').map(r => r.consumption).reduce((a, b) => a + b)
      this.electricityChartOptions.data.push({ month: electricityMonth, electricity: consumption })
    }

    this.waterChartOptions = {
      data: this.waterChartOptions.data,
      series: this.waterChartOptions.series
    }

    this.gasChartOptions = {
      data: this.gasChartOptions.data,
      series: this.gasChartOptions.series
    }

    this.electricityChartOptions = {
      data: this.electricityChartOptions.data,
      series: this.electricityChartOptions.series
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
    this.backendService.deleteReading(readingId).subscribe(() => {
      if (this.flatId) {
        this.refreshReadingData(this.flatId)
      }
    })
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0]
  }

  uploadReadingEvidence(readingId: number): void {
    this.imageService.uploadReadingEvidence(readingId, this.selectedFile)
  }

  deleteReadingEvidence(readingId: number) {
    this.backendService.deleteReadingEvidence(readingId).subscribe(() => {
      if (this.flatId) {
        this.refreshReadingData(this.flatId)
      }
    })
  }

  acknowledgeReadingEvidence(readingId: number) {
    this.backendService.acknowledgeReadingEvidence(readingId).subscribe(() => {
      if (this.flatId) {
        this.refreshReadingData(this.flatId)
      }
    })
  }

  openPopup(reading: ReadingEnriched) {
    this.currentReading = reading
    this.displayStyle = "block"
  }

  closePopup() {
    this.displayStyle = "none"
  }
}
