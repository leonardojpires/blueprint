import { Route, Routes } from "react-router-dom";
import { AppShell } from "./shared/layout/AppShell";
import { ProtectedRoute } from "./modules/auth/ProtectedRoute";
import { ChatPage } from "./modules/chat/ChatPage";
import { GuidePage } from "./modules/guide/GuidePage";
import { LandingPage } from "./modules/home/LandingPage";
import { LoginPage } from "./modules/auth/LoginPage";
import { NotFoundPage } from "./shared/pages/NotFoundPage";
import { PlanDetailsPage } from "./modules/study-plans/PlanDetailsPage";
import { ProfilePage } from "./modules/users/ProfilePage";
import { RegisterPage } from "./modules/auth/RegisterPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/guide"
        element={
          <AppShell>
            <GuidePage />
          </AppShell>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <AppShell>
              <ChatPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppShell>
              <ProfilePage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/plans/:planId"
        element={
          <ProtectedRoute>
            <AppShell>
              <PlanDetailsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
