import "firebase/auth";
import type { Persistence } from "firebase/auth";
import type AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase 13 publishes this function in its React Native runtime but omits it
// from the root public declarations. Keep the official signature until fixed.
declare module "firebase/auth" {
  export function getReactNativePersistence(
    storage: Pick<typeof AsyncStorage, "getItem" | "setItem" | "removeItem">,
  ): Persistence;
}
