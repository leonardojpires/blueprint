import type { StudyPlanWeek } from "./study-plan-week.entity.js";

export type StudyPlanProps = {
    id?: number | undefined;
    title: string;
    description?: string | undefined;
    is_saved?: boolean | undefined;
    weeks?: StudyPlanWeek[];
    user_id?: number | undefined;
    created_at?: Date | undefined;
    updated_at?: Date | undefined;
}

export type StudyPlanWeekProps = {
    id?: number;
    study_plan_id?: number;
    week_number: number;
    title: string;
    objectives: string[];
    topics: string[];
}
