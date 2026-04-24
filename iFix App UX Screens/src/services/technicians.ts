import { apiRequest } from "./api";
import type { Technician, TechnicianMatchParams, TechnicianSearchParams } from "../types/technician";

export async function searchTechnicians(params: TechnicianSearchParams = {}): Promise<Technician[]> {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.city) query.set("city", params.city);
  if (params.available !== undefined) query.set("available", String(params.available));

  const qs = query.toString();
  return apiRequest<Technician[]>(`/technicians/search${qs ? `?${qs}` : ""}`, { auth: false });
}

export async function matchTechnicians(params: TechnicianMatchParams = {}): Promise<Technician[]> {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.lat !== undefined) query.set("lat", String(params.lat));
  if (params.lng !== undefined) query.set("lng", String(params.lng));
  if (params.maxResults !== undefined) query.set("maxResults", String(params.maxResults));

  const qs = query.toString();
  return apiRequest<Technician[]>(`/technicians/match${qs ? `?${qs}` : ""}`, { auth: false });
}

export async function getTechnicianById(id: string): Promise<Technician> {
  return apiRequest<Technician>(`/technicians/${id}`, { auth: false });
}