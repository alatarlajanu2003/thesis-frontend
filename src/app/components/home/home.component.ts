import { Component, OnInit } from '@angular/core';
import { Flat } from '../../interfaces/flat';
import { BackendService } from '../../services/backend.service';
import { AuthService } from '../../services/auth.service';
import { NgFor } from '@angular/common';
import { User } from '../../interfaces/user';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  rentedFlats: Array<Flat> = []
  ownedFlats: Array<Flat> = []
  owners: Array<User> = []
  allTenants: Array<Array<User>> = []

  constructor(private backendService: BackendService, private authService: AuthService) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId()
    if (userId) {

      this.backendService.getRentedFlats(userId).subscribe(flats => {
        for(let flat of flats){
          this.backendService.getOwner(flat.id).subscribe(owner => {
            this.rentedFlats.push(flat)
            this.owners.push(owner)
          })
        }
      })

      this.backendService.getOwnedFlats(userId).subscribe(flats => {
        for(let flat of flats){
          this.backendService.getTenants(flat.id).subscribe(tenants => {
            this.ownedFlats.push(flat)
            this.allTenants.push(tenants)
          })
        }
      })

    }
  }
}
