import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Meeting } from '../../models/meeting.model';
import { MeetingsService } from '../../services/meetings.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-meeting-current',
  templateUrl: './meeting-current.component.html',
  styleUrls: ['./meeting-current.component.scss'],
  imports: [NgIf],
  standalone: true,
})
export class CurrentMeetingComponent implements OnInit, OnDestroy {
  meeting!: Meeting;
  id!: string;
  private readonly subscription = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly meetingsService: MeetingsService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.subscription.add(
      this.meetingsService.getMeeting(this.id).subscribe((meeting) => {
        this.meeting = meeting;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  editMeeting(): void {
    // Передаем объект meeting в state при навигации
    const navigationExtras: NavigationExtras = {
      state: { meeting: this.meeting },
    };
    this.router.navigate(['/edit-meeting', this.meeting.id], navigationExtras);
  }

  deleteMeeting(): void {
    this.meetingsService.deleteMeeting(this.meeting.id!).subscribe(() => {
      this.router.navigate(['/meetings']);
    });
  }
}
