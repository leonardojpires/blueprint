import type { LocationState } from "../../shared/types/navigation.js";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BrandMark } from "../../shared/components/BrandMark";
import { LoginForm } from "./LoginForm";
import { useToast } from "../../shared/toast/ToastProvider";
import { useAuth } from "./AuthProvider";
import { ThemeToggle } from "../../shared/theme/ThemeToggle";

export function LoginPage() {
  const { login, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If the user is already authenticated, redirect them away from /login.
  useEffect(() => {
    if (status === "authenticated") {
      const from = (location.state as LocationState | null)?.from ?? "/chat";
      navigate(from, { replace: true });
    }
  }, [status, navigate, location.state]);

  async function handleLogin(email: string, password: string, rememberMe: boolean) {
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password, rememberMe);
      const from = (location.state as LocationState | null)?.from ?? "/chat";
      showToast({
        title: "Welcome back",
        message: "Your study workspace is ready.",
        tone: "success",
      });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed.";
      setError(message);
      showToast({
        title: "Login failed",
        message,
        tone: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page min-h-screen px-4 py-8">
      <div className="auth-topbar mx-auto mb-8 flex w-full max-w-5xl items-center justify-between">
        <Link to="/" className="brand-lockup">
          <BrandMark />
        </Link>
        <ThemeToggle />
      </div>

      <section className="auth-panel app-panel mx-auto grid w-full max-w-5xl overflow-hidden rounded-lg border border-[var(--glass-border)] bg-white/60 shadow-2xl backdrop-blur-2xl md:grid-cols-[0.9fr_1fr]">
        <div className="hidden border-r border-[var(--glass-border)] bg-[var(--surface-soft)]/70 p-8 md:flex md:flex-col md:justify-between">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-[var(--text)]">
              Continue the plan you were building.
            </h1>
            <p className="mt-4 leading-7 text-[var(--text-muted)]">
              Your saved roadmaps, chat context, and next study steps are ready
              when you are.
            </p>
          </div>
          <div className="auth-aside-note rounded-lg border border-[var(--glass-border)] bg-white/65 p-4 text-sm text-[var(--text-muted)]">
            One good plan beats ten scattered tabs.
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <LoginForm onLogin={handleLogin} isLoading={isLoading} error={error} />
          <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-[var(--accent)] hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
