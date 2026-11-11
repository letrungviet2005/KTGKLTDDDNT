import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
export const createAuth = (app: FirebaseApp) =>
  initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
