import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { PlanActionBar } from "./PlanActionBar";
import { PlanPreview } from "./PlanPreview";
import { ConfirmationModal } from "../../shared/components/ConfirmationModal";
import { PromptForm } from "./PromptForm";
import { useToast } from "../../shared/toast/ToastProvider";
import { useChat } from "./useChat";

export function ChatPage() {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const { showToast } = useToast();
  const {
    messages,
    planPreview,
    isGenerating,
    isPlanSaved,
    messagesEndRef,
    submitPrompt,
    saveCurrentPlan,
    regenerateLastPlan,
  } = useChat();

  const hasReadyPreview = Boolean(planPreview) && !isPlanSaved;

  async function handleSubmit({ prompt }: { prompt: string }) {
    await submitPrompt(prompt);
  }

  function handleSaveRequest() {
    setIsSaveModalOpen(true);
  }

  async function handleSaveConfirm() {
    setIsSavingPlan(true);
    try {
      await saveCurrentPlan();
      setIsSaveModalOpen(false);
      showToast({
        title: "Plan saved",
        message: "You can find it in your profile library.",
        tone: "success",
      });
    } catch (err) {
      // console.error("Failed to save plan:", err);
      showToast({
        title: "Could not save plan",
        message: err instanceof Error ? err.message : "Please try again.",
        tone: "error",
      });
    } finally {
      setIsSavingPlan(false);
    }
  }

  async function handleRegenerateConfirm() {
    setIsRegenerateModalOpen(false);
    try {
      await regenerateLastPlan();
      showToast({
        title: "Generating another version",
        message: "The assistant is preparing a fresh recommendation.",
        tone: "info",
      });
    } catch (err) {
      showToast({
        title: "Could not regenerate",
        message: err instanceof Error ? err.message : "Please try again.",
        tone: "error",
      });
    }
  }

  return (
    <section className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-[var(--chat-surface)]">
        <div className="workspace-header border-b border-[var(--glass-border)] bg-white/70 px-5 py-4 backdrop-blur-xl sm:px-7">
          <div className="workspace-header-inner flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
                Workspace
              </p>
              <h1 className="mt-1 text-2xl font-black text-[var(--text)]">
                Blueprint Chatroom
              </h1>
            </div>
            <div className="status-chip inline-flex w-fit items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-white/65 px-3 py-2 text-xs font-semibold text-[var(--text-muted)]">
              <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
              Ready to plan
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="chat-scroll h-full min-h-0 overflow-y-auto px-4 py-6 pb-28 sm:px-7">
            <div className="chat-message-list mx-auto flex w-full flex-col gap-4">
              {messages.map((message, index) => {
                const isLastAssistantReady =
                  message.role === "assistant" &&
                  message.status === "ready" &&
                  planPreview &&
                  index === messages.length - 1;

                return (
                  <ChatMessage key={index} message={message}>
                    {isLastAssistantReady && planPreview && (
                      <PlanPreview plan={planPreview} />
                    )}
                  </ChatMessage>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        <div className="chat-composer-bar z-20 border-t border-[var(--glass-border)] bg-white/80 px-4 py-4 shadow-[0_-18px_45px_rgba(16,35,22,0.08)] backdrop-blur-xl sm:px-7">
          <div className="mx-auto w-full max-w-5xl">
            {hasReadyPreview && (
              <PlanActionBar
                onSave={handleSaveRequest}
                onTryAgain={() => setIsRegenerateModalOpen(true)}
                disabled={isGenerating}
              />
            )}

            <PromptForm isSubmitting={isGenerating} onSubmit={handleSubmit} />
          </div>
        </div>
      </div>

      {isSaveModalOpen && (
        <ConfirmationModal
          title="Save this study plan?"
          description="This will add the generated roadmap to your saved library so you can revisit it from your profile."
          confirmLabel="Save plan"
          isLoading={isSavingPlan}
          onCancel={() => setIsSaveModalOpen(false)}
          onConfirm={handleSaveConfirm}
        />
      )}

      {isRegenerateModalOpen && (
        <ConfirmationModal
          title="Try another version?"
          description="This keeps the same prompt but asks the assistant for a fresh study plan recommendation."
          confirmLabel="Try again"
          isLoading={isGenerating}
          onCancel={() => setIsRegenerateModalOpen(false)}
          onConfirm={handleRegenerateConfirm}
        />
      )}
    </section>
  );
}
