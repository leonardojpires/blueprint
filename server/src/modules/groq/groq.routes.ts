import { Router } from "express";
import GroqService from "./groq.service.js";
import { GroqController } from "./groq.controller.js";
import authenticateToken from "../../middleware/auth.middleware.js";
import { StudyPlanService } from "../study-plans/study-plan.service.js";
import { StudyPlanRepository } from "../study-plans/study-plan.repository.js";
import { pool } from "../../config/database.js";
import { groqLimiter } from "./groq.limiter.js";
import { doubleCsrfProtection } from "../../middleware/csrf.middleware.js";

const groqRouter = Router();

const studyPlanRepository = new StudyPlanRepository(pool);
const studyPlanService = new StudyPlanService(studyPlanRepository);
const groqService = new GroqService();
const groqController = new GroqController(groqService, studyPlanService);

groqRouter.post("/converse", authenticateToken, doubleCsrfProtection, groqLimiter, groqController.converse);
groqRouter.post("/persist", authenticateToken, doubleCsrfProtection, groqController.persist);

export default groqRouter;
