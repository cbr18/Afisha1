/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeetingFormComponent } from './meeting-form.component';

describe('PlaceFormComponent', () => {
  let component: MeetingFormComponent;
  let fixture: ComponentFixture<MeetingFormComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
