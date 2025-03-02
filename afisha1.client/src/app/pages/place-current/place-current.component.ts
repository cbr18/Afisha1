import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Place } from '../../models/place.model';
import { PlacesService } from '../../services/places.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-place-current',
  templateUrl: './place-current.component.html',
  styleUrls: ['./place-current.component.scss'],
  imports: [NgIf],
  standalone: true,
})
export class CurrentPlaceComponent implements OnInit, OnDestroy {
  place!: Place;
  id!: string;
  private readonly subscription = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly placesService: PlacesService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.subscription.add(
      this.placesService.getPlace(this.id).subscribe((place) => {
        this.place = place;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  editPlace(): void {
    // Передаем объект place в state при навигации
    const navigationExtras: NavigationExtras = {
      state: { place: this.place },
    };
    this.router.navigate(['/edit-place', this.place.id], navigationExtras);
  }

  deletePlace(): void {
    this.placesService.deletePlace(this.place.id!).subscribe(() => {
      this.router.navigate(['/places']);
    });
  }
}
