# User Management System

Ứng dụng quản lý người dùng bằng React Native, Expo Router, TypeScript và Firebase. Giao diện dùng chung cho web/Android; không có dữ liệu mock trong ứng dụng và không dùng Firebase Storage.

## Chạy dự án

Yêu cầu Node.js 22.13+ (đã dùng Node 24), npm và Firebase Email/Password + Firestore.

```sh
npm ci
```

Sao chép `.env.example` thành `.env` nếu chưa có, điền Firebase Web config và UID Admin. Sau đó:

```sh
npm run web
```

Đăng nhập bằng tài khoản Admin đã có trong Firebase Console. Không nhập mật khẩu thật vào hồ sơ người dùng. Cấu hình công khai của Firebase không phải cơ chế phân quyền; Firestore Rules phải kiểm tra UID.

## Lệnh

- `npm start`: Expo dev server và mã QR.
- `npm run android`: mở Android emulator/thiết bị.
- `npm run typecheck`: TypeScript strict.
- `npm run lint`: ESLint.
- `npm test`: kiểm thử logic validation và schema.
- `npm run build:web`: xuất web vào `dist/`.

## Chức năng

Đăng nhập/đăng xuất, giữ phiên, bảo vệ route theo UID; thống kê Firestore; danh sách, tìm kiếm không dấu; thêm/sửa/xóa có xác nhận; ảnh JPEG Base64 ≤100 KiB; xuất JSON đúng bốn trường. Android xuất qua share sheet; web tải tệp JSON.

## Tài liệu

- [Cài đặt](docs/SETUP.md)
- [Firebase và Rules](docs/FIREBASE_SETUP.md)
- [Kiến trúc](docs/ARCHITECTURE.md)
- [Cơ sở dữ liệu](docs/DATABASE.md)
- [Kiểm thử và giới hạn xác minh](docs/TESTING.md)
- [Báo cáo giữa kỳ](docs/REPORT.md)
- [Kịch bản video](docs/DEMO_SCRIPT.md)

Tệp dữ liệu mẫu `docs/users.sample.json` chỉ dùng cho báo cáo, không tự nạp vào Firestore. Không đưa `.env`, dữ liệu xuất thật, mật khẩu hoặc service account lên repository công khai. Không có lệnh tự triển khai Rules.
# KTGKLTDDDNT
