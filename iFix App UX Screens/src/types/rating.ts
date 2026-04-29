export interface RatingCreateRequest {
  appointmentId: string;
  score: number;
  comment?: string;
  tags?: string[];
}

export interface Rating {
  id: string;
  appointmentId: string;
  userId: string;
  technicianId?: string;
  score: number;
  comment?: string;
  tags?: string[];
  createdAt?: string;
}