import { Component, OnInit } from '@angular/core';
import { Flat } from '../../interfaces/flat';
import { BackendService } from '../../services/backend.service';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { User } from '../../interfaces/user';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, RouterLink, NgIf],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  rentedFlatsWithOwners: [Flat, User][] = []
  ownedFlatsWithTenants: [Flat, User[]][] = []

  constructor(private backendService: BackendService, private authService: AuthService) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId()
    if (userId) {

      this.backendService.getRentedFlats(userId).subscribe(flats => {
        for (let flat of flats) {
          this.backendService.getOwner(flat.id).subscribe(owner => {
            this.rentedFlatsWithOwners.push([flat, owner])
            this.rentedFlatsWithOwners.sort((first, second) => first[0].id - second[0].id)
          })
        }
      })

      this.refreshOwnedPlaces(userId)
    }
  }

  refreshOwnedPlaces(userId: number) {
    this.ownedFlatsWithTenants = []
    this.backendService.getOwnedFlats(userId).subscribe(flats => {
      for (let flat of flats) {
        this.backendService.getTenants(flat.id).subscribe(tenants => {
          this.ownedFlatsWithTenants.push([flat, tenants])
          this.ownedFlatsWithTenants.sort((first, second) => first[0].id - second[0].id)
        })
      }
    })
  }

  deleteFlat(flatId: number) {
    const userId = this.authService.getUserId()
    if (confirm("Are you sure you want to delete this flat?")) {
      if (userId) {
        this.backendService.deleteFlat(flatId).subscribe(_ =>
          this.refreshOwnedPlaces(userId)
        )
      }
    }
  }
}
