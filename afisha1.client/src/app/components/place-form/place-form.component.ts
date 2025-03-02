import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Place } from '../../models/place.model';

@Component({
  selector: 'app-place-form',
  templateUrl: './place-form.component.html',
  styleUrls: ['./place-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class PlaceFormComponent implements OnInit {
  @Input() place: Place | null = null;
  @Input() submitButtonText = 'Сохранить';
  @Output() formSubmit = new EventEmitter<Place>();
  @Output() formCancel = new EventEmitter<void>();

  placeForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.placeForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.place) {
      this.placeForm.patchValue({
        name: this.place.name,
        description: this.place.description,
      });
    }
  }

  onSubmit(): void {
    if (this.placeForm.valid) {
      const formData = this.placeForm.value;
      const updatedPlace: Partial<Place> = {
        ...(this.place || {}),
        name: formData.name,
        description: formData.description,
      };
      this.formSubmit.emit(updatedPlace as Place);
    } else {
      this.placeForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
