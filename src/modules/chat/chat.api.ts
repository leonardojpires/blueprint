import type { ChatMessage, GroqResponse, PersistGroqPlanRequest } from "./chat.types.js";
import { apiUrl, parseJsonResponse } from "../../shared/api/client.js";
import { getCsrfHeaders } from "../auth/auth.api.js";
import type { SavedPlanResponse } from "../study-plans/study-plan.types.js";


export async function converse(messages: ChatMessage[]): Promise<GroqResponse> {
  const response = await fetch(apiUrl("/groq/converse"), {
    method: "POST",
    headers: getCsrfHeaders(),
    body: JSON.stringify({ messages }),
    credentials: "include",
  });

  const body = await parseJsonResponse<{ data: GroqResponse }>(response);
  return body.data;
}

export async function persistGroqPlan(
  plan: PersistGroqPlanRequest,
): Promise<SavedPlanResponse> {
  const response = await fetch(apiUrl("/groq/persist"), {
    method: "POST",
    headers: getCsrfHeaders(),
    body: JSON.stringify(plan),
    credentials: "include",
  });

  return parseJsonResponse<SavedPlanResponse>(response);
}
