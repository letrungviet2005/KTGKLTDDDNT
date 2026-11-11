import {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, ADMIN_UID } from "../config/firebase";
const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}>({ user: null, loading: true, isAdmin: false });
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!auth);
  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (current) => {
      setUser(current);
      setLoading(false);
    });
  }, []);
  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin: !!user && user.uid === ADMIN_UID }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
