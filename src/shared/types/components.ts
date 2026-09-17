import type { ReactNode } from "react";
import type { AuthUser } from "../../modules/auth/auth.types.js";
import type { ChatMessageData } from "../../modules/chat/chat.types.js";
import type { PlanPreviewData } from "../../modules/study-plans/study-plan.types.js";

export interface ChatMessageProps {
  message: ChatMessageData;
  children?: ReactNode;
}

export interface PlanActionBarProps {
  onSave: () => void;
  onTryAgain: () => void;
  disabled?: boolean;
}

export interface PlanPreviewProps {
  plan: PlanPreviewData;
}

export interface ConfirmationModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export interface AppShellProps {
  children: ReactNode;
}

export interface LoginFormProps {
  onLogin: (email: string, password: string, rememberMe: boolean) => void;
  isLoading?: boolean;
  error?: string | null;
}

export interface PasswordVisibilityIconProps {
  visible: boolean;
}

export interface PromptFormProps {
  isSubmitting: boolean;
  onSubmit: (values: { prompt: string }) => Promise<void>;
}

export interface ProtectedRouteProps {
  children: ReactNode;
}

export interface RegisterFormProps {
  onRegister: (name: string, email: string, password: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export interface UserProfileProps {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthProviderProps {
  children: ReactNode;
}
