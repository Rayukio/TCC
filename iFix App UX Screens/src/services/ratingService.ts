import { apiRequest } from "./api";
import type { Rating, RatingCreateRequest } from "../types/rating";

export async function createRating(data: RatingCreateRequest): Promise<Rating> {
  return apiRequest<Rating>("/ratings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getRatingByAppointment(appointmentId: string): Promise<Rating> {
  return apiRequest<Rating>(`/ratings/appointment/${appointmentId}`);
}

export async function listRatingsByTechnician(technicianId: string): Promise<Rating[]> {
  return apiRequest<Rating[]>(`/ratings/technician/${technicianId}`, { auth: false });
}