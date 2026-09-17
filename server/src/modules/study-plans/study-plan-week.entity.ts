import type { StudyPlanWeekProps } from "./study-plan.types.js";
export class StudyPlanWeek {
    id?: number | undefined;
    study_plan_id?: number | undefined;
    week_number: number;
    title: string;
    objectives: string[];
    topics: string[];

    constructor(props: StudyPlanWeekProps) {
        this.id = props.id;
        this.study_plan_id = props.study_plan_id;
        this.week_number = props.week_number;
        this.title = props.title;
        this.objectives = props.objectives;
        this.topics = props.topics;
    }
}
