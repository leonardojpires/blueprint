import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrandMark } from "../../shared/components/BrandMark";
import { ConfirmationModal } from "../../shared/components/ConfirmationModal";
import { ThemeToggle } from "../../shared/theme/ThemeToggle";
import { useToast } from "../../shared/toast/ToastProvider";
import { useAuth } from "../auth/AuthProvider";

const features = [
  {
    title: "Weekly structure",
    text: "Break a broad subject into manageable weeks, topics, and objectives.",
  },
  {
    title: "Plan together",
    text: "Answer a few focused questions and adjust the roadmap as you go.",
  },
  {
    title: "Keep your progress",
    text: "Save useful plans and pick up exactly where you left off.",
  },
];

const previewWeeks = [
  {
    week_number: 1,
    title: "React Foundations",
    objectives: ["Understand components", "Practice state and props"],
    topics: ["JSX", "Hooks", "Component structure"],
  },
  {
    week_number: 2,
    title: "Portfolio Project",
    objectives: ["Build reusable sections", "Connect data to UI"],
    topics: ["Forms", "Routing", "Project layout"],
  },
  {
    week_number: 3,
    title: "Review and Polish",
    objectives: ["Refactor weak spots", "Prepare next steps"],
    topics: ["Accessibility", "Deployment", "Code review"],
  },
];

export function LandingPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const primaryHref = isAuthenticated ? "/chat" : "/register";

  async function handleLogout() {
    setProfileMenuOpen(false);
    setIsLoggingOut(true);
    try {
      await logout();
      showToast({
        title: "Logged out",
        message: "Your session has been closed.",
        tone: "success",
      });
      setIsLogoutModalOpen(false);
      navigate("/", { replace: true });
    } catch (err) {
      showToast({
        title: "Could not log out",
        message: err instanceof Error ? err.message : "Please try again.",
        tone: "error",
      });
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <main className="landing-page h-[100svh] overflow-hidden text-[var(--text)]">
      <header className="landing-nav mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="brand-lockup" aria-label="Blueprint home">
          <BrandMark />
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            to="/guide"
            className="nav-link hidden px-3 py-2 text-sm font-semibold text-[var(--text-muted)] sm:inline-flex"
          >
            Guide
          </Link>
          <ThemeToggle />
          <Link
            to={isAuthenticated ? "/chat" : "/login"}
            className={`landing-session-link ${isAuthenticated ? "landing-session-link-auth" : ""} rounded-lg border border-[var(--glass-border)] bg-white/55 px-4 py-2 text-sm font-semibold text-[var(--accent-strong)] shadow-sm backdrop-blur-xl transition hover:bg-white/80`}
          >
            {isAuthenticated ? "Open chat" : "Log in"}
          </Link>
          {isAuthenticated && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-white/60 px-2 py-2 text-left shadow-sm backdrop-blur-xl transition hover:bg-white/85 sm:px-3"
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-black text-white">
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </span>
                <span className="hidden max-w-32 truncate text-sm font-bold text-[var(--text)] sm:inline">
                  {user?.name ?? "Profile"}
                </span>
                <span className="text-xs font-bold text-[var(--text-muted)]">v</span>
              </button>

              {profileMenuOpen && (
                <div
                  className="dropdown-menu absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-lg border border-[var(--glass-border)] bg-white/95 shadow-2xl backdrop-blur-2xl"
                  role="menu"
                >
                  <button
                    type="button"
                    className="w-full px-4 py-3 text-left text-sm font-bold text-[var(--text)] hover:bg-[var(--surface-soft)]"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      navigate("/profile");
                    }}
                    role="menuitem"
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    role="menuitem"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>

      <section className="landing-hero mx-auto grid h-[calc(100svh-5rem)] w-full max-w-7xl items-center gap-8 px-4 pb-5 sm:px-6 lg:grid-cols-[0.95fr_0.86fr] lg:px-8">
        <div className="hero-copy max-w-3xl">
          <p className="eyebrow">A better way to plan your learning</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.98] tracking-normal text-[var(--text)] sm:text-5xl lg:text-6xl">
            A clear study plan for whatever you want to learn
          </h1>
          <p className="!mt-4 max-w-2xl text-base leading-7 text-[var(--text-muted)] sm:text-lg">
            Tell Blueprint what you want to learn and get a practical weekly
            roadmap you can refine, save, and return to when it is time to study.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to={primaryHref} className="btn-primary">
              {isAuthenticated ? "Go to chatroom" : "Start planning"}
            </Link>
            <Link to={isAuthenticated ? "/profile" : "/login"} className="btn-secondary">
              {isAuthenticated ? "Account" : "I already have an account"}
            </Link>
          </div>

          <div className="landing-feature-grid mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="glass-tile">
                <h2>{feature.title}</h2>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="hero-preview" aria-label="Study plan interface preview">
          <div className="preview-toolbar">
            <p>Blueprint workspace</p>
            <span>Draft plan</span>
          </div>
          <div className="preview-plan">
            <div>
              <p className="preview-label">Plan preview</p>
              <h2>React Portfolio Sprint</h2>
              <p className="preview-description">
                A focused roadmap for learning React fundamentals while building
                a portfolio-ready project.
              </p>
            </div>
            <div className="preview-week-list">
              {previewWeeks.map((week) => (
                <div key={week.week_number} className="preview-week-card">
                  <div className="preview-week-head">
                    <span>Week {week.week_number}</span>
                    <p>{week.title}</p>
                  </div>
                  <div className="preview-week-columns">
                    <div>
                      <p className="preview-column-label">Objectives</p>
                      <ul>
                        {week.objectives.map((objective) => (
                          <li key={objective}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="preview-column-label">Topics</p>
                      <div className="preview-topic-list">
                        {week.topics.map((topic) => (
                          <span key={topic}>{topic}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {isLogoutModalOpen && (
        <ConfirmationModal
          title="Log out?"
          description="You can come back anytime. Your saved plans will stay in your library."
          confirmLabel="Log out"
          tone="danger"
          isLoading={isLoggingOut}
          onCancel={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogout}
        />
      )}
    </main>
  );
}
