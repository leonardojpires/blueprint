export interface CreateStudyPlanWeekDTO {
    week_number: number;
    title: string;
    objectives: string[];
    topics: string[];
}

export interface CreateStudyPlanDTO {
    title: string;
    description?: string;
    weeks?: CreateStudyPlanWeekDTO[];
    is_saved?: boolean;
}
