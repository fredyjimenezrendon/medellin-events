export interface Location {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: Location;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventInput {
  title: string;
  description: string;
  date: string;
  location: Location;
  tags: string[];
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  date?: string;
  location?: Location;
  tags?: string[];
}
