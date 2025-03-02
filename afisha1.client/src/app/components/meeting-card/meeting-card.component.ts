import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Meeting } from '../../models/meeting.model';

@Component({
  selector: 'app-meeting-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'meeting-card.component.html',
  styleUrls: ['./meeting-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingCardComponent {
  constructor(private readonly router: Router) {}
  @Input({ required: true }) meeting!: Meeting;
  @Output() cardClick = new EventEmitter<Meeting>();

  get formattedDescription(): string {
    return this.meeting.description.slice(0, 100) + '...';
  }

  openDescription(): void {
    this.router.navigate(['/meetings', this.meeting.id]);
  }
}
