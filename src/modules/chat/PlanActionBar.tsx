import type { PlanActionBarProps } from "../../shared/types/components.js";
export function PlanActionBar({ onSave, onTryAgain, disabled }: PlanActionBarProps) {
  return (
    <div className="plan-action-bar mb-4 flex flex-col gap-3 rounded-lg border border-[var(--glass-border)] bg-[var(--success-bg)]/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-[var(--success)]">
        Plan recommendation is ready. Save it or try again.
      </span>
      <div className="plan-action-buttons flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={disabled}
          onClick={onSave}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save plan
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onTryAgain}
          className="rounded-lg border border-[var(--glass-border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
