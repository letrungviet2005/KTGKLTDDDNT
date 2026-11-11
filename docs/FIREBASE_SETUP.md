# Firebase

Project: `usermanagement-2c632`. Dùng Web SDK config trong `.env`; không dùng Admin SDK hoặc service account.

## Kiểm tra Console

1. Project settings → General → Your apps → Web App → SDK config. Đối chiếu apiKey, authDomain, projectId, messagingSenderId, appId với `.env`.
2. Authentication → Sign-in method: Email/Password bật. Không tự tạo tài khoản mới; dùng Admin hiện có.
3. Authentication → Users: UID Admin phải trùng `EXPO_PUBLIC_ADMIN_UID`.
4. Firestore Database → Rules: kiểm tra `request.auth.uid` là UID Admin. Mọi tài khoản khác và request không đăng nhập đều bị từ chối đọc/ghi.
5. Kiểm tra create/update có `hasAll` + `hasOnly` bốn trường, kiểu string, placeholder `matkhau`, độ dài email/họ tên/ảnh.

## Rules đề xuất — chưa triển khai

`firestore.rules.proposed` là bản tham khảo, không phải bản Rules đã đọc từ production. Chưa có quyền truy cập Console/ruleset nên không thể khẳng định Rules hiện tại đáp ứng validation. Thay `ADMIN_UID_HERE` bằng UID chính xác, so sánh toàn bộ ruleset hiện tại và kiểm tra ở Rules Playground trước khi publish. Không thêm một match rộng khác cho phép truy cập vì quyền giữa các match được cộng gộp. Chỉ publish sau khi chủ dự án xác nhận.

Checklist Rules Playground: unauthenticated/non-admin không được get/list/create/update/delete; Admin được thao tác đúng schema; từ chối thiếu/thừa trường, số thay string, mật khẩu thật, ảnh >102400 ký tự. Regex kiểm tra cấu trúc Data URI, không xác minh nội dung JPEG giải mã; ứng dụng kiểm tra và tạo JPEG qua Expo.

## Mô hình quyền

Client kiểm tra UID để bảo vệ điều hướng và chặn lời gọi service. Client có thể bị sửa nên đây không phải ranh giới bảo mật. Firestore Rules là ranh giới bảo mật thật. Các hồ sơ `users` không phải tài khoản Firebase Authentication, không có chức năng đổi mật khẩu người dùng.

Web dùng persistence của Firebase Auth; native dùng `getReactNativePersistence(AsyncStorage)`. Đăng xuất xóa phiên Auth. Web config là thông tin công khai; `.env` được loại khỏi Git để quản lý cấu hình tập trung. Không bật Firebase Storage, không deploy Rules hoặc dịch vụ tính phí.

Nguồn chính thức: https://firebase.google.com/docs/firestore/security/rules-fields và https://firebase.google.com/docs/auth/web/auth-state-persistence.
