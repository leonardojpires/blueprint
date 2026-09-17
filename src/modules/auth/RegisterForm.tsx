import type { RegisterFormProps } from "../../shared/types/components.js";
import React, { useState } from "react";
import { PasswordVisibilityIcon } from "./PasswordVisibilityIcon";

export function RegisterForm({
  onRegister,
  isLoading,
  error,
}: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    setLocalError(null);
    onRegister(name.trim(), email.trim(), password);
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Create an Account</h2>
      <p>Create your account to start using the platform.</p>
      {localError ? (
        <div className="error">{localError}</div>
      ) : (
        error && <div className="error">{error}</div>
      )}

      <label>
        Full Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          required
        />
      </label>

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
            placeholder="At least 8 characters"
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

      <label>
        Confirm Password
        <span className="password-input-wrap">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            required
          />
          <button
            className="password-visibility-button"
            type="button"
            onClick={() => setShowConfirmPassword((visible) => !visible)}
            aria-label={
              showConfirmPassword ? "Hide password" : "Show password"
            }
            aria-pressed={showConfirmPassword}
          >
            <PasswordVisibilityIcon visible={showConfirmPassword} />
          </button>
        </span>
      </label>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}
