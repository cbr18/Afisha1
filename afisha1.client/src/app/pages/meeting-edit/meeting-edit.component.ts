import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meeting } from '../../models/meeting.model';
import { MeetingsService } from '../../services/meetings.service';
import { CommonModule } from '@angular/common';
import { MeetingFormComponent } from '../../components/meeting-form/meeting-form.component';

@Component({
  selector: 'app-meeting-edit',
  templateUrl: './meeting-edit.component.html',
  styleUrls: ['./meeting-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, MeetingFormComponent],
})
export class EditMeetingComponent implements OnInit {
  meeting?: Meeting;
  loading = true;
  error = false;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly meetingsService: MeetingsService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // Try to get meeting from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && 'meeting' in navigation.extras.state) {
      this.meeting = navigation.extras.state['meeting'] as Meeting;
      this.loading = false;
      return;
    }

    // If meeting not in state, load by ID
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.meetingsService.getMeeting(id).subscribe({
        next: (meeting) => {
          this.meeting = meeting;
          this.loading = false;
        },
        error: (err) => {
          this.error = true;
          this.loading = false;
          console.error('Error fetching meeting:', err);
          this.errorMessage = 'Unable to load the meeting. Please try again.';
        },
      });
    } else {
      this.error = true;
      this.loading = false;
      this.errorMessage = 'No meeting ID provided.';
    }
  }

  onSaveMeeting(updatedMeeting: Meeting): void {
    this.loading = true;
    this.meetingsService.updateMeeting(updatedMeeting).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/meetings', updatedMeeting.id]);
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        console.error('Error updating meeting', err);
        if (err.error?.title) {
          this.errorMessage = `Error: ${err.error.title}`;
        } else {
          this.errorMessage =
            'An error occurred while updating the meeting. Please try again.';
        }
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/meetings', this.meeting?.id]);
  }
}
