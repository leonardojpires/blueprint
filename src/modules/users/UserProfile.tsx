import type { UserProfileProps } from "../../shared/types/components.js";
import type { SavedPlan } from "../study-plans/study-plan.types.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletePlan, fetchCsrfToken, getPlansByUserId } from "../../shared/api/index";
import { useToast } from "../../shared/toast/ToastProvider";


function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unexpected error occurred.";
}

export function UserProfile({ user, isLoading, error }: UserProfileProps) {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const initials =
    user?.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") 
      || "U";

  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [planToRemove, setPlanToRemove] = useState<SavedPlan | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isTestingCsrf, setIsTestingCsrf] = useState(false);

  useEffect(() => {
    if (isLoading || !user) return;

    let cancelled = false;

    async function loadPlans() {
      setPlansLoading(true);
      setPlansError(null);

      try {
        const response = await getPlansByUserId();
        if (cancelled) return;

        if (response.success) {
          setPlans(response.plans ?? []);
          setActiveIndex(0);
        } else {
          setPlans([]);
          setPlansError("Could not load your saved plans.");
        }
      } catch (err: unknown) {
        if (cancelled) return;
        setPlans([]);
        setPlansError(getErrorMessage(err));
      } finally {
        if (!cancelled) {
          setPlansLoading(false);
        }
      }
    }

    void loadPlans();

    return () => {
      cancelled = true;
    };
  }, [user, isLoading]);

  const total = plans.length;
  const goPrev = () => setActiveIndex((i) => (i - 1 + total) % total);
  const goNext = () => setActiveIndex((i) => (i + 1) % total);

  function openRemoveModal(plan: SavedPlan) {
    setPlanToRemove(plan);
    setRemoveError(null);
  }

  function closeRemoveModal() {
    if (isRemoving) return;
    setPlanToRemove(null);
    setRemoveError(null);
  }

  async function confirmRemovePlan() {
    if (!planToRemove || isRemoving) return;

    setIsRemoving(true);
    setRemoveError(null);

    const targetId = planToRemove.id;
    const previousPlans = plans;

    try {
      await deletePlan(targetId);

      const remainingPlans = plans.filter((p) => p.id !== targetId);
      setPlans(remainingPlans);
      setActiveIndex((current) => {
        if (remainingPlans.length === 0) return 0;
        return Math.min(current, remainingPlans.length - 1);
      });
      setPlanToRemove(null);
      showToast({
        title: "Plan removed",
        message: "Your library has been updated.",
        tone: "success",
      });
    } catch (err: unknown) {
      setPlans(previousPlans);
      const message = getErrorMessage(err);
      setRemoveError(message);
      showToast({
        title: "Could not remove plan",
        message,
        tone: "error",
      });
    } finally {
      setIsRemoving(false);
    }
  }

  async function handleCsrfTest() {
    setCsrfToken(null);
    setIsTestingCsrf(true);

    try {
      const token = await fetchCsrfToken();
      setCsrfToken(token);
      showToast({
        title: "CSRF request succeeded",
        message: "The frontend retrieved a token.",
        tone: "success",
      });
    } catch (err: unknown) {
      showToast({
        title: "CSRF request failed",
        message: getErrorMessage(err),
        tone: "error",
      });
    } finally {
      setIsTestingCsrf(false);
    }
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      <section className="app-panel mx-auto flex w-full max-w-6xl flex-col rounded-lg border border-[var(--glass-border)] bg-white/70 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="inline-flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-3xl font-black text-white shadow-lg">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="eyebrow">Profile</p>
            <h2 className="mt-2 break-words text-3xl font-black text-[var(--text)]">
              {user?.name || "User account"}
            </h2>
          </div>
        </div>

        {isLoading && (
          <p className="mt-6 rounded-lg border border-[var(--glass-border)] bg-[var(--surface-soft)]/70 px-4 py-3 text-sm text-[var(--text-muted)]">
            Loading profile information...
          </p>
        )}

        {error && (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {user && !isLoading && (
          <dl className="profile-details mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Name", user.name],
              ["Email", user.email],
              ["Role", user.is_admin ? "Admin" : "Student"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="profile-detail min-w-0 rounded-lg border border-[var(--glass-border)] px-5 py-4 sm:px-6"
              >
                <dt className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
                  {label}
                </dt>
                <dd className="mt-1 break-words text-base font-semibold text-[var(--text)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      { Boolean(user?.is_admin) && (
      <section className="app-panel mx-auto mt-6 w-full max-w-6xl rounded-lg border border-[var(--glass-border)] bg-white/70 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <p className="eyebrow">Security diagnostic</p>
        <h3 className="mt-2 text-2xl font-black text-[var(--text)]">
          CSRF token retrieval
        </h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Test whether this authenticated browser session can retrieve a token.
        </p>
        <button
          type="button"
          className="mt-5 mb-4 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleCsrfTest}
          disabled={isTestingCsrf}
        >
          {isTestingCsrf ? "Requesting CSRF token..." : "Test CSRF token"}
        </button>
        {csrfToken && (
          <p className="break-all rounded-lg border border-[var(--glass-border)] bg-[var(--surface-soft)]/70 px-4 py-3 text-xs text-[var(--text-muted)]">
            <strong>Retrieved token:</strong> {csrfToken}
          </p>
        )}
      </section>
      )}

      <section className="app-panel mx-auto mt-6 flex w-full max-w-6xl flex-col rounded-lg border border-[var(--glass-border)] bg-white/70 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Library</p>
            <h3 className="mt-2 text-2xl font-black text-[var(--text)]">
              My Saved Plans
            </h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Browse the study plans you have saved.
            </p>
          </div>

          {total > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous plan"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glass-border)] bg-white/80 text-[var(--text-muted)] transition hover:bg-white"
              >
                &lt;
              </button>
              <span className="text-xs font-semibold text-[var(--text-muted)]">
                {activeIndex + 1} / {total}
              </span>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next plan"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glass-border)] bg-white/80 text-[var(--text-muted)] transition hover:bg-white"
              >
                &gt;
              </button>
            </div>
          )}
        </div>

        {plansLoading && (
          <p className="mt-8 rounded-lg border border-[var(--glass-border)] bg-[var(--surface-soft)]/70 px-4 py-3 text-sm text-[var(--text-muted)]">
            Loading your saved plans...
          </p>
        )}

        {plansError && !plansLoading && (
          <p className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {plansError}
          </p>
        )}

        {!plansLoading && !plansError && total === 0 && (
          <div className="mt-8 rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-soft)]/70 px-6 py-10 text-center">
            <p className="text-base font-bold text-[var(--text)]">
              No saved plans yet
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Save a study plan from the chat to see it appear here.
            </p>
          </div>
        )}

        {!plansLoading && !plansError && total > 0 && (
          <>
            <div className="mt-6 overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {plans.map((plan) => (
                  <article key={plan.id} className="w-full shrink-0 px-1">
                    <div className="saved-plan-card flex flex-col gap-5 rounded-lg border border-[var(--glass-border)] p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
                      <div className="min-w-0 max-w-3xl">
                        <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
                          Study plan
                        </p>
                        <h4 className="mt-2 break-words text-xl font-semibold text-[var(--text)] sm:text-2xl">
                          {plan.title}
                        </h4>
                        {plan.description && (
                          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)] sm:text-base">
                            {plan.description}
                          </p>
                        )}
                        <span className="plan-duration mt-4 inline-flex text-xs font-semibold text-[var(--text-muted)]">
                          {plan.weeks?.length ?? 0} weeks
                        </span>
                      </div>

                      <div className="saved-plan-actions flex shrink-0 flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/plans/${plan.id}`)}
                          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
                        >
                          View details
                        </button>
                        <button
                          type="button"
                          onClick={() => openRemoveModal(plan)}
                          aria-label={`Remove plan ${plan.title}`}
                          className="remove-plan-button rounded-lg border px-4 py-2 text-sm font-semibold transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {total > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                {plans.map((plan, index) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Go to plan ${index + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-8 bg-[var(--accent)]"
                        : "w-2 bg-[var(--border)] hover:bg-[var(--text-muted)]"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {planToRemove && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="remove-plan-title"
        >
          <button
            type="button"
            aria-label="Close remove plan dialog"
            onClick={closeRemoveModal}
            disabled={isRemoving}
            className="dialog-backdrop absolute inset-0 bg-[#102316]/55 backdrop-blur-sm disabled:cursor-not-allowed"
          />
          <div className="remove-plan-modal relative z-10 w-full max-w-md rounded-lg border border-[var(--glass-border)] bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                !
              </div>
              <div className="min-w-0 flex-1">
                <h4
                  id="remove-plan-title"
                  className="text-lg font-bold text-[var(--text)]"
                >
                  Remove saved plan?
                </h4>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  You are about to remove{" "}
                  <span className="font-bold text-[var(--text)]">
                    "{planToRemove.title}"
                  </span>{" "}
                  from your library. This action cannot be undone.
                </p>
              </div>
            </div>

            {removeError && (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {removeError}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeRemoveModal}
                disabled={isRemoving}
                className="rounded-lg border border-[var(--glass-border)] bg-white px-4 py-2 text-sm font-bold text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemovePlan}
                disabled={isRemoving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRemoving && (
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {isRemoving ? "Removing..." : "Remove plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
