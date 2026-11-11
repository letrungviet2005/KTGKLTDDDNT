# BÁO CÁO GIỮA KỲ — USER MANAGEMENT SYSTEM

Môn học: Lập trình đa nền tảng. Sinh viên: **[Điền họ tên]**. MSSV: **[Điền MSSV]**. Lớp: **[Điền lớp]**. Giảng viên: **[Điền tên]**. Ngày lập: 10/11/2026.

## 1. Giới thiệu

User Management System là ứng dụng quản lý hồ sơ người dùng sử dụng React Native và Firebase. Ứng dụng tổ chức dữ liệu tập trung trong Cloud Firestore, cho phép Admin xem danh sách, tìm kiếm, thêm, chỉnh sửa, xem chi tiết, xóa và xuất dữ liệu JSON. Một codebase phục vụ trình duyệt máy tính và Android.

## 2. Mục tiêu

Đáp ứng cấu trúc cơ sở dữ liệu đúng bốn trường theo đề; sử dụng CRUD Firebase thật; giao diện rõ ràng trên màn hình rộng và nhỏ; xác thực Admin bằng Firebase Authentication; xử lý ảnh mà không sử dụng Firebase Storage; có tài liệu cài đặt, kiểm thử và kịch bản trình diễn.

## 3. Công nghệ

React Native 0.88, React 19, Expo SDK 58, Expo Router và TypeScript strict. React Native Web cung cấp khả năng chạy các component React Native trên trình duyệt. Firebase JavaScript SDK 13 phục vụ Authentication và Firestore. Expo Image Picker chọn ảnh, Image Manipulator thu nhỏ/nén và tạo Base64. AsyncStorage hỗ trợ giữ phiên native; Expo File System/Sharing phục vụ xuất JSON Android. Phiên bản chính xác và dependency được ghi trong package-lock.json.

Giao diện sử dụng View, Text, Pressable, TextInput, Image, FlatList và ScrollView; không xây dựng một ứng dụng React DOM riêng. Không có backend Express, Redux, API AI hoặc Firebase Storage.

## 4. Kiến trúc

Presentation gồm route trong `app`, component tái sử dụng và hooks. Service gồm xác thực, CRUD, xử lý ảnh và xuất tệp. Data Layer là Auth/Firestore được khởi tạo tập trung trong `src/config/firebase.ts`. Các module `.native.ts` thay thế phần persistence và xuất tệp trên Android.

Luồng xử lý: người dùng thao tác → màn hình gọi service → kiểm tra quyền và validation → Firebase xử lý → giao diện nhận kết quả, thông báo hoặc cập nhật dữ liệu. Layout `(admin)` bảo vệ toàn bộ route quản trị. Hook tải lại khi màn hình nhận focus; người dùng có thể làm mới thủ công.

**[CHÈN ẢNH THỰC TẾ 01: cấu trúc thư mục dự án trong VS Code.]**

## 5. Cơ sở dữ liệu bốn trường

Collection `users`; mỗi document có bốn string: `email`, `matkhau`, `hoten`, `hinhanh`. Document ID được dùng trong model ứng dụng để định vị hồ sơ nhưng không được ghi thành trường. CREATE dùng payload đã validate; UPDATE dùng transaction kiểm tra tồn tại và thay toàn bộ document bằng payload đúng schema.

Email được trim/lowercase, tối đa 254 ký tự. Họ tên trim, từ 1 đến 100 ký tự. Hình ảnh rỗng hoặc JPEG Data URI tối đa 100 KiB. `matkhau` luôn là `DEMO_NOT_FOR_LOGIN`: dữ liệu minh họa theo đề, không phải mật khẩu thật hoặc hash dùng đăng nhập. Trường này không hiện ở danh sách/chi tiết và không có chức năng đổi mật khẩu giả.

**[CHÈN ẢNH THỰC TẾ 02: document trên Firestore Console với đúng bốn trường.]**

## 6. Firebase Authentication và quyền Admin

Email/Password xác thực Admin hiện có. Client so sánh UID với `EXPO_PUBLIC_ADMIN_UID`; mọi tài khoản đăng nhập thành công không tự động trở thành Admin. Client kiểm soát điều hướng để cải thiện trải nghiệm, còn Firestore Security Rules phải thực thi quyền đọc/ghi và schema ở phía server.

Config tập trung ở `.env`, được loại khỏi Git; không có private key/service account. Không tự tạo Admin mới. Có bản Rules đề xuất trong `docs/firestore.rules.proposed`; chưa đọc hoặc sửa ruleset production, chưa triển khai Rules. GET collection không đăng nhập đã bị từ chối 403, nhưng kết quả này không thay thế kiểm thử toàn bộ Rules.

**[CHÈN ẢNH THỰC TẾ 03: login; 04: Dashboard sau đăng nhập; không để lộ mật khẩu.]**

## 7. CRUD và trải nghiệm sử dụng

Dashboard tính tổng hồ sơ, số có ảnh và chưa có ảnh từ dữ liệu Firestore. Danh sách dùng FlatList, tìm theo tên/email và hỗ trợ bỏ dấu tiếng Việt. Form có validate, preview ảnh và thông báo kết quả. Sửa hồ sơ giữ nguyên ảnh nếu không chọn mới; chi tiết không hiển thị mật khẩu. Xóa yêu cầu xác nhận, có nút Hủy và Xóa.

