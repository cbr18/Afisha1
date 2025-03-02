import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../models/place.model';
import { PlacesService } from '../../services/places.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { PlaceCardComponent } from '../../components/place-card/place-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-places-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.scss'],
  standalone: true,
  imports: [CommonModule, PaginationComponent, PlaceCardComponent],
})
export class PlacesListComponent implements OnInit {
  places: Place[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private readonly placesService: PlacesService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadPlaces();
  }

  trackById(index: number, item: Place): number | null {
    return item.id ?? null;
  }

  loadPlaces(): void {
    this.isLoading = true;
    this.error = null;
    this.placesService.getPlaces(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log('Места загружены:', response);
        this.places = response.items;
        this.totalItems = response.totalCount;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка при загрузке мест: ', err);
        this.error = 'Ошибка при загрузке мест: ' + err;
        this.isLoading = false;
      },
    });
  }

  addPlace() {
    this.router.navigate(['/places/add']);
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.loadPlaces();
  }
}
