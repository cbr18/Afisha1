import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Place } from '../../models/place.model';
import { PlacesService } from '../../services/places.service';
import { CommonModule } from '@angular/common';
import { PlaceFormComponent } from '../../components/place-form/place-form.component';

@Component({
  selector: 'app-place-add',
  templateUrl: './place-add.component.html',
  styleUrls: ['./place-add.component.scss'],
  standalone: true,
  imports: [CommonModule, PlaceFormComponent],
})
export class AddPlaceComponent implements OnInit {
  newPlace: Place | null = null;
  loading = false;
  error = false;
  errorMessage = '';

  constructor(
    private readonly placesService: PlacesService,
    private readonly router: Router
  ) {
    console.log('AddPlaceComponent initialized');
  }

  ngOnInit(): void {
    this.newPlace = {
      name: '',
      description: '',
    } as Place;
  }

  onCreatePlace(place: Place): void {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    this.placesService.createPlace(place).subscribe({
      next: (createdPlace) => {
        this.loading = false;
        this.router.navigate(['/places', createdPlace.id]);
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        console.error('Error creating place:', err);

        if (err.error?.title) {
          this.errorMessage = `Error: ${err.error.title}`;
        } else {
          this.errorMessage =
            'An error occurred while creating the place. Please try again.';
        }
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/places']);
  }
}
