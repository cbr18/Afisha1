import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meeting } from '../../models/meeting.model';
import { MeetingsService } from '../../services/meetings.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { MeetingCardComponent } from '../../components/meeting-card/meeting-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meetings-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss'],
  standalone: true,
  imports: [CommonModule, PaginationComponent, MeetingCardComponent],
})
export class MeetingsListComponent implements OnInit {
  meetings: Meeting[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private readonly meetingsService: MeetingsService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadMeetings();
  }

  trackById(index: number, item: Meeting): number | null {
    return item.id ?? null;
  }

  loadMeetings(): void {
    this.isLoading = true;
    this.error = null;
    this.meetingsService
      .getMeetings(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          console.log('Мероприятия загружены:', response);
          this.meetings = response.items;
          this.totalItems = response.totalCount;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Ошибка при загрузке мероприятий: ', err);
          this.error = 'Ошибка при загрузке мероприятий: ' + err;
          this.isLoading = false;
        },
      });
  }

  addMeeting() {
    this.router.navigate(['/meetings/add']);
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.loadMeetings();
  }
}
