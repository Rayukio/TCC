import { apiRequest } from "./api";
import type { Appointment, AppointmentCreateRequest, AppointmentStatus } from "../types/appointment";

export async function createAppointment(data: AppointmentCreateRequest): Promise<Appointment> {
  return apiRequest<Appointment>("/appointments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function listMyAppointments(status?: AppointmentStatus): Promise<Appointment[]> {
  const qs = status ? `?status=${status}` : "";
  return apiRequest<Appointment[]>(`/appointments${qs}`);
}

export async function getAppointmentById(id: string): Promise<Appointment> {
  return apiRequest<Appointment>(`/appointments/${id}`);
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
  cancellationReason?: string
): Promise<Appointment> {
  return apiRequest<Appointment>(`/appointments/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, cancellationReason }),
  });
}