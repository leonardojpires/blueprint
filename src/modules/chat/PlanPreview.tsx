import type { PlanPreviewProps } from "../../shared/types/components.js";
export function PlanPreview({ plan }: PlanPreviewProps) {
  return (
    <div className="plan-preview mt-4 rounded-lg border border-[var(--glass-border)] bg-[var(--surface-soft)]/75 px-4 py-4">
      <div className="space-y-3 text-sm text-black">
        <div className="rounded-lg border border-[var(--glass-border)] bg-white/75 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
            Plan preview
          </p>
          <p className="mt-2 text-base font-bold text-black">{plan.title}</p>
          {plan.description && (
            <p className="mt-2 text-sm leading-6 text-black">
              {plan.description}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {plan.weeks.map((week) => (
            <div
              key={week.week_number}
              className="preview-week-row rounded-lg border border-[var(--glass-border)] bg-white/80 p-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-bold text-black">
                  Week {week.week_number}
                </p>
                <span className="text-xs font-medium text-black/70">
                  {week.title}
                </span>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
                    Objectives
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-black">
                    {week.objectives.map((objective) => (
                      <li key={objective}>{objective}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
                    Topics
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-black">
                    {week.topics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
