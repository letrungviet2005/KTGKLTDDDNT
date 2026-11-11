# Cài đặt và vận hành

1. Cài Node.js phù hợp Expo SDK 58 (khuyến nghị Node 24 LTS), npm.
2. Mở terminal ở thư mục dự án; chạy `npm ci`.
3. Sao chép `.env.example` → `.env` nếu chưa có, điền đầy đủ Web config và `EXPO_PUBLIC_ADMIN_UID`.
4. Chạy `npx expo start --web`. Nếu đổi `.env`, dừng server rồi chạy `npx expo start --clear --web`.
5. Đăng nhập tài khoản Admin đã tạo trên Firebase. Không tạo Admin từ ứng dụng.

## Android

Chạy `npm start`, dùng Expo Go tương thích SDK 58 để quét mã QR trên cùng mạng. Hoặc cài Android Studio, SDK và tạo emulator, chạy `npm run android`. Nếu Expo Go trên thiết bị chưa hỗ trợ phiên bản SDK, dùng bản Expo Go tương thích từ nguồn chính thức hoặc development build `npx expo run:android` (cần Java/Android SDK). Không có emulator thì phải ghi rõ chưa kiểm thử Android.

Ảnh dùng API Expo hỗ trợ Android. Cấp quyền thư viện khi ứng dụng hỏi; nếu bị từ chối vĩnh viễn, mở Settings → Apps → ứng dụng → Permissions → Photos. JSON trên Android mở share sheet; chọn nơi lưu do người dùng quản lý.

## Build web

`npm run build:web` tạo SPA ở `dist`. Khi triển khai lên static hosting, cấu hình fallback tất cả route về `index.html` để tải trực tiếp `/users/...`. Không có triển khai hosting tự động trong dự án.

## Xử lý lỗi

- Thiếu cấu hình: điền đủ `.env`, khởi động lại Metro.
- Permission denied: đối chiếu UID trong Authentication, `.env` và Rules đang publish.
- Đăng nhập lỗi: kiểm tra Email/Password provider, mật khẩu và tình trạng disabled.
- Mất mạng: kiểm tra Internet và bấm Làm mới. Ứng dụng yêu cầu đọc từ server, không trình bày cache như dữ liệu mới.
- Hồ sơ cũ: danh sách vẫn hiển thị dù email chưa đúng định dạng; trường hiển thị thiếu/sai kiểu được đọc thành chuỗi rỗng. Mở Sửa để chuẩn hóa hồ sơ trước khi lưu hoặc xuất JSON. Mật khẩu lưu sẵn không được đưa vào model hiển thị; dùng placeholder. Đọc dữ liệu không tự sửa document trên Firebase.

## Dependencies bổ sung

`@expo/vector-icons`: icon; AsyncStorage: lưu phiên Auth native; `expo-file-system` và `expo-sharing`: xuất/chia sẻ JSON Android. Firebase JS SDK không khởi tạo Storage. ESLint dùng cấu hình Expo, `tsx` chạy unit test TypeScript. Chỉ module `exportService.ts` cho web dùng DOM để tải tệp; toàn bộ UI dùng React Native và module `.native.ts` thay thế khi chạy Android.
