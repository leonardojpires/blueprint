export type ToastTone = "success" | "error" | "info";

export interface Toast {
  id: number;
  title: string;
  message?: string;
  tone: ToastTone;
}

export interface ToastInput {
  title: string;
  message?: string;
  tone?: ToastTone;
}

export interface ToastContextValue {
  showToast: (toast: ToastInput) => void;
}
