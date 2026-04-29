export interface AppointmentCreateRequest {
  technicianId: string;
  serviceId: string;
  scheduledAt: string; // ISO date string
  address: string;
  notes?: string;
  paymentMethod?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  technicianId: string;
  serviceId: string;
  scheduledAt: string;
  address: string;
  notes?: string;
  paymentMethod?: string;
  status: AppointmentStatus;
  cancellationReason?: string;
  technician?: {
    id: string;
    name: string;
    phone?: string;
    rating?: number;
    avatar?: string;
  };
  service?: {
    id: string;
    name: string;
    price: number;
  };
  createdAt?: string;
}

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "en_route"
  | "in_progress"
  | "completed"
  | "cancelled";