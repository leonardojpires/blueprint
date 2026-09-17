import type { ConfirmationModalProps } from "../types/components.js";
import { createPortal } from "react-dom";

export function ConfirmationModal({
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "default",
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
    >
      <button
        type="button"
        aria-label="Close dialog"
        disabled={isLoading}
        onClick={onCancel}
        className="modal-backdrop absolute inset-0 bg-[#102316]/55 backdrop-blur-sm disabled:cursor-not-allowed"
      />

      <div className="modal-card relative z-10 w-full max-w-md rounded-lg border border-[var(--glass-border)] bg-white/88 p-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-start gap-4">
          <div
            className={`modal-icon ${
              tone === "danger" ? "modal-icon-danger" : "modal-icon-default"
            }`}
            aria-hidden="true"
          >
            {tone === "danger" ? "!" : "OK"}
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="confirmation-title"
              className="text-xl font-black text-[var(--text)]"
            >
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="rounded-lg border border-[var(--glass-border)] bg-white/80 px-4 py-2 text-sm font-bold text-[var(--text-muted)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              tone === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[var(--accent)] hover:bg-[var(--accent-strong)]"
            }`}
          >
            {isLoading && (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {isLoading ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
