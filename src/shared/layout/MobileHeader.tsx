import { NavLink, useNavigate } from "react-router-dom";
import { BrandMark } from "../components/BrandMark";
import { useAuth } from "../../modules/auth/AuthProvider";
import { ThemeToggle } from "../theme/ThemeToggle";

export function MobileHeader() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function linkClass(isActive: boolean) {
    return `flex-1 rounded-lg px-3 py-2 text-center text-sm font-semibold transition ${
      isActive
        ? "bg-[var(--accent)] text-white"
        : "bg-white/55 text-[var(--text-muted)] hover:bg-white/85"
    }`;
  }

  return (
    <header className="mobile-header border-b border-[var(--glass-border)] bg-white/70 px-4 py-4 shadow-sm backdrop-blur-2xl md:hidden">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="brand-lockup min-w-0 text-left"
        >
          <BrandMark />
        </button>
        <ThemeToggle />
      </div>

      {isAuthenticated ? (
        <nav className="mobile-nav mx-auto mt-4 flex max-w-3xl gap-2">
          <NavLink to="/chat" end className={({ isActive }) => linkClass(isActive)}>
            Chat
          </NavLink>
          <NavLink to="/guide" className={({ isActive }) => linkClass(isActive)}>
            Guide
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => linkClass(isActive)}>
            Profile
          </NavLink>
        </nav>
      ) : (
        <div className="mobile-nav mx-auto mt-4 flex max-w-3xl gap-2">
          <button
            type="button"
            className="flex-1 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg bg-white/55 px-3 py-2 text-sm font-semibold text-[var(--text-muted)]"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      )}
    </header>
  );
}
