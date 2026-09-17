import type { StudyPlanProps } from "./study-plan.types.js";
import { CreateStudyPlanDTO } from "./study-plan.dto.js";
import { StudyPlanWeek } from "./study-plan-week.entity.js";

export class StudyPlan {
    id?: number | undefined;
    title: string;
    description?: string | undefined;
    is_saved?: boolean | undefined;
    weeks: StudyPlanWeek[] = [];
    user_id?: number | undefined;
    created_at?: Date | undefined;
    updated_at?: Date | undefined;

    constructor(props: StudyPlanProps) {
        this.id = props.id;
        this.title = props.title;
        this.description = props.description ?? "";
        this.is_saved = props.is_saved;
        this.weeks = props.weeks ?? [];
        this.user_id = props.user_id;
        this.created_at = props.created_at;
        this.updated_at = props.updated_at;
    }
}
