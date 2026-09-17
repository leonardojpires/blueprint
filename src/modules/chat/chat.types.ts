import type { RefObject } from "react";
import type { PlanPreviewData, SavedPlanWeek } from "../study-plans/study-plan.types.js";

export interface ChatMessage {
  role: "assistant" | "user";
  text: string;
}

export interface GroqPlan {
  title: string;
  description: string;
  weeks: SavedPlanWeek[];
  status: "ready" | "needs-info";
}

export interface GroqResponse {
  assistantText: string;
  status: "ready" | "needs-info";
  plan?: GroqPlan;
}

export interface PersistGroqPlanRequest {
  title: string;
  description?: string;
  weeks: GroqPlan["weeks"];
  is_saved?: boolean;
}

export interface ChatMessageData extends ChatMessage {
  status: "ready" | "needs-info";
}

export interface UseChatResult {
  messages: ChatMessageData[];
  planPreview: PlanPreviewData | null;
  isGenerating: boolean;
  isPlanSaved: boolean;
  messagesEndRef: RefObject<HTMLDivElement>;
  submitPrompt: (prompt: string) => Promise<void>;
  saveCurrentPlan: () => Promise<void>;
  regenerateLastPlan: () => Promise<void>;
}
