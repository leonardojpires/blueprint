import type { ChatMessage, GroqConversationResult, GroqResponse } from "./groq.types.js";
import Groq from "groq-sdk";
import { CreateStudyPlanDTO } from "../study-plans/study-plan.dto.js";
import pLimit from "p-limit";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
  timeout: 20 * 1000,
  maxRetries: 1
});

export default class GroqService {
  private readonly groqConcurrencyLimit = pLimit(2);

  private buildPrompt(messages: ChatMessage[]) {
    const instructions = [
      // Identity and tone
      "You are an expert study-plan assistant who genuinely enjoys helping people learn.",
      "You speak like a friendly, knowledgeable mentor: warm, encouraging, and curious about the learner's goals.",
      "You are concise but never robotic. Avoid stiff or corporate phrasing.",
      "Use light, natural language — the kind of tone a great tutor would use in a one-on-one session.",
      "Show enthusiasm for the topic when relevant, and acknowledge the learner's ambition.",

      // Output contract (strict)
      "Always respond with valid JSON only.",
      "Do not use markdown.",
      "Do not wrap responses in code fences.",
      "Do not include any text outside the JSON object.",
      "Respond in the same language as the user.",

      // Clarification mode
      "If you do not have enough information to create a study plan, return:",
      `{
    "status": "needs-info",
    "question": "your question here"
  }`,
      "Ask only one clarifying question at a time, and phrase it conversationally.",
      "Briefly acknowledge or react to what the user just said before asking your next question, so the conversation feels alive.",
      "Do not generate a plan until you have enough information.",

      // Ready mode
      "When you have enough information, return:",
      `{
    "status": "ready",
    "plan": {
      "title": "string",
      "description": "string",
      "weeks": [
        {
          "week_number": 1,
          "title": "string",
          "objectives": ["string"],
          "topics": ["string"]
        }
      ],
      "is_saved": false
    }
  }`,
      "Generate as many weeks as necessary for the topic, typically between 4 and 16.",
      "Never return a plan when status is 'needs-info'.",
      "Never return a question when status is 'ready'.",
    ];

    const history = messages
      .map((message) => `${message.role}: ${message.text}`)
      .join("\n");

    return [...instructions, history, "assistant:"].join("\n");
  }

  private async callGroq(prompt: string): Promise<string> {
    return this.groqConcurrencyLimit(async () => {
      const response = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL || "",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_completion_tokens: 3_000,
      });

      return response.choices[0]?.message?.content || "";
    });
  }

  private validatePlan(candidate: CreateStudyPlanDTO): boolean {
    if (
      typeof candidate !== "object" ||
      candidate === null ||
      typeof candidate.title !== "string" ||
      typeof candidate.description !== "string" ||
      !Array.isArray(candidate.weeks) ||
      candidate.weeks.length === 0
    ) {
      return false;
    }

    return candidate.weeks.every((week) => {
      return (
        typeof week === "object" &&
        typeof week.week_number === "number" &&
        typeof week.title === "string" &&
        Array.isArray(week.objectives) &&
        week.objectives.every((objective) => typeof objective === "string") &&
        Array.isArray(week.topics) &&
        week.topics.every((topic) => typeof topic === "string")
      );
    });
  }

  async converse(messages: ChatMessage[]): Promise<GroqConversationResult> {
    const prompt = this.buildPrompt(messages);
    const assistantText = await this.callGroq(prompt);

    let data: GroqResponse;

    data = JSON.parse(assistantText);

    if (!data.status) {
      return {
        assistantText,
        status: "needs-info",
      };
    }

    if (data.status === "needs-info") {
      return {
        assistantText: data.question,
        status: "needs-info",
      };
    }

    const plan = this.validatePlan(data.plan) ? data.plan : null;

    if (plan) {
      return {
        assistantText: `Study plan generated: ${plan.title}`,
        status: "ready",
        plan,
      };
    }

    return {
      assistantText: "Invalid plan structure, please try again.",
      status: "needs-info",
    };
  }
}
