import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { listUsers } from "../services/userService";
import { UserRecord } from "../types/user";
import { errorMessage } from "../utils/errors";
export function useUsers() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const request = useRef(0);
  const refresh = useCallback(async () => {
    const ticket = ++request.current;
    setLoading(true);
    setError("");
    try {
      const data = await listUsers();
      if (ticket === request.current) setUsers(data);
    } catch (e) {
      if (ticket === request.current) {
        setError(errorMessage(e));
        setUsers([]);
      }
    } finally {
      if (ticket === request.current) setLoading(false);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      void refresh();
      return () => {
        request.current++;
      };
    }, [refresh]),
  );
  return { users, loading, error, refresh };
}
