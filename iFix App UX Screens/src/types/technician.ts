export interface Technician {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialties?: string[];
  bio?: string;
  city?: string;
  rating?: number;
  available?: boolean;
}

export interface TechnicianSearchParams {
  category?: string;
  city?: string;
  available?: boolean;
}

export interface TechnicianMatchParams {
  category?: string;
  lat?: number;
  lng?: number;
  maxResults?: number;
}