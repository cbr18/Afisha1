/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPlaceComponent } from './place-current.component';

describe('CurrentPlaceComponent', () => {
  let component: CurrentPlaceComponent;
  let fixture: ComponentFixture<CurrentPlaceComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
