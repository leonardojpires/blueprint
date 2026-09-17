import type { StudyPlanRow, StudyPlanWeekRow, StudyPlanWeekObjectiveRow, StudyPlanWeekTopicRow } from "../../shared/types/database.js";
import type {
  Pool,
  PoolConnection,
  ResultSetHeader,
} from "mysql2/promise";
import { IStudyPlanRepository } from "./study-plan.repository.interface.js";
import { StudyPlan } from "./study-plan.entity.js";
import { StudyPlanWeek } from "./study-plan-week.entity.js"; 
import PlanNotFoundError from "../../errors/plan-not-found.error.js";

    // NOTE ON mysql2 `pool.query()` RETURN VALUE:
    //
    // `pool.query()` always resolves to a tuple: [result, fields].
    //
    // 1) `result` (first element):
    //    - For INSERT queries, this is a `ResultSetHeader` object (NOT an array).
    //    - It contains metadata about the operation, such as:
    //        - `insertId`: the ID of the newly inserted row
    //        - `affectedRows`: number of rows impacted by the query
    //        - `warningStatus`, `serverStatus`, etc.
    //    - Example shape:
    //        { insertId: 123, affectedRows: 1, ... }
    //
    // 2) `fields` (second element):
    //    - An array of column metadata (`FieldPacket[]`).
    //    - Mostly useful for SELECT queries.
    //    - Typically empty or irrelevant for INSERT/UPDATE/DELETE operations.
    //
    // IMPORTANT:
    // - Do NOT treat `result` as an array (e.g., `result[0]` is incorrect).
    // - Always provide a generic type to `query()` (e.g., <ResultSetHeader>)
    //   to avoid using `any` and to let TypeScript catch incorrect assumptions.

export class StudyPlanRepository implements IStudyPlanRepository {
  constructor(private pool: Pool) {}

