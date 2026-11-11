import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { UserRecord } from "../types/user";
import { getUser } from "../services/userService";
import { errorMessage } from "../utils/errors";
export function useUser(id: string | undefined) {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useFocusEffect(
    useCallback(() => {
      void attempt; // Changing the retry generation intentionally reloads the same ID.
      let active = true;
      setLoading(true);
      setError("");
      setUser(null);
      if (!id || id.includes("/")) {
        setError("Mã hồ sơ không hợp lệ.");
        setLoading(false);
        return;
      }
      getUser(id)
        .then((data) => {
          if (active) setUser(data);
        })
        .catch((e) => {
          if (active) setError(errorMessage(e));
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [id, attempt]),
  );
  return { user, loading, error, retry: () => setAttempt((a) => a + 1) };
}
