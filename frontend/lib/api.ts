export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("polowo_token");
}

export function setToken(token: string) {
  window.localStorage.setItem("polowo_token", token);
}

export function clearToken() {
  window.localStorage.removeItem("polowo_token");
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getToken();

  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      typeof data?.error === "string"
        ? data.error
        : data?.error?.formErrors?.[0] || "Request failed";
    throw new ApiError(res.status, message);
  }

  return data as T;
}

export async function publicApiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const baseUrl =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
      : API_URL;
  const res = await fetch(`${baseUrl}${path}`, init);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(res.status, typeof data?.error === "string" ? data.error : "Request failed");
  }

  return data as T;
}
