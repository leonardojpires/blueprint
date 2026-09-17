import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./AppRouter";
import { ToastProvider } from "./shared/toast/ToastProvider";
import { AuthProvider } from "./modules/auth/AuthProvider";
import { ThemeProvider } from "./shared/theme/ThemeProvider";

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
