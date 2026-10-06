export interface PlanPreviewData {
  title: string;
  description?: string;
  weeks: SavedPlanWeek[];
}

export interface SavedPlanWeek {
  week_number: number;
  title: string;
  objectives: string[];
  topics: string[];
}

export interface SavedPlan {
  id: number;
  title: string;
  description: string;
  is_saved?: boolean;
  weeks: SavedPlanWeek[];
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface SavedPlansResponse {
  data: SavedPlan[];
}

export interface SavedPlanResponse {
  data: SavedPlan;
}
