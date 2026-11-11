import { UserRecord } from "../types/user";
import { DEMO_PASSWORD } from "./validation";

// Reading legacy documents must not invoke validation intended for new writes.
// Project display fields explicitly; never expose stored passwords or metadata.
export function readUserRecord(
  id: string,
  raw: Record<string, unknown>,
): UserRecord {
  return {
    id,
    email: typeof raw.email === "string" ? raw.email : "",
    hoten: typeof raw.hoten === "string" ? raw.hoten : "",
    hinhanh: typeof raw.hinhanh === "string" ? raw.hinhanh : "",
    matkhau: DEMO_PASSWORD,
  };
}
