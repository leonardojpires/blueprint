import type { CreateStudyPlanDTO } from "../study-plans/study-plan.dto.js";

export type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

export interface GroqConversationResult {
  assistantText: string;
  status: "ready" | "needs-info";
  plan?: CreateStudyPlanDTO;
}

export type GroqResponse =
  | {
      status: "needs-info";
      question: string;
    }
  | {
      status: "ready";
      plan: CreateStudyPlanDTO;
    };
