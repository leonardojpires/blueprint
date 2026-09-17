// Public API facade. Keeping this module stable avoids coupling consumers to the
// internal organization of the API layer.
export {
  fetchCsrfToken,
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../../modules/auth/auth.api.js";
export { converse, persistGroqPlan } from "../../modules/chat/chat.api.js";
export {
  deletePlan,
  getPlansByUserId,
} from "../../modules/study-plans/study-plan.api.js";

export type { AuthResponse } from "../../modules/auth/auth.types.js";
export type { ChatMessage, GroqPlan, GroqResponse, PersistGroqPlanRequest } from "../../modules/chat/chat.types.js";
