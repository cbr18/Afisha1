import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from '../../models/place.model';
import { PlacesService } from '../../services/places.service';
import { CommonModule } from '@angular/common';
import { PlaceFormComponent } from '../../components/place-form/place-form.component';

@Component({
  selector: 'app-place-edit',
  templateUrl: './place-edit.component.html',
  styleUrls: ['./place-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, PlaceFormComponent],
})
export class EditPlaceComponent implements OnInit {
  place?: Place;
  loading = true;
  error = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly placesService: PlacesService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // Пробуем получить место из state навигации
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && 'place' in navigation.extras.state) {
      this.place = navigation.extras.state['place'] as Place;
      this.loading = false;
      return;
    }

    // Если места нет в state, загружаем по ID
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.placesService.getPlace(id).subscribe({
        next: (place) => {
          this.place = place;
          this.loading = false;
        },
        error: () => {
          this.error = true;
          this.loading = false;
        },
      });
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  onSavePlace(updatedPlace: Place): void {
    this.placesService.updatePlace(updatedPlace).subscribe({
      next: () => {
        this.router.navigate(['/places', updatedPlace.id]);
      },
      error: (err) => {
        console.error('Error updating place', err);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/places', this.place?.id]);
  }
}
