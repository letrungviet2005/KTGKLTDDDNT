export function errorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;
  const messages: Record<string, string> = {
    "auth/invalid-credential": "Email hoặc mật khẩu không đúng.",
    "auth/wrong-password": "Email hoặc mật khẩu không đúng.",
    "auth/user-not-found": "Email hoặc mật khẩu không đúng.",
    "auth/invalid-email": "Email không hợp lệ.",
    "auth/user-disabled": "Tài khoản đã bị vô hiệu hóa.",
    "auth/too-many-requests": "Quá nhiều lần thử. Vui lòng thử lại sau.",
    "auth/network-request-failed": "Không thể kết nối. Vui lòng kiểm tra mạng.",
    "permission-denied":
      "Không có quyền truy cập. Kiểm tra Admin UID và Firestore Rules.",
    unavailable: "Firestore chưa kết nối được. Kiểm tra mạng và thử lại.",
    "not-found": "Người dùng không còn tồn tại.",
    "auth/invalid-api-key": "Firebase API key không hợp lệ. Kiểm tra .env.",
    "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
      "Firebase từ chối API key. Sao chép apiKey từ Firebase Console → Project settings → Your apps → Web App vào EXPO_PUBLIC_FIREBASE_API_KEY trong .env, rồi khởi động lại Expo với --clear.",
  };
  return (
    (code && messages[code]) ||
    (error instanceof Error
      ? error.message
      : "Đã xảy ra lỗi. Vui lòng thử lại.")
  );
}
