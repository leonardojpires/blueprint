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
  success: boolean;
  plans: SavedPlan[];
}

export interface SavedPlanResponse {
  success: boolean;
  plan: SavedPlan;
}
