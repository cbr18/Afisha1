import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Meeting } from '../../models/meeting.model';
import { Place } from '../../models/place.model';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-meeting-form',
  templateUrl: './meeting-form.component.html',
  styleUrls: ['./meeting-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class MeetingFormComponent implements OnInit {
  @Input() meeting: Meeting | null = null;
  @Input() submitButtonText = 'Сохранить';
  @Output() formSubmit = new EventEmitter<Meeting>();
  @Output() formCancel = new EventEmitter<void>();

  meetingForm: FormGroup;
  places: Place[] = [];
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly placesService: PlacesService
  ) {
    this.meetingForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      date: [new Date(), [Validators.required]],
      placeId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadPlaces();

    if (this.meeting) {
      this.meetingForm.patchValue({
        name: this.meeting.name,
        description: this.meeting.description,
        date: this.formatDateForInput(this.meeting.date),
        placeId: this.meeting.place?.id ?? '',
      });
    }
  }

  loadPlaces(): void {
    this.loading = true;
    this.placesService.getPlaces().subscribe({
      next: (response) => {
        this.places = response.items;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading places', error);
        this.loading = false;
      },
    });
  }

  formatDateForInput(date: Date): string {
    // Convert Date to string format yyyy-MM-ddThh:mm
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toISOString().slice(0, 16);
  }

  onSubmit(): void {
    if (this.meetingForm.valid) {
      const formData = this.meetingForm.value;
      const selectedPlace = this.places.find(
        (place) => place.id === parseInt(formData.placeId)
      );

      if (!selectedPlace) {
        console.error('Selected place not found');
        return;
      }

      const updatedMeeting: Meeting = {
        ...(this.meeting || {}),
        name: formData.name,
        description: formData.description,
        date: new Date(formData.date),
        placeId: selectedPlace.id,
      };

      this.formSubmit.emit(updatedMeeting);
    } else {
      this.meetingForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