Kiểm tra email trùng đọc collection trước khi ghi; đây là kiểm tra phía client, không phải ràng buộc duy nhất nguyên tử khi có nhiều thao tác đồng thời. Chỉnh sửa đồng thời cùng hồ sơ áp dụng lần ghi cuối; chưa triển khai UI xử lý xung đột phiên bản. Toàn bộ collection được đọc để thống kê/tìm kiếm, phù hợp phạm vi dữ liệu nhỏ của bài giữa kỳ.

**[CHÈN ẢNH THỰC TẾ 05–08: danh sách, form thêm/sửa, chi tiết và xác nhận xóa.]**

## 8. Xử lý ảnh Base64

Chọn ảnh qua Expo Image Picker; native kiểm tra quyền thư viện. Hủy lựa chọn giữ nguyên dữ liệu. Nếu cạnh dài hơn 256 px, resize theo cạnh dài và giữ tỷ lệ. Chuyển JPEG quality 0.6 và Base64, thêm tiền tố Data URI. Nếu vượt 100 KiB, thử quality 0.4 và 0.2; vẫn quá lớn thì báo lỗi.

Giới hạn áp dụng cho toàn bộ Data URI ASCII, nhỏ hơn nhiều so với giới hạn document Firestore 1 MiB. Ảnh chỉ xử lý khi người dùng chọn mới; không log Base64. Hồ sơ chưa có ảnh dùng avatar chữ viết tắt. Không khởi tạo Storage.

**[CHÈN ẢNH THỰC TẾ 09: preview ảnh và số KiB; 10: ảnh hiển thị lại sau khi tải hồ sơ.]**

## 9. Kết quả thực hiện

Đã viết đầy đủ các màn hình và service yêu cầu, cấu hình Firebase theo thông tin chủ dự án, có validation, route guard, export, xử lý loading/error/empty state và tài liệu. Build web và bundle Android thành công. Chủ dự án đã báo đăng nhập và vào Dashboard.

Chưa xác nhận end-to-end các thao tác CRUD, ảnh và export trên Firebase thật. Công cụ kiểm thử UI bị chặn vì không xác định được URL Chrome đủ tin cậy. Android chưa có thiết bị/emulator kết nối. Do đó chưa thể kết luận toàn bộ Definition of Done đã được kiểm chứng.

## 10. Kiểm thử

TypeScript strict và ESLint đạt; 6 unit test logic đạt; Expo dependency check đạt; web export và Android bundle đạt. Request đọc Firestore không đăng nhập trả 403 Permission Denied. Chi tiết kết quả và checklist còn cần chạy ở TESTING.md.

Chưa kiểm thử trực tiếp đăng nhập sai mật khẩu, non-admin, logout/route guard runtime, CRUD Firebase, ảnh JPG/PNG/ảnh lớn/hủy picker, export thực tế và runtime Android. Không suy diễn build thành công thành chức năng đã chạy đúng. Npm audit còn 10 cảnh báo moderate sau khi xử lý nhóm high bằng grpc override; cần đánh giá dependency trước production.

**[CHÈN ẢNH THỰC TẾ 11: terminal TypeScript/lint/test; 12: kết quả kiểm thử chức năng sau khi thực hiện.]**

## 11. Hướng dẫn chạy

Cài Node.js 24 và npm; chạy `npm ci`. Nếu chưa có `.env`, sao chép `.env.example`, điền Firebase Web config và UID Admin. Chạy `npx expo start --web`; đăng nhập bằng Admin đã có. Khi thay config, khởi động lại Expo với `--clear`. Android: `npm start` rồi Expo Go tương thích SDK hoặc `npm run android` khi có emulator. Xem SETUP.md để xử lý lỗi.

## 12. Hướng dẫn xuất JSON

Đăng nhập Admin → Người dùng → Xuất JSON. Service đọc toàn bộ collection từ server, tạo mảng record đúng bốn trường, không có ID/metadata. Web tải tệp; Android mở share sheet. Dữ liệu mẫu nằm ở `docs/users.sample.json`, chỉ là mẫu cho báo cáo và không tự seed vào database. Không đưa dữ liệu thật lên repository công khai.

**[CHÈN ẢNH THỰC TẾ 13: tệp JSON xuất từ phiên demo.]**

## 13. Hướng dẫn quay video

Chuẩn bị dữ liệu minh họa không nhạy cảm và ảnh được phép sử dụng. Video 3–5 phút: giới thiệu → đăng nhập → Dashboard → danh sách → thêm có ảnh → kiểm tra Console → sửa → tìm kiếm → xóa có xác nhận → xuất JSON → đăng xuất. Nếu có Android thì bổ sung demo; nếu chưa kiểm thử phải ghi rõ. Kịch bản có mốc thời gian trong DEMO_SCRIPT.md.

## 14. Kết luận

Dự án đã có mã nguồn và tài liệu cho ứng dụng quản lý người dùng đa nền tảng, với schema bốn trường, Firebase Auth và các thao tác Firestore thật trong service. Bước tiếp theo để nghiệm thu là thực hiện checklist runtime với phiên Admin, đối chiếu Rules hiện hành, bổ sung screenshot thật và kiểm thử Android. Hướng mở rộng gồm phân trang, thống kê server và cơ chế email duy nhất khi có nhiều tác nhân ghi dữ liệu.
