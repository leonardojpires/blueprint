import type { CsrfTokenResponse, AuthResponse } from "./auth.types.js";
import { apiUrl, jsonHeaders, parseJsonResponse } from "../../shared/api/client.js";


let csrfToken: string;

export async function loginUser(
  email: string,
  password: string,
  rememberMe: boolean
): Promise<AuthResponse> {
  const response = await fetch(apiUrl("/auth/login"), {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email, password, rememberMe }),
    credentials: "include",
  });

  return parseJsonResponse<AuthResponse>(response);
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(apiUrl("/auth/register"), {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ name, email, password }),
    credentials: "include",
  });

  return parseJsonResponse<AuthResponse>(response);
}

export async function fetchCurrentUser(): Promise<AuthResponse> {
  const response = await fetch(apiUrl("/user/users/me"), {
    credentials: "include",
  });

  return parseJsonResponse<AuthResponse>(response);
}

export async function logoutUser(): Promise<void> {
  await fetch(apiUrl("/auth/logout"), {
    method: "POST",
    headers: getCsrfHeaders(),
    credentials: "include",
  });
}

export async function fetchCsrfToken(): Promise<string> {
  const response = await fetch(apiUrl('/auth/get-csrf-token'), {
    method: 'GET',
    credentials: 'include'
  });

  const body = await parseJsonResponse<CsrfTokenResponse>(response);

  csrfToken = body.csrfToken;
  return csrfToken;
}

export function getCsrfHeaders() {
  if (!csrfToken) throw new Error("CSRF token is not available");

  return {
    ...jsonHeaders,
    'X-CSRF-Token': csrfToken
  };
}
