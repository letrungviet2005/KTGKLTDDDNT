import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ADMIN_UID, auth, configurationError } from "../config/firebase";
import { validateLoginInput } from "../utils/validation";
export async function login(email: string, password: string) {
  if (!auth) throw new Error(configurationError);
  const input = validateLoginInput(email, password);
  const result = await signInWithEmailAndPassword(
    auth,
    input.email,
    input.password,
  );
  if (result.user.uid !== ADMIN_UID) {
    await signOut(auth);
    throw new Error("Tài khoản này không được cấp quyền Admin.");
  }
}
export async function logout() {
  if (auth) await signOut(auth);
}
export function requireAdmin() {
  if (!auth?.currentUser || auth.currentUser.uid !== ADMIN_UID)
    throw new Error("Bạn cần đăng nhập bằng tài khoản Admin.");
}
