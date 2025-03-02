import { Place } from './place.model';

export interface Meeting {
  id?: number;
  name: string;
  description: string;
  date: Date;
  place?: Place;
  placeId?: number;
}

export interface MeetingsResponse {
  items: Meeting[];
  totalCount: number;
}
