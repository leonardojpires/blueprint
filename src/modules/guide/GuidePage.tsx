export function GuidePage() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      <section className="app-panel mx-auto w-full max-w-4xl rounded-lg border border-[var(--glass-border)] bg-white/70 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <p className="eyebrow">Guide</p>
        <h1 className="mt-3 text-3xl font-black text-[var(--text)]">
          How to use AI Study Plan
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--text-muted)]">
          Follow these steps to generate a personalised study roadmap with the
          help of our AI assistant.
        </p>

        <ol className="mt-8 grid gap-4 text-sm text-[var(--text-muted)] sm:grid-cols-2">
          <li className="guide-step rounded-lg border border-[var(--glass-border)] bg-[var(--surface-soft)]/70 p-5">
            <p className="text-base font-bold text-[var(--text)]">
              1. Start a conversation
            </p>
            <p className="mt-2">
              From the chatroom, describe the topic you want to learn in the
              prompt box at the bottom of the chat.
            </p>
          </li>
          <li className="guide-step rounded-lg border border-[var(--glass-border)] bg-[var(--surface-soft)]/70 p-5">
            <p className="text-base font-bold text-[var(--text)]">
              2. Review the recommendation
            </p>
            <p className="mt-2">
              Once the assistant returns a ready plan, expand the preview to see
              the weekly breakdown of objectives and topics.
            </p>
          </li>
          <li className="guide-step rounded-lg border border-[var(--glass-border)] bg-[var(--surface-soft)]/70 p-5">
            <p className="text-base font-bold text-[var(--text)]">
              3. Save or regenerate
            </p>
            <p className="mt-2">
              Save the plan to your library or use Try Again to get a different
              recommendation.
            </p>
          </li>
          <li className="guide-step rounded-lg border border-[var(--glass-border)] bg-[var(--surface-soft)]/70 p-5">
            <p className="text-base font-bold text-[var(--text)]">
              4. Manage your library
            </p>
            <p className="mt-2">
              Open your profile to browse, view, and remove the plans you have
              saved.
            </p>
          </li>
        </ol>
      </section>
    </div>
  );
}
