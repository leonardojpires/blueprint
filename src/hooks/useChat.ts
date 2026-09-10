import { useCallback, useEffect, useRef, useState } from "react";
import { converse, persistGroqPlan } from "../api";
import { ChatMessageData } from "../components/chat/ChatMessage";
import { PlanPreviewData } from "../components/chat/PlanPreview";

const WELCOME_MESSAGE: ChatMessageData = {
  role: "assistant",
  text: "Hello! I'm Blueprint, your study assistant. Tell me what you want to learn and I will create a study plan for you.",
  status: "needs-info",
};

export interface UseChatResult {
  messages: ChatMessageData[];
  planPreview: PlanPreviewData | null;
  isGenerating: boolean;
  isPlanSaved: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  submitPrompt: (prompt: string) => Promise<void>;
  saveCurrentPlan: () => Promise<void>;
  regenerateLastPlan: () => Promise<void>;
}

export function useChat(): UseChatResult {
  const [messages, setMessages] = useState<ChatMessageData[]>([WELCOME_MESSAGE]);
  const [planPreview, setPlanPreview] = useState<PlanPreviewData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlanSaved, setIsPlanSaved] = useState(false);
  const lastPromptRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to the bottom of the chat whenever a new message is added.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [messages]);

  const submitPrompt = useCallback(
    async (rawPrompt: string) => {
      const prompt = rawPrompt.trim();
      if (!prompt) return;

      lastPromptRef.current = prompt;
      const userMessage: ChatMessageData = {
        role: "user",
        text: prompt,
        status: "needs-info",
      };

      setMessages((prev) => [...prev, userMessage]);

      setIsGenerating(true);

      try {
        const conversation = [...messages, userMessage].map((msg) => ({
          role: msg.role,
          text: msg.text,
        }));
        const result = await converse(conversation);

        const assistantText =
          result.status === "ready" && result.plan
            ? `Groq generated a study plan recommendation titled "${result.plan.title}". Review the preview below and save it if you like.`
            : result.assistantText;

        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: assistantText, status: result.status },
        ]);

        if (result.status === "ready" && result.plan) {
          setPlanPreview(result.plan);
          setIsPlanSaved(false);
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Something went wrong.";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: message, status: "needs-info" },
        ]);
      } finally {
        setIsGenerating(false);
      }
    },
    [messages],
  );

  const saveCurrentPlan = useCallback(async () => {
    if (!planPreview) return;

    await persistGroqPlan({
      title: planPreview.title,
      description: planPreview.description,
      weeks: planPreview.weeks.map((week) => ({
        week_number: week.week_number,
        title: week.title,
        objectives: week.objectives,
        topics: week.topics,
      })),
      is_saved: true,
    });

    setIsPlanSaved(true);
  }, [planPreview]);

  const regenerateLastPlan = useCallback(async () => {
    if (!lastPromptRef.current) return;

    setPlanPreview(null);
    setIsPlanSaved(false);

    await submitPrompt(lastPromptRef.current);
  }, [submitPrompt]);

  return {
    messages,
    planPreview,
    isGenerating,
    isPlanSaved,
    messagesEndRef,
    submitPrompt,
    saveCurrentPlan,
    regenerateLastPlan,
  };
}
