import type { AppShellProps } from "../types/components.js";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-workspace h-screen min-h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex min-w-0 flex-col min-h-screen overflow-hidden">
        <MobileHeader />
        <div className="flex-1 min-h-0 flex flex-col">{children}</div>
      </main>
    </div>
  );
}
