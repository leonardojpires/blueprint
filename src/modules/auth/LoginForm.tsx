import type { LoginFormProps } from "../../shared/types/components.js";
import React, { useState } from "react";
import { PasswordVisibilityIcon } from "./PasswordVisibilityIcon";

export function LoginForm({ onLogin, isLoading, error }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onLogin(email.trim(), password, rememberMe);
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login to Your Account</h2>
      <p>Enter your account credentials to continue.</p>
      {error && <div className="error">{error}</div>}

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </label>

      <label>
        Password
        <span className="password-input-wrap">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
          />
          <button
            className="password-visibility-button"
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            <PasswordVisibilityIcon visible={showPassword} />
          </button>
        </span>
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        Remember me
      </label>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Validating..." : "Login"}
      </button>
    </form>
  );
}
