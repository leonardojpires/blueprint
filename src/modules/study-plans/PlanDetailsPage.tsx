import type { SavedPlan } from "./study-plan.types.js";
import { Link, useParams } from "react-router-dom";

import { getPlanById } from "./study-plan.api";
import { useEffect, useState } from "react";

// Replace this value with the plan returned by GET /study-plan/get-plan/:id.
const DUMMY_PLAN: SavedPlan = {
  id: 1,
  user_id: 1,
  title: "Modern Full-Stack Web Development",
  description:
    "A practical roadmap for learning React, TypeScript, Node.js, and relational databases.",
  created_at: "2026-08-20T10:00:00.000Z",
  weeks: [
    {
      week_number: 1,
      title: "TypeScript Foundations",
      objectives: [
        "Understand TypeScript's core type system",
        "Create strongly typed application models",
      ],
      topics: ["Types", "Interfaces", "Generics"],
    },
    {
      week_number: 2,
      title: "React Fundamentals",
      objectives: [
        "Build reusable components",
        "Manage component state and side effects",
      ],
      topics: ["Components", "Props", "Hooks"],
    },
    {
      week_number: 3,
      title: "Backend and Data",
      objectives: [
        "Create a REST API with Node.js",
        "Store and retrieve data from a database",
      ],
      topics: ["Express", "REST", "SQL"],
    },
  ],
};

export function PlanDetailsPage() {
  const [plann, setPlann] = useState<SavedPlan>(DUMMY_PLAN);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  const { planId } = useParams();

  useEffect(() => {
    async function loadPlan() {
      setIsLoading(true);
      setIsNotFound(false);
      const id: number = Number(planId);

      if (!Number.isInteger(id) || id <= 0) {
        setIsNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await getPlanById(id);
        if (response.success) {
          const fetchedPlan = Array.isArray(response.plan)
            ? response.plan[0]
            : response.plan;

          if (!fetchedPlan) {
            setIsNotFound(true);
            return;
          }

          setPlann(fetchedPlan);
        } else {
          setIsNotFound(true);
        }
      } catch {
        setIsNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }

    void loadPlan();
  }, [planId]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      <main className="mx-auto w-full max-w-4xl">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--accent)]"
        >
          <span aria-hidden="true">&larr;</span>
          Back to saved plans
        </Link>

        {isLoading && (
          <section className="app-panel mt-5 rounded-lg border border-[var(--glass-border)] bg-white/70 p-8 shadow-xl backdrop-blur-xl">
            <div className="flex min-h-40 flex-col items-center justify-center">
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--accent)]" />
              <p className="mt-4 text-sm font-semibold text-[var(--text-muted)]">
                Loading study plan...
              </p>
            </div>
          </section>
        )}

        {isNotFound && !isLoading && (
          <section className="app-panel mt-5 overflow-hidden rounded-lg border border-[var(--glass-border)] bg-white/75 p-6 text-center shadow-xl backdrop-blur-xl sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--accent)]">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-8 w-8 fill-none stroke-current stroke-[1.7]"
              >
                <path
                  d="M9.5 9.5a3.5 3.5 0 0 1 5 0M9 15h6M4 5.5v13A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 18.5 4h-13A1.5 1.5 0 0 0 4 5.5Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="eyebrow mt-5">Error 404</p>
            <h1 className="mt-2 text-2xl font-black text-[var(--text)] sm:text-3xl">
              Study plan not found
            </h1>
            <p className="!mx-auto !mt-3 max-w-md text-sm leading-6 text-[var(--text-muted)]">
              This plan may have been removed, or the link may be incorrect.
              Return to your saved plans and choose another one.
            </p>
            <Link
              to="/profile"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--accent-strong)]"
            >
              View saved plans
            </Link>
          </section>
        )}

        {!isLoading && !isNotFound && (
          <>
            <section className="app-panel mt-5 rounded-lg border border-[var(--glass-border)] bg-white/70 p-6 shadow-xl backdrop-blur-xl sm:p-8">
              <p className="eyebrow">Study plan</p>
              <h1 className="mt-3 text-3xl font-black leading-tight text-[var(--text)] sm:text-4xl">
                {plann.title}
              </h1>
              {plann.description && (
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
                  {plann.description}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-[var(--text-muted)]">
                <span className="rounded-full border border-[var(--glass-border)] bg-white/80 px-3 py-1.5">
                  {plann.weeks.length} weeks
                </span>
                {plann.created_at && (
                  <span className="rounded-full border border-[var(--glass-border)] bg-white/80 px-3 py-1.5">
                    Created {new Date(plann.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </section>

            <section className="app-panel mt-6 rounded-lg border border-[var(--glass-border)] bg-white/70 p-6 shadow-xl backdrop-blur-xl sm:p-8">
              <h2 className="text-2xl font-black text-[var(--text)]">
                Weekly breakdown
              </h2>

              <div className="mt-6 space-y-4">
                {plann.weeks.map((week) => (
                  <article
                    key={week.week_number}
                    className="week-card rounded-lg border border-[var(--glass-border)] bg-[var(--surface-soft)]/65 p-5 sm:p-6"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
                      Week {week.week_number}
                    </p>
                    <h3 className="mt-2 text-xl font-black text-[var(--text)]">
                      {week.title}
                    </h3>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-bold text-[var(--text)]">
                          Objectives
                        </h4>
                        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--text-muted)]">
                          {week.objectives.map((objective) => (
                            <li key={objective}>{objective}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-[var(--text)]">
                          Topics
                        </h4>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {week.topics.map((topic) => (
                            <span
                              key={topic}
                              className="topic-tag rounded-full border border-[var(--glass-border)] bg-white/80 px-3 py-1.5 text-xs text-[var(--text-muted)]"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
