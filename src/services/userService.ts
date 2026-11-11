import {
  collection,
  doc,
  getDocsFromServer,
  getDocFromServer,
  addDoc,
  deleteDoc,
  runTransaction,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { UserData, UserRecord } from "../types/user";
import { DEMO_PASSWORD, validateUser } from "../utils/validation";
import { requireAdmin } from "./authService";
import { readUserRecord } from "../utils/userRecord";

function usersCollection() {
  requireAdmin();
  if (!db) throw new Error("Firebase chưa được cấu hình.");
  return collection(db, "users");
}
export async function listUsers(): Promise<UserRecord[]> {
  const snapshot = await getDocsFromServer(usersCollection());
  return snapshot.docs
    .map((d) => readUserRecord(d.id, d.data()))
    .sort((a, b) => a.hoten.localeCompare(b.hoten, "vi"));
}
export async function getUser(id: string): Promise<UserRecord> {
  const snapshot = await getDocFromServer(doc(usersCollection(), id));
  if (!snapshot.exists()) throw new Error("Người dùng không còn tồn tại.");
  return readUserRecord(snapshot.id, snapshot.data());
}
export async function saveUser(input: UserData, id?: string) {
  const data = validateUser(input);
  const ref = usersCollection();
  const existing = await getDocsFromServer(ref);
  if (
    existing.docs.some(
      (d) =>
        d.id !== id &&
        String(d.data().email).trim().toLowerCase() === data.email,
    )
  )
    throw new Error("Email đã tồn tại trong danh sách.");
  // This preflight is not an atomic uniqueness constraint; see DATABASE.md.
  if (id) {
    await runTransaction(db!, async (transaction) => {
      const target = doc(ref, id);
      if (!(await transaction.get(target)).exists())
        throw new Error("Người dùng không còn tồn tại.");
      transaction.set(target, data); // Full replacement: exactly four fields, no merge.
    });
    return id;
  }
  return (await addDoc(ref, data)).id;
}
export async function removeUser(id: string) {
  await deleteDoc(doc(usersCollection(), id));
}
export function exportRecords(users: UserRecord[]): UserData[] {
  return users.map(({ email, hoten, hinhanh }) =>
    validateUser({ email, hoten, hinhanh, matkhau: DEMO_PASSWORD }),
  );
}
