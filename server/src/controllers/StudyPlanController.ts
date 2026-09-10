import { Request, Response } from "express";
import { StudyPlanService } from "../services/studyPlanService.js";
import PlanNotFoundError from "../utils/PlanNotFoundError.js";

type AuthenticatedRequest = Request & { user?: { sub?: number } };

export class StudyPlanController {
  constructor(private studyPlanService: StudyPlanService) {}

  generate = async (req: Request, res: Response) => {
    try {
      const userId = this.getUserId(req);
      if (!userId) return res.status(401).json({ message: "Please sign in to continue." });

      const result = await this.studyPlanService.generate(req.body, userId);

      return res.status(201).json({
        message: "Study plan generated successfully.",
        success: true,
        studyPlan: result,
      });
    } catch (error: unknown) {
      // console.error("Failed to generate study plan:", error);
      return res.status(500).json({
        message: "We couldn't create your study plan. Please try again.",
      });
    }
  };

  getPlansByUserId = async (req: Request, res: Response) => {
    try {
      const userId = this.getUserId(req);
      if (!userId) return res.status(401).json({ message: "Please sign in to continue." });

      const result = await this.studyPlanService.getPlansByUserId(userId);

      return res.status(201).json({
        success: true,
        plans: result,
      });
    } catch (error: unknown) {
      // console.error("Failed to retrieve study plans:", error);
      return res.status(500).json({
        message: "We couldn't load your study plans. Please try again.",
      });
    }
  };

  getPlanById = async (req: Request, res: Response) => {
    try {
      const userId = this.getUserId(req);
      if (!userId) return res.status(401).json({ message: "Please sign in to continue." });

      const { id } = req.params;
      const planId = Number(id);

      if (!planId) return res.status(404).json({ message: "Study plan not found." });

      const result = await this.studyPlanService.getPlanById(userId, planId);
      
      return res.status(200).json({
        success: true,
        plan: result
      });
    } catch(error: unknown) {
      if (error instanceof PlanNotFoundError) {
        return res.status(404).json({
          message: "Plan not found."
        });
      }
      return res.status(500).json({
        message: "We couldn't load this study plan. Please try again.",
      });
    }
  }

  deletePlan = async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    if (!userId) return res.status(401).json({ message: "Please sign in to continue." });
    try {
        const planId = Number(req.params.id);
        await this.studyPlanService.deletePlan(planId, userId);

        return res.status(204).send();
    } catch (error: unknown) {
      // console.error("Failed to delete study plan:", error);
      return res.status(500).json({
        message: "We couldn't remove the study plan. Please try again.",
      });
    }
  };

  private getUserId(req: Request) {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.sub;

    return userId;
  }
}
