import type { RowDataPacket } from "mysql2/promise";

export interface StudyPlanRow extends RowDataPacket {
  id: number;
  user_id: number;
  title: string;
  description: string;
  created_at: Date;
}

export interface StudyPlanWeekRow extends RowDataPacket {
  id: number;
  study_plan_id: number;
  week_number: number;
  title: string;
}

export interface StudyPlanWeekObjectiveRow extends RowDataPacket {
  study_plan_week_id: number;
  objective: string;
}

export interface StudyPlanWeekTopicRow extends RowDataPacket {
  study_plan_week_id: number;
  topic: string;
}

export interface UserRow extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    is_admin: boolean;
    created_at: Date;
    updated_at: Date;
}
