export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventInput {
  title: string;
  description: string;
  date: string;
  tags: string[];
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
}
