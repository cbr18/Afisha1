export interface Place {
  id?: number;
  name: string;
  description: string;
}

export interface PlacesResponse {
  items: Place[];
  totalCount: number;
}