  async create(studyPlan: StudyPlan): Promise<StudyPlan> {
    const conn = await this.pool.getConnection();
    if (!studyPlan.user_id) throw new Error("User not found");

    try {
      await conn.beginTransaction();

      const [result] = await conn.execute<ResultSetHeader>(
        "INSERT INTO study_plans (user_id, title, description, is_saved) VALUES (?, ?, ?, ?)",
        [
          studyPlan.user_id,
          studyPlan.title,
          studyPlan.description ?? '',
          studyPlan.is_saved ?? false
        ],
      );

      studyPlan.id = result.insertId;

      for (const week of studyPlan.weeks) {
        const [weekResult] = await conn.execute<ResultSetHeader>(
          "INSERT INTO study_plans_weeks (study_plan_id, week_number, title) VALUES (?, ?, ?)",
          [studyPlan.id, week.week_number, week.title],
        );

        const weekId = weekResult.insertId;

        if (week.objectives.length) {
          const objectiveRows = week.objectives.map((objective) => {
            return [weekId, objective];
          });
          await conn.query(
            "INSERT INTO study_plans_week_objectives (study_plan_week_id, objective) VALUES ?",
            [objectiveRows],
          );
        }

        if (week.topics.length) {
          const topicRows = week.topics.map((topic) => {
            return [weekId, topic];
          });

          await conn.query(
            "INSERT INTO study_plans_week_topics (study_plan_week_id, topic) VALUES ?",
            [topicRows],
          );
        }
      }

      await conn.commit();
      return studyPlan;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  async getPlansByUserId(userId: number): Promise<StudyPlan[]> {
    const conn = await this.pool.getConnection();
    try {
      const plans = await this.getStudyPlans(conn, userId);

      if (plans.length === 0) return [];

      const weeks = await this.getWeeks(conn, plans);
      const objectives = await this.getWeeksObjectives(conn, weeks);
      const topics = await this.getWeeksTopics(conn, weeks);

      return this.buildStudyPlans(plans, weeks, objectives, topics);
    } finally {
      conn.release();
    }
  }

  async getPlanById(userId: number, planId: number) {
    const conn = await this.pool.getConnection();
    
    try {
      const planAsArray = await this.getStudyPlan(conn, userId, planId);

      if (!planAsArray || planAsArray.length === 0) throw new PlanNotFoundError("Study plan not found.");

      if (planAsArray[0]?.user_id !== userId) throw new Error("You don't have permission to see this study plan.");

      const weeks = await this.getWeeks(conn, planAsArray);
      const objectives = await this.getWeeksObjectives(conn, weeks);
      const topics = await this.getWeeksTopics(conn, weeks);

      const plans = this.buildStudyPlans(planAsArray, weeks, objectives, topics);
      return plans[0];

    } finally {
      conn.release();
    }
  }

  async deletePlan(planId: number, userId: number): Promise<number> {
    const conn = await this.pool.getConnection();

    try {
      await conn.beginTransaction();
      const [result] = await conn.execute<ResultSetHeader>(
        `DELETE FROM study_plans WHERE id = ? AND user_id = ?`,
        [planId, userId],
      );

      await conn.commit();

      return result.affectedRows;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  /* ---------------------- */
  /* -- HELPER FUNCTIONS -- */
  private async getStudyPlans(conn: PoolConnection, userId: number): Promise<StudyPlanRow[]> {
    const [result] = await conn.execute<StudyPlanRow[]>(
      `SELECT *
       FROM study_plans
       WHERE user_id = ?`,
      [userId],
    );

    return result;
  }

  private async getStudyPlan(conn: PoolConnection, userId: number, planId: number) {
    const [result] = await conn.execute<StudyPlanRow[]>(
      `SELECT *
      FROM study_plans
      WHERE id = ?
      AND user_id = ?`,
      [planId, userId]
    );

    return result;
  }

  private async getWeeks(conn: PoolConnection, plans: StudyPlanRow[]): Promise<StudyPlanWeekRow[]> {
    const planIds = plans.map((plan) => plan.id);
    if (!planIds) return [];

    const [result] = await conn.query<StudyPlanWeekRow[]>(
      `SELECT *
         FROM study_plans_weeks
         WHERE study_plan_id IN (?)
         ORDER BY week_number`,
      [planIds],
    );

    return result;
  }

  private async getWeeksObjectives(
    conn: PoolConnection,
    weeks: StudyPlanWeekRow[],
  ): Promise<StudyPlanWeekObjectiveRow[]> {
    const weekIds = weeks.map((week) => week.id);

    if (weekIds.length === 0) return [];

    const [result, _] = await conn.query<StudyPlanWeekObjectiveRow[]>(
      `SELECT *
       FROM study_plans_week_objectives
       WHERE study_plan_week_id IN (?)`,
      [weekIds],
    );

    return result;
  }

  private async getWeeksTopics(conn: PoolConnection, weeks: StudyPlanWeekRow[]): Promise<StudyPlanWeekTopicRow[]> {
    const weekIds = weeks.map((week) => week.id);

    if (weekIds.length === 0) return [];

    const [result, _] = await conn.query<StudyPlanWeekTopicRow[]>(
      `SELECT *
       FROM study_plans_week_topics
       WHERE study_plan_week_id IN (?)`,
      [weekIds],
    );

    return result;
  }

  private buildStudyPlans(
    plans: StudyPlanRow[],
    weeks: StudyPlanWeekRow[],
    objectives: StudyPlanWeekObjectiveRow[],
    topics: StudyPlanWeekTopicRow[],
  ): StudyPlan[] {
    const objectivesByWeekId = this.groupObjectivesByWeekId(objectives);

    const topicsByWeekId = this.groupTopicsByWeekId(topics);

    const weeksByPlanId = this.groupWeeksByPlanId(
      weeks,
      objectivesByWeekId,
      topicsByWeekId,
    );

    return plans.map((plan) => {
      return new StudyPlan({
        id: plan.id,
        user_id: plan.user_id,
        title: plan.title,
        description: plan.description,
        created_at: plan.created_at,
        weeks: weeksByPlanId.get(plan.id) ?? [],
      });
    });
  }

  private groupObjectivesByWeekId(objectives: StudyPlanWeekObjectiveRow[]): Map<number, string[]> {
    const map = new Map<number, string[]>();

    for (const objective of objectives) {
      const weekId = objective.study_plan_week_id;

      if (!map.has(weekId)) map.set(weekId, []);

      map.get(weekId)!.push(objective.objective);
    }

    return map;
  }

  private groupTopicsByWeekId(topics: StudyPlanWeekTopicRow[]): Map<number, string[]> {
    const map = new Map<number, string[]>();

    for (const topic of topics) {
      const weekId = topic.study_plan_week_id;

      if (!map.has(weekId)) map.set(weekId, []);

      map.get(weekId)!.push(topic.topic);
    }

    return map;
  }

  private groupWeeksByPlanId(
    weeks: StudyPlanWeekRow[],
    objectivesByWeekId: Map<number, string[]>,
    topicsByWeekId: Map<number, string[]>,
  ): Map<number, StudyPlanWeek[]> {
    const map = new Map<number, StudyPlanWeek[]>();

    for (const week of weeks) {
      const planId = week.study_plan_id;

      if (!map.has(planId)) map.set(planId, []);

      map.get(planId)!.push(
        new StudyPlanWeek({
          id: week.id,
          week_number: week.week_number,
          title: week.title,
          objectives: objectivesByWeekId.get(week.id) ?? [],
          topics: topicsByWeekId.get(week.id) ?? [],
        }),
      );
    }

    return map;
  }
}
