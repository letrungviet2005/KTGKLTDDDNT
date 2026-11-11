import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { createAuth } from "./platformAuth";

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
export const ADMIN_UID = process.env.EXPO_PUBLIC_ADMIN_UID?.trim() ?? "";
export const configurationError =
  Object.values(config).some((v) => !v) || !ADMIN_UID
    ? "Thiếu cấu hình Firebase hoặc Admin UID. Điền .env theo .env.example và khởi động lại Expo."
    : "";
let auth: Auth | null = null;
let db: Firestore | null = null;
if (!configurationError) {
  const existing = getApps().length > 0;
  const app = existing ? getApp() : initializeApp(config);
  auth = existing ? getAuth(app) : createAuth(app);
  db = getFirestore(app);
}
export { auth, db };
