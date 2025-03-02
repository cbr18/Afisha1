import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meeting } from '../../models/meeting.model';
import { MeetingsService } from '../../services/meetings.service';
import { CommonModule } from '@angular/common';
import { MeetingFormComponent } from '../../components/meeting-form/meeting-form.component';

@Component({
  selector: 'app-meeting-add',
  templateUrl: './meeting-add.component.html',
  styleUrls: ['./meeting-add.component.scss'],
  standalone: true,
  imports: [CommonModule, MeetingFormComponent],
})
export class AddMeetingComponent implements OnInit {
  newMeeting: Meeting | null = null;
  loading = false;
  error = false;
  errorMessage = '';

  constructor(
    private readonly meetingsService: MeetingsService,
    private readonly router: Router
  ) {
    console.log('AddMeetingComponent initialized');
  }

  ngOnInit(): void {
    // Initialize with default values
    this.newMeeting = {
      name: '',
      description: '',
      date: new Date(),
      place: {
        id: 0,
        name: '',
        description: '',
      },
    } as Meeting;
  }

  onCreateMeeting(meeting: Meeting): void {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';
    console.log('Creating meeting:', meeting);
    this.meetingsService.createMeeting(meeting).subscribe({
      next: (createdMeeting) => {
        this.loading = false;
        this.router.navigate(['/meetings', createdMeeting.id]);
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        console.error('Error creating meeting:', err);

        if (err.error?.title) {
          this.errorMessage = `Error: ${err.error.title}`;
        } else {
          this.errorMessage =
            'An error occurred while creating the meeting. Please try again.';
        }
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/meetings']);
  }
}
