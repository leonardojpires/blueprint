import type { AuthUser, AuthContextValue } from "./auth.types.js";
import type { AuthProviderProps } from "../../shared/types/components.js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  fetchCurrentUser,
  loginUser as apiLoginUser,
  logoutUser as apiLogoutUser,
  registerUser as apiRegisterUser,
  fetchCsrfToken,
} from "../../shared/api/index";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>(
    "loading",
  );

  const refresh = useCallback(async () => {
    try {
      const response = await fetchCurrentUser();
      if (response.success) {
        const token = await fetchCsrfToken();
        if (!token) throw new Error("CSRF token was not returned");
        
        setUser(response.user);
        setStatus("authenticated");
      } else {
        setUser(null);
        setStatus("unauthenticated");
      }
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean) => {
    const result = await apiLoginUser(email, password, rememberMe);
    if (!result.success) {
      throw new Error("Login failed.");
    }
    setUser(result.user);
    setStatus("authenticated");
    await fetchCsrfToken();
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await apiRegisterUser(name, email, password);
      if (!result.success) {
        throw new Error("Registration failed.");
      }
      setStatus("authenticated");
      await fetchCsrfToken();
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await apiLogoutUser();
    } catch {
      // Ignore logout transport errors; we still want to clear local state.
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated",
      login,
      register,
      logout,
      refresh,
    }),
    [user, status, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}
