import { Request, Response } from "express";
import GroqService from "../services/groqService.js";
import { StudyPlanService } from "../services/studyPlanService.js";
import {
  CreateStudyPlanDTO,
  CreateStudyPlanWeekDTO,
} from "../dtos/StudyPlanDTO.js";

type AuthenticatedRequest = Request & { user?: { sub?: number } };

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_CONVERSATION_LENGTH = 12_000;

export class GroqController {
  constructor(
    private groqService: GroqService,
    private studyPlanService: StudyPlanService,
  ) {}

  /* HELPER METHODS */
  private isString = (value: unknown): value is string =>
    typeof value === "string";
  private isStringArray = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((item) => typeof item === "string");

  private isValidWeek = (week: unknown): week is CreateStudyPlanWeekDTO => {
    if (typeof week !== "object" || week === null) return false;

    const candidate = week as Record<string, unknown>;
    return (
      typeof candidate.week_number === "number" &&
      this.isString(candidate.title) &&
      this.isStringArray(candidate.objectives) &&
      this.isStringArray(candidate.topics)
    );
  };

  private isValidStudyPlanPayload = (
    payload: unknown,
  ): payload is CreateStudyPlanDTO => {
    if (typeof payload !== "object" || payload === null) return false;

    const body = payload as Record<string, unknown>;

    if (!this.isString(body.title)) return false;
    if (body.description != null && !this.isString(body.description))
      return false;
    if (body.weeks !== undefined) {
      if (!Array.isArray(body.weeks) || !body.weeks.every(this.isValidWeek))
        return false;
    }

    return true;
  };

  /* -- MAIN METHODS -- */
  converse = async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;

      const userId = authReq.user?.sub;
      if (!userId)
        return res.status(401).json({ message: "Please sign in to continue." });

      const { messages } = req.body as { messages?: ChatMessage[] };

      if (!Array.isArray(messages)) {
        return res.status(400).json({
          message: "Please provide a valid conversation.",
        });
      }

      const hasInvalidMessage = messages.some(
        (message) =>
          typeof message !== "object" ||
          message === null ||
          (message.role !== "assistant" && message.role !== "user") ||
          typeof message.text !== "string",
      );

      if (hasInvalidMessage) {
        return res.status(400).json({
          message: "Please provide a valid conversation.",
        });
      }

      const conversationLength = messages.reduce(
        (total, message) => total + message.text.length,
        0,
      );

      if (
        messages.length > MAX_MESSAGES ||
        messages.some((message) => message.text.length > MAX_MESSAGE_LENGTH) ||
        conversationLength > MAX_CONVERSATION_LENGTH
      ) {
        return res.status(413).json({
          message: "This conversation is too long. Please shorten it and try again.",
        });
      }

      const result = await this.groqService.converse(messages);

      if (result.status === "ready" && result.plan) {
        if (!this.isValidStudyPlanPayload(result.plan)) {
          return res
            .status(422)
            .json({ message: "We couldn't prepare a valid study plan. Please try again." });
        }

        return res.status(200).json({
          ...result,
        });
      }

      return res.status(200).json(result);
    } catch (error: unknown) {
      console.error("Study plan conversation failed:", error);
      return res.status(500).json({
        message: "We couldn't process your request. Please try again.",
      });
    }
  };

  persist = async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.sub;
      if (!userId)
        return res.status(401).json({ message: "Please sign in to continue." });
      const payload = req.body;
      if (!this.isValidStudyPlanPayload(payload)) {
        return res.status(400).json({
          message: "Please provide a valid study plan.",
        });
      }
      const studyPlan = await this.studyPlanService.generate(payload, userId);
      return res.status(201).json({
        message: "Study plan persisted successfully in the database.",
        success: true,
        studyPlan,
      });
    } catch (error: unknown) {
      // console.error("Failed to save study plan:", error);
      return res.status(500).json({
        message: "We couldn't save your study plan. Please try again.",
      });
    }
  };
}
