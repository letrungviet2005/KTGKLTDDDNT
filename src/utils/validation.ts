import { UserData } from "../types/user";
export const DEMO_PASSWORD = "DEMO_NOT_FOR_LOGIN";
export const MAX_IMAGE_BYTES = 100 * 1024;
export function validateLoginInput(email: string, password: string) {
  const normalizedEmail = email.trim();
  if (!normalizedEmail) throw new Error("Vui lòng nhập email Admin.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error(
      "Email chưa đúng định dạng. Nhập email Admin, ví dụ admin@example.com, không nhập UID.",
    );
  }
  if (!password) throw new Error("Vui lòng nhập mật khẩu Admin.");
  return { email: normalizedEmail, password };
}
export function validateUser(input: unknown): UserData {
  if (!input || typeof input !== "object")
    throw new Error("Dữ liệu không hợp lệ.");
  const data = input as Record<string, unknown>;
  const keys = ["email", "matkhau", "hoten", "hinhanh"];
  if (
    Object.keys(data).length !== 4 ||
    keys.some((k) => typeof data[k] !== "string")
  ) {
    throw new Error("Hồ sơ phải có đúng bốn trường dạng chuỗi.");
  }
  const { email, matkhau, hoten, hinhanh } = data as unknown as UserData;
  const normalizedEmail = email.trim().toLowerCase();
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
    normalizedEmail.length > 254
  )
    throw new Error("Email không hợp lệ (tối đa 254 ký tự).");
  if (!hoten.trim() || hoten.trim().length > 100)
    throw new Error("Họ tên phải có từ 1 đến 100 ký tự.");
  if (matkhau !== DEMO_PASSWORD)
    throw new Error("Chỉ chấp nhận giá trị mật khẩu minh họa.");
  if (
    hinhanh &&
    (!/^data:image\/jpeg;base64,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
      hinhanh,
    ) ||
      hinhanh.length <= 23)
  )
    throw new Error("Ảnh phải là Data URI JPEG Base64 hợp lệ.");
  // Data URI uses ASCII, so string length equals UTF-8 byte count.
  if (hinhanh.length > MAX_IMAGE_BYTES)
    throw new Error("Ảnh vượt giới hạn 100 KiB.");
  return { email: normalizedEmail, matkhau, hoten: hoten.trim(), hinhanh };
}
export function searchUsers<T extends { hoten: string; email: string }>(
  users: T[],
  query: string,
): T[] {
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  const needle = normalize(query.trim());
  return users.filter((u) =>
    normalize(`${u.hoten} ${u.email}`).includes(needle),
  );
}
