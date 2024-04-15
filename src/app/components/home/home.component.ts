import { Component, OnInit } from '@angular/core';
import { Flat } from '../../interfaces/flat';
import { BackendService } from '../../services/backend.service';
import { AuthService } from '../../services/auth.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  rentedFlats: Array<Flat> = []

  constructor(private backendService: BackendService, private authService: AuthService) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId()
    if (userId) {
      this.backendService.getRentedFlats(userId).subscribe(flats => {
        this.rentedFlats = flats
      })
    }
  }
}
