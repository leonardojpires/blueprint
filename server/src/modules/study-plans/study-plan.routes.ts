import { Router } from "express";
import { StudyPlanRepository } from "./study-plan.repository.js";
import { StudyPlanService } from "./study-plan.service.js";
import { StudyPlanController } from "./study-plan.controller.js";
import authenticateToken from "../../middleware/auth.middleware.js";
import { pool } from "../../config/database.js";
import { doubleCsrfProtection } from "../../middleware/csrf.middleware.js";

const studyPlanRouter = Router();

const studyPlanRepository = new StudyPlanRepository(pool);
const studyPlanService = new StudyPlanService(studyPlanRepository);
const studyPlanController = new StudyPlanController(studyPlanService);

studyPlanRouter.post("/generate", authenticateToken, doubleCsrfProtection, studyPlanController.generate);
studyPlanRouter.get("/get-saved-plans", authenticateToken, studyPlanController.getPlansByUserId);
studyPlanRouter.get("/plan/:id", authenticateToken, studyPlanController.getPlanById);
studyPlanRouter.delete("/delete-plan/:id", authenticateToken, doubleCsrfProtection, studyPlanController.deletePlan);

export default studyPlanRouter;
