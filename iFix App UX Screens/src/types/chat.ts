export interface Message {
  id: string;
  appointmentId: string;
  senderId: string;
  senderRole: "user" | "technician";
  content: string;
  createdAt: string;
  readAt?: string;
}

export interface SendMessageRequest {
  content: string;
}