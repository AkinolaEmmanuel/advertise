import type { Brand } from "./types";
import { apiFetch, clearToken, setToken } from "./api";

export interface AuthUser {
  id: string;
  email: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
  brand: Brand | null;
}

export async function login(email: string, password: string) {
  const data = await apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

export async function signup(email: string, password: string, brandName: string) {
  const data = await apiFetch<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, brandName }),
  });
  setToken(data.token);
  return data;
}

export async function getCurrentUser() {
  return apiFetch<{ user: AuthUser; brand: Brand | null }>("/api/auth/me");
}

export function logout() {
  clearToken();
}
