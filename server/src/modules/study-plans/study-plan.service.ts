import { IStudyPlanRepository } from "./study-plan.repository.interface.js";
import { StudyPlan } from "./study-plan.entity.js";
import { CreateStudyPlanDTO } from "./study-plan.dto.js";
import { StudyPlanWeek } from "./study-plan-week.entity.js";

export class StudyPlanService {
  constructor(private studyPlanRepository: IStudyPlanRepository) {}

  async generate(dto: CreateStudyPlanDTO, userId: number): Promise<StudyPlan> {
    if (!userId) throw new Error("User not found");

    const studyPlan = new StudyPlan({
      title: dto.title,
      description: dto.description ?? "",
      is_saved: dto.is_saved ?? false,
      weeks: (dto.weeks ?? []).map(
        (week) =>
          new StudyPlanWeek({
            week_number: week.week_number,
            title: week.title,
            objectives: week.objectives,
            topics: week.topics,
          }),
      ),
      user_id: userId,
    });

    await this.studyPlanRepository.create(studyPlan);

    return studyPlan;
  }

  async getPlansByUserId(userId: number) {
    if (!userId) throw new Error("User not found");

    const studyPlans = await this.studyPlanRepository.getPlansByUserId(userId);

    return studyPlans;
  }

  async getPlanById(userId: number, planId: number) {
    if (!userId) throw new Error("User not found");
    if (!planId) throw new Error("Plan not found.");

    const studyPlan = await this.studyPlanRepository.getPlanById(
      userId,
      planId,
    );

    return studyPlan;
  }

  async deletePlan(planId: number, userId: number) {
    const affectedRows = await this.studyPlanRepository.deletePlan(
      planId,
      userId,
    );

    if (affectedRows === 0) throw new Error("Study plan not found.");
  }
}
