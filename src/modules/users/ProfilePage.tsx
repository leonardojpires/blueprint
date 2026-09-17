import { useEffect, useState } from "react";
import { UserProfile } from "./UserProfile";
import { fetchCurrentUser } from "../../shared/api/index";
import { useAuth } from "../auth/AuthProvider";

export function ProfilePage() {
  const { user, refresh } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchCurrentUser();
        if (cancelled) return;
        if (response.success) {
          // Sync the auth context so the sidebar reflects the latest user data.
          await refresh();
        } else {
          setError("Could not load your profile information.");
        }
      } catch (err: unknown) {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err.message
            : "Could not load your profile information.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  return (
    <UserProfile user={user} isLoading={isLoading} error={error} />
  );
}