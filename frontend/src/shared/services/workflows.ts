import axios from "axios";
import { api } from "./api";

export interface AutoServiceView {
  id: number;
  name: string;
  type: "PLATFORM_PARTNER" | "RAR_ITP_MOCK" | "ROAD_ASSISTANCE";
  description?: string;
  phone?: string;
  email?: string;
  rating: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface ConversationView {
  id: number;
  serviceId: number | null;
  serviceName: string | null;
  servicePhone: string | null;
  userName: string | null;
  createdAt: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface MessageView {
  id: number;
  conversationId: number;
  content: string | null;
  messageType: string;
  mediaId: number | null;
  mediaName: string | null;
  mediaMimeType: string | null;
  senderName: string | null;
  senderRole: "USER" | "MECHANIC";
  mine: boolean;
  createdAt: string;
}

export interface NotificationView {
  id: number;
  type: string;
  title: string;
  message: string;
  entityType: string | null;
  entityId: number | null;
  read: boolean;
  createdAt: string;
}

export interface UnreadSummary {
  messages: number;
  notifications: number;
  total: number;
}

export interface AppointmentView {
  id: number;
  serviceId: number | null;
  serviceName: string | null;
  carId: number | null;
  partId: number | null;
  appointmentTime: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELED";
  description: string | null;
  requesterName: string | null;
}

export interface RoadRequestView {
  id: number;
  assignedServiceId: number | null;
  serviceName: string | null;
  latitude: number;
  longitude: number;
  problemDescription: string;
  status: "NEW" | "ASSIGNED" | "ON_THE_WAY" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  createdAt: string;
  requesterName: string | null;
  problemType: string | null;
  mediaId: number | null;
  mediaName: string | null;
}

export interface MediaView {
  id: number;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
}

export function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; detail?: string } | string | undefined;
    if (typeof data === "string") return data;
    return data?.message ?? data?.detail ?? "Cererea nu a putut fi procesată.";
  }
  return error instanceof Error ? error.message : "A apărut o eroare.";
}

export async function uploadMedia(file: File) {
  const data = new FormData();
  data.append("file", file);
  return (await api.post<MediaView>("/media/upload", data)).data;
}
