import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Place } from '../../models/place.model';

@Component({
  selector: 'app-place-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'place-card.component.html',
  styleUrls: ['./place-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceCardComponent {
  constructor(private readonly router: Router) {}
  @Input({ required: true }) place!: Place;
  @Output() cardClick = new EventEmitter<Place>();

  get formattedDescription(): string {
    return this.place.description.slice(0, 100) + '...';
  }

  openDescription(): void {
    this.router.navigate(['/places', this.place.id]);
  }
}
