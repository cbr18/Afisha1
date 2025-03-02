/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingListComponent } from './meeting-list.component';

describe('MeetingsListComponent', () => {
  let component: MeetingsListComponent;
  let fixture: ComponentFixture<MeetingsListComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
