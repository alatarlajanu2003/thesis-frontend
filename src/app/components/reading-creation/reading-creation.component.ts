import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReadingCreationRequest } from '../../interfaces/requests/reading-creation-request';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-reading-creation',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reading-creation.component.html'
})
export class ReadingCreationComponent implements OnInit {
  flatId?: number

  constructor(private backendService: BackendService, private activatedRoute: ActivatedRoute, private router: Router) { }

  readingCreationForm = new FormGroup({
    readingName: new FormControl('Water', { nonNullable: true }),
    readingAmount: new FormControl('', { nonNullable: true })
  });

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.flatId = Number(params['flatId'])
    })
  }

  createReading() {
    if (
      this.flatId &&
      this.readingCreationForm.value.readingName &&
      this.readingCreationForm.value.readingAmount
    ) {
      const readingCreationRequest: ReadingCreationRequest = {
        flatId: this.flatId,
        readingName: this.readingCreationForm.value.readingName,
        readingAmount: Number(this.readingCreationForm.value.readingAmount)
      }
      this.backendService.createReading(readingCreationRequest).subscribe(() => {
        this.router.navigate([`/reading-details/${this.flatId}`])
      })
    }
  }
}
