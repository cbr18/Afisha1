import { Routes } from '@angular/router';
import { PlacesListComponent } from './pages/place-list/place-list.component';
import { CurrentPlaceComponent } from './pages/place-current/place-current.component';
import { EditPlaceComponent } from './pages/place-edit/place-edit.component';
import { AddPlaceComponent } from './pages/place-add/place-add.component';

import { AddMeetingComponent } from './pages/meeting-add/meeting-add.component';
import { EditMeetingComponent } from './pages/meeting-edit/meeting-edit.component';
import { CurrentMeetingComponent } from './pages/meeting-current/meeting-current.component';
import { MeetingsListComponent } from '../app/pages/meeting-list/meeting-list.component';

export const routes: Routes = [
  { path: 'places/add', component: AddPlaceComponent },
  { path: 'places/:id', component: CurrentPlaceComponent },
  { path: 'places', component: PlacesListComponent },
  { path: 'edit-place/:id', component: EditPlaceComponent },
  { path: '', redirectTo: 'places', pathMatch: 'full' },
  { path: 'meetings/add', component: AddMeetingComponent },
  { path: 'meetings/:id', component: CurrentMeetingComponent },
  { path: 'meetings', component: MeetingsListComponent },
  { path: 'edit-meeting/:id', component: EditMeetingComponent },
];
