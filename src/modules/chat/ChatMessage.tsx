import type { ChatMessage } from "./chat.types.js";
import type { ChatMessageProps } from "../../shared/types/components.js";

export function ChatMessage({ message, children }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      data-role={message.role}
      className={`chat-message max-w-3xl ${
        isAssistant
          ? "self-start rounded-[1.25rem] rounded-bl-sm border border-[var(--glass-border)] bg-white/82 px-5 py-4 text-black shadow-sm backdrop-blur-xl"
          : "self-end rounded-[1.25rem] rounded-br-sm bg-[var(--accent)] px-5 py-4 text-black shadow-[0_12px_30px_rgba(31,85,56,0.22)]"
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            isAssistant ? "bg-[var(--success)]" : "bg-black/70"
          }`}
        />
        <span
          className={`text-[0.68rem] font-bold uppercase tracking-[0.14em] ${
            isAssistant ? "text-black/60" : "text-white"
          }`}
        >
          {isAssistant ? message.status.replace("-", " ") : "You"}
        </span>
      </div>
      <p className={`whitespace-pre-line text-sm leading-6 ${ isAssistant ? "text-black" : "text-white" }`}>{message.text}</p>
      {children}
    </div>
  );
}
