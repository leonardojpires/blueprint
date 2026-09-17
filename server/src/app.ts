import express from "express";
import cors from "cors";
import authRouter from "./modules/auth/auth.routes.js";
import userRouter from './modules/users/user.routes.js';
import cookieParser from "cookie-parser";
import studyPlanRouter from "./modules/study-plans/study-plan.routes.js";
import groqRouter from "./modules/groq/groq.routes.js";
import { handleCsrfError } from "./middleware/csrf.middleware.js";

const app = express();

app.use(cors({ 
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
    allowedHeaders: ["Content-Type", "X-CSRF-Token"]
}));

app.use(cookieParser());
app.use(express.json());
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/study-plan", studyPlanRouter);
app.use("/groq", groqRouter);
app.use(handleCsrfError);

export default app;
