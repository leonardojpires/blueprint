import type { NavItem } from "../types/navigation.js";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BrandMark } from "../components/BrandMark";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { useToast } from "../toast/ToastProvider";
import { useAuth } from "../../modules/auth/AuthProvider";
import { ThemeToggle } from "../theme/ThemeToggle";

const AUTH_NAV: NavItem[] = [
  { to: "/chat", label: "Chatroom" },
  { to: "/guide", label: "Guide" },
];

const GUEST_NAV: NavItem[] = [
  { to: "/login", label: "Login" },
  { to: "/register", label: "Register" },
];

export function Sidebar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = isAuthenticated ? AUTH_NAV : GUEST_NAV;

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
    <aside className="app-sidebar hidden h-screen w-72 shrink-0 border-r border-[var(--glass-border)] bg-white/55 px-5 py-6 shadow-[0_24px_70px_rgba(16,35,22,0.10)] backdrop-blur-2xl md:flex md:flex-col">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="brand-lockup px-2 text-left"
      >
        <BrandMark />
      </button>

      <div className="sidebar-note mt-5 rounded-lg border border-[var(--glass-border)] bg-white/45 p-4">
        <p className="text-sm leading-6 text-[var(--text-muted)]">
          Your calm workspace for turning study goals into practical roadmaps.
        </p>
      </div>

      <nav className="mt-8 flex w-full flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/chat"}
            className={({ isActive }) =>
              `sidebar-nav-link w-full rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                isActive
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:bg-white/70 hover:text-[var(--text)]"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {isAuthenticated && (
        <div className="relative mt-6 w-full">
          <button
            type="button"
            onClick={() => setProfileMenuOpen((open) => !open)}
            className="flex w-full items-center gap-3 rounded-lg border border-[var(--glass-border)] bg-white/55 px-4 py-3 text-left shadow-sm transition hover:bg-white/80"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--text)]">
                {user?.name}
              </p>
              <p className="text-xs text-[var(--text-muted)]">Account actions</p>
            </div>
            <span className="text-[var(--text-muted)]">v</span>
          </button>

          {profileMenuOpen && (
            <div className="dropdown-menu absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-lg border border-[var(--glass-border)] bg-white shadow-xl">
              <button
                type="button"
                className="w-full px-4 py-3 text-left text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--surface-soft)]"
                onClick={() => {
                  setProfileMenuOpen(false);
                  navigate("/profile");
                }}
              >
                Profile
              </button>
              <button
                type="button"
                className="w-full px-4 py-3 text-left text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--surface-soft)]"
                onClick={() => {
                  setProfileMenuOpen(false);
                  setIsLogoutModalOpen(true);
                }}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex-1" />
      <ThemeToggle showLabel className="mb-3 w-full" />
      <footer className="rounded-lg border border-[var(--glass-border)] bg-white/45 p-4 text-xs leading-5 text-[var(--text-muted)]">
        <strong className="block text-[var(--text)]">Blueprint</strong>
        Your study plans, all in one place.
      </footer>

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
    </aside>
  );
}
