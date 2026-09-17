import type { ChatMessage, GroqResponse, PersistGroqPlanRequest } from "./chat.types.js";
import { apiUrl, parseJsonResponse } from "../../shared/api/client.js";
import { getCsrfHeaders } from "../auth/auth.api.js";


export async function converse(messages: ChatMessage[]): Promise<GroqResponse> {
  const response = await fetch(apiUrl("/groq/converse"), {
    method: "POST",
    headers: getCsrfHeaders(),
    body: JSON.stringify({ messages }),
    credentials: "include",
  });

  return parseJsonResponse<GroqResponse>(response);
}

export async function persistGroqPlan(
  plan: PersistGroqPlanRequest,
): Promise<unknown> {
  const response = await fetch(apiUrl("/groq/persist"), {
    method: "POST",
    headers: getCsrfHeaders(),
    body: JSON.stringify(plan),
    credentials: "include",
  });

  return parseJsonResponse<unknown>(response);
}
