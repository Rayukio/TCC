import { apiRequest } from "./api";
import type { Message } from "../types/chat";

export async function getMessages(appointmentId: string): Promise<Message[]> {
  return apiRequest<Message[]>(`/chat/${appointmentId}/messages`);
}

export async function sendMessage(appointmentId: string, content: string): Promise<Message> {
  return apiRequest<Message>(`/chat/${appointmentId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function markAsRead(appointmentId: string): Promise<void> {
  return apiRequest(`/chat/${appointmentId}/read`, { method: "PATCH" });
}