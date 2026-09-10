import type {
  SavedPlanResponse,
  SavedPlansResponse,
} from "../types.js";
import {
  apiUrl,
  ensureSuccessfulResponse,
  parseJsonResponse,
} from "./client.js";
import { getCsrfHeaders } from "./auth.js";

export async function getPlansByUserId(): Promise<SavedPlansResponse> {
  const response = await fetch(apiUrl("/study-plan/get-saved-plans"), {
    method: "GET",
    headers: getCsrfHeaders(),
    credentials: "include",
  });

  return parseJsonResponse<SavedPlansResponse>(response);
}

export async function getPlanById(id: number): Promise<SavedPlanResponse> {
  const response = await fetch(apiUrl(`/study-plan/plan/${id}`), {
    method: "GET",
    headers: getCsrfHeaders(),
    credentials: "include"
  });

  return parseJsonResponse<SavedPlanResponse>(response);
}


export async function deletePlan(planId: number): Promise<Response> {
  const response = await fetch(apiUrl(`/study-plan/delete-plan/${planId}`), {
    method: "DELETE",
    headers: getCsrfHeaders(),
    credentials: "include",
  });

  return ensureSuccessfulResponse(response);
}
