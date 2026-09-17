import { StudyPlan } from "./study-plan.entity.js";

export interface IStudyPlanRepository {
    create(studyPlan: StudyPlan): Promise<StudyPlan>;
    getPlansByUserId(userId: number): Promise<StudyPlan[]>
    getPlanById(userId: number, planId: number): Promise<StudyPlan | undefined>
    deletePlan(planId: number, userId: number): Promise<number>
}
