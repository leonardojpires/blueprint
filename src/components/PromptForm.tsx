  import { FormEvent, useMemo, useState } from "react";

interface PromptFormProps {
  isSubmitting: boolean;
  onSubmit: (values: { prompt: string }) => Promise<void>;
}


export function PromptForm({ isSubmitting, onSubmit }: PromptFormProps) {
  const [prompt, setPrompt] = useState("");

  const charCount = useMemo(() => prompt.length, [prompt]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ prompt: prompt.trim() }).catch((err) => {
      console.error("PromptForm submit error:", err);
    });
    setPrompt("");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event as unknown as FormEvent<HTMLFormElement>);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="prompt-composer flex items-end gap-3 rounded-lg border border-[var(--glass-border)] bg-white/85 px-4 py-3 shadow-sm backdrop-blur-xl">
        <textarea
          aria-label="Study plan prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to learn..."
          rows={1}
          className="min-h-[48px] max-h-32 w-full flex-1 resize-none bg-transparent text-base leading-6 text-black placeholder:text-black/45 focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="send-button inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </div>
      <div className="prompt-meta mt-2 flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>{charCount} characters</span>
      </div>
    </form>
  );
}
