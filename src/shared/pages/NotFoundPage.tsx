import { Link } from "react-router-dom";
import { ThemeToggle } from "../theme/ThemeToggle";

export function NotFoundPage() {
  return (
    <main className="auth-page flex min-h-screen items-center justify-center px-4 py-8">
      <ThemeToggle className="absolute right-4 top-4" />
      <div className="app-panel w-full max-w-md rounded-lg border border-[var(--glass-border)] bg-white/70 p-8 text-center shadow-2xl backdrop-blur-2xl">
        <p className="eyebrow">404</p>
        <h1 className="mt-2 text-2xl font-black text-[var(--text)]">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
        The page you were looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn-primary mt-6">
          Back to home
        </Link>
      </div>
    </main>
  );
}
