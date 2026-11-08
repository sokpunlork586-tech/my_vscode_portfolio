const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

export function resolveMediaUrl(rawUrl?: string | null): string | null {
  if (!rawUrl) return null;

  // Strip hardcoded localhost / 127.0.0.1 URLs
  const cleanUrl = rawUrl.replace(/^https?:\/\/(localhost|127\.0\.0\.1):[0-9]+/, "");

  if (cleanUrl.startsWith("https://")) {
    return cleanUrl;
  }
  if (cleanUrl.startsWith("http://")) {
    if (typeof window !== "undefined" && window.location.protocol === "https:") {
      return cleanUrl.replace(/^http:\/\//, "https://");
    }
    return cleanUrl;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (apiBase) {
    const origin = apiBase.replace(/\/api\/v1\/?$/, "");
    return `${origin}${cleanUrl.startsWith("/") ? "" : "/"}${cleanUrl}`;
  }

  // Prevent mixed-content console warnings when running on HTTPS without configured backend
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    return null;
  }

  return `http://127.0.0.1:8000${cleanUrl.startsWith("/") ? "" : "/"}${cleanUrl}`;
}

class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("portfolio_admin_token");
}

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("portfolio_admin_token", token);
  }
}

export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("portfolio_admin_token");
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeAuthToken();
    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
  }

  if (response.status === 204) {
    return {} as T;
  }

  let data: any;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const message = data?.detail || response.statusText || "Request failed";
    throw new ApiError(response.status, message, data);
  }

  return data as T;
}

export const api = {
  get: <T>(url: string, headers?: HeadersInit) =>
    request<T>(url, { method: "GET", headers }),
  post: <T>(url: string, body?: any, headers?: HeadersInit) =>
    request<T>(url, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers,
    }),
  put: <T>(url: string, body?: any, headers?: HeadersInit) =>
    request<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
      headers,
    }),
  patch: <T>(url: string, body?: any, headers?: HeadersInit) =>
    request<T>(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers,
    }),
  delete: <T>(url: string, headers?: HeadersInit) =>
    request<T>(url, { method: "DELETE", headers }),
};

