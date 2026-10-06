import { sendProblem } from "../../shared/http/problem.js";
import type { AuthenticatedRequest } from "../auth/auth.types.js";
import { Request, Response } from "express";
import { StudyPlanService } from "./study-plan.service.js";
import PlanNotFoundError from "../../errors/plan-not-found.error.js";

export class StudyPlanController {
  constructor(private studyPlanService: StudyPlanService) {}

  generate = async (req: Request, res: Response) => {
    try {
      const userId = this.getUserId(req);
      if (!userId) return sendProblem(res, 401, "AUTHENTICATION_REQUIRED", "Please sign in to continue.");

      const result = await this.studyPlanService.generate(req.body, userId);

      return res.status(201).location(`/study-plan/plan/${result.id}`).json({ data: result });
    } catch (error: unknown) {
      // console.error("Failed to generate study plan:", error);
      return sendProblem(res, 500, "INTERNAL_ERROR", "We couldn't create your study plan. Please try again.");
    }
  };

  getPlansByUserId = async (req: Request, res: Response) => {
    try {
      const userId = this.getUserId(req);
      if (!userId) return sendProblem(res, 401, "AUTHENTICATION_REQUIRED", "Please sign in to continue.");

      const result = await this.studyPlanService.getPlansByUserId(userId);

      return res.status(200).json({ data: result });
    } catch (error: unknown) {
      // console.error("Failed to retrieve study plans:", error);
      return sendProblem(res, 500, "INTERNAL_ERROR", "We couldn't load your study plans. Please try again.");
    }
  };

  getPlanById = async (req: Request, res: Response) => {
    try {
      const userId = this.getUserId(req);
      if (!userId) return sendProblem(res, 401, "AUTHENTICATION_REQUIRED", "Please sign in to continue.");

      const { id } = req.params;
      const planId = Number(id);

      if (!Number.isSafeInteger(planId) || planId <= 0) {
        return sendProblem(res, 400, "INVALID_PLAN_ID", "Plan ID must be a positive integer.");
      }

      const result = await this.studyPlanService.getPlanById(userId, planId);
      
      return res.status(200).json({
        data: result
      });
    } catch(error: unknown) {
      if (error instanceof PlanNotFoundError) {
        return sendProblem(res, 404, "PLAN_NOT_FOUND", "Study plan not found.");
      }
      return sendProblem(res, 500, "INTERNAL_ERROR", "We couldn't load this study plan. Please try again.");
    }
  }

  deletePlan = async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    if (!userId) return sendProblem(res, 401, "AUTHENTICATION_REQUIRED", "Please sign in to continue.");
    try {
        const planId = Number(req.params.id);
        if (!Number.isSafeInteger(planId) || planId <= 0) {
          return sendProblem(res, 400, "INVALID_PLAN_ID", "Plan ID must be a positive integer.");
        }
        await this.studyPlanService.deletePlan(planId, userId);

        return res.status(204).end();
    } catch (error: unknown) {
      if (error instanceof PlanNotFoundError) {
        return sendProblem(res, 404, "PLAN_NOT_FOUND", "Study plan not found.");
      }
      // console.error("Failed to delete study plan:", error);
      return sendProblem(res, 500, "INTERNAL_ERROR", "We couldn't remove the study plan. Please try again.");
    }
  };

  /* -- HELPER FUNCTIONS -- */
  private getUserId(req: Request) {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.sub;

    return userId;
  }
}
