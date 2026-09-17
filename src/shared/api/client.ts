const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

function getErrorMessage(status: number): string {
  switch (status) {
    case 400:
    case 422:
      return "Please check the information you provided and try again.";
    case 401:
      return "We couldn't verify your account. Please check your details or sign in again.";
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return "The requested information could not be found.";
    case 409:
      return "This request conflicts with existing information. Please review it and try again.";
    case 413:
      return "The submitted information is too large. Please shorten it and try again.";
    case 429:
      return "You've made too many requests. Please wait a moment and try again.";
    default:
      return status >= 500
        ? "Something went wrong on our side. Please try again later."
        : "We couldn't complete your request. Please try again.";
  }
}

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

export async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(getErrorMessage(response.status));
  }

  return (await response.json()) as T;
}

export function ensureSuccessfulResponse(response: Response): Response {
  if (!response.ok) {
    throw new Error(getErrorMessage(response.status));
  }

  return response;
}

export const jsonHeaders = {
  "Content-Type": "application/json",
} as const;
