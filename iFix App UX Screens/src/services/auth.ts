import { apiRequest } from "./api";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../types/user";

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const result = await apiRequest<AuthResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify(data),
    auth: false,
  });
  localStorage.setItem("ifix_token", result.token);
  localStorage.setItem("ifix_user", JSON.stringify(result.user));
  return result;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const result = await apiRequest<AuthResponse>("/users/register", {
    method: "POST",
    body: JSON.stringify(data),
    auth: false,
  });
  localStorage.setItem("ifix_token", result.token);
  localStorage.setItem("ifix_user", JSON.stringify(result.user));
  return result;
}

export async function getProfile(): Promise<User> {
  return apiRequest<User>("/users/me");
}

export function logout(): void {
  localStorage.removeItem("ifix_token");
  localStorage.removeItem("ifix_user");
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem("ifix_user");
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("ifix_token");
}