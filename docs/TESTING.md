# Kiểm thử

Ngày ghi nhận: 10/11/2026. Kết quả dưới đây phân biệt rõ kiểm tra tự động, thông tin người dùng báo lại và các bước chưa chạy. Không dùng dữ liệu giả để thay thế Firebase thật.

## Kết quả đã chạy

**Cập nhật responsive 11/11/2026:** Trang Người dùng chuyển bảng/card theo chiều rộng vùng nội dung thực tế; bỏ flex dọc gây co phần thông tin card native. Mobile xếp thanh công cụ và tìm kiếm thành các hàng riêng; nút thao tác chia đều hoặc xếp dọc với màn hình <360 px/chữ phóng lớn. Header giới hạn tên/email dài. TypeScript và ESLint đạt; cần xác minh trực quan trên điện thoại ở 320/360/390 px, xoay ngang, bàn phím mở và cỡ chữ lớn. Chưa có kết quả quan sát trực tiếp thiết bị cho thay đổi này.

**Cập nhật 11/11/2026 — lỗi email làm trống Tổng quan:** Tách đọc hồ sơ cũ khỏi validation khi ghi. Email không hợp lệ trong một document không còn làm thất bại toàn bộ danh sách; create/update/export vẫn kiểm tra dữ liệu. Bổ sung test hồi quy cho hồ sơ cũ, kiểu dữ liệu sai, loại bỏ mật khẩu/metadata và phân biệt lỗi email/mật khẩu đăng nhập. Tổng số test hiện tại: 11 đạt. Chưa trực tiếp xác minh lại dữ liệu trong phiên Firebase của người dùng.

**Cập nhật lỗi cấu hình:** API key ban đầu trả HTTP 400, `API_KEY_INVALID`. Chủ dự án đã cung cấp lại Web App config và key đúng (sửa ký tự nhầm E thành F); `.env` đã được cập nhật. Kiểm tra trực tiếp Authentication bằng thông tin đăng nhập thử không hợp lệ hiện trả `INVALID_LOGIN_CREDENTIALS`, không còn `API_KEY_INVALID`. Kết quả xác nhận key đã được chấp nhận ở endpoint đăng nhập, chưa chứng minh đăng nhập Admin hoặc CRUD thành công. Cần khởi động lại Expo với `--clear` để trình duyệt nạp cấu hình mới.

- **Đạt** `npm run typecheck`: TypeScript strict không báo lỗi.
- **Đạt** `npm run lint`: ESLint không báo lỗi/cảnh báo sau khi sửa hooks.
- **Đạt** `npm test`: 6 test logic; chuẩn hóa email/tên, schema bốn string, dữ liệu thiếu/thừa/sai kiểu, email/tên không hợp lệ, không nhận mật khẩu thật/hash, Data URI và giới hạn ảnh, tìm kiếm không dấu.
- **Đạt** `npx expo install --check`: dependencies tương thích Expo SDK đang dùng.
- **Đạt** `npm run build:web`: Metro xuất web SPA vào `dist`.
- **Đạt** `npx expo export --platform android --output-dir dist-android`: tạo Android JavaScript/Hermes bundle. Đây không phải APK hoặc kiểm thử runtime Android.
- **Đạt với phạm vi hẹp**: GET REST collection `users` không có token trả HTTP 403, `PERMISSION_DENIED`. Chỉ chứng minh request đọc không đăng nhập này bị từ chối; chưa chứng minh toàn bộ Rules hoặc các thao tác ghi/non-admin.
- **Người dùng xác nhận** đã đăng nhập Admin và vào Dashboard. Agent chưa trực tiếp quan sát phiên đó.
- **Chưa kiểm thử runtime bằng tự động hóa**: Computer Use dừng vì không xác định được URL Chrome đủ tin cậy. Không vượt qua chặn này bằng cách khác.
- `adb devices` không có thiết bị kết nối. Chưa kiểm thử Android thật/emulator.

## Kiểm tra dependency

Đã nâng dependency gián tiếp `@grpc/grpc-js` bằng override `^1.13.6` để xử lý nhóm cảnh báo high phát hiện trong npm audit. Sau thay đổi, npm audit còn 10 cảnh báo moderate trong cây dependencies (bao gồm công cụ phát triển). Không chạy `npm audit fix --force` vì đề xuất có thể hạ phiên bản Expo/Firebase và phá tương thích. Cần đánh giá lại dependency trước khi đưa lên production; bài demo chưa được chứng nhận an toàn production.

## Checklist kiểm thử thật còn cần chạy

Chuẩn bị tài khoản Admin hiện có, một tài khoản non-admin do chủ dự án chuẩn bị nếu có, ảnh JPG/PNG và Internet. Không tạo Admin mới. Chỉ dùng hồ sơ thử nghiệm và không xóa dữ liệu thật.

### Authentication

- [ ] Email/mật khẩu đúng → Dashboard, dữ liệu Firestore tải thành công.
- [ ] Email đúng/mật khẩu sai → thông báo phù hợp; không vào khu vực Admin.
- [ ] Đăng xuất → login; truy cập trực tiếp `/users`, `/users/create`, `/users/ID`, `/users/edit/ID` đều bị chặn.
- [ ] Reload trang/đóng mở ứng dụng → giữ phiên theo nền tảng.
- [ ] Non-admin đăng nhập → từ chối quyền và đăng xuất; Rules từ chối cả request trực tiếp.

### CRUD và dữ liệu

- [ ] Thêm `kiemthu@example.com`, tên `Hồ sơ kiểm thử` → lưu thành công, xuất hiện trên danh sách và Console.
- [ ] Document có đúng bốn trường string, không có `id`, timestamps hoặc trường khác.
- [ ] Xem chi tiết → tên/email/ảnh đúng, không hiện `matkhau`.
- [ ] Sửa tên/email → dữ liệu Console thay đổi; không sinh trường thứ năm.
- [ ] Email sai, tên rỗng/toàn khoảng trắng → báo lỗi, không ghi.
- [ ] Email đã tồn tại (kể cả khác hoa/thường) → báo trùng. Kiểm tra này không bảo đảm duy nhất khi ghi đồng thời.
- [ ] Truy cập ID không tồn tại → thông báo và nút quay lại/thử lại.
- [ ] Xóa hồ sơ ở phiên khác trước khi lưu form → báo không tồn tại, không tạo lại qua update.
- [ ] Xóa → Hủy: dữ liệu giữ nguyên; Xóa → xác nhận: document biến mất, danh sách và thống kê cập nhật.
- [ ] Tìm họ tên có/không dấu và email → kết quả phù hợp; không có kết quả → empty state.
- [ ] Tắt mạng hoặc quyền Rules bị từ chối → thông báo lỗi; bật lại và Làm mới → tải lại. Không sửa Rules production chỉ để thử nếu chưa được chủ dự án cho phép.

### Ảnh

- [ ] Chọn JPG, PNG và ảnh lớn → xem trước đúng tỷ lệ; kích thước hai cạnh ≤256 px.
- [ ] Hủy picker → giữ ảnh cũ, không crash. Hành vi sự kiện hủy picker web phụ thuộc trình duyệt, cần thử trên trình duyệt demo thực tế.
- [ ] Lưu → Console có `data:image/jpeg;base64,...`; chiều dài Data URI ≤102400.
- [ ] Reload hồ sơ → hiển thị ảnh Base64 đã lưu.
- [ ] Sửa tên không chọn ảnh → chuỗi ảnh không đổi.
- [ ] Thay ảnh → lưu ảnh mới; Xóa ảnh → `hinhanh` là chuỗi rỗng và hiện avatar mặc định.
- [ ] Android từ chối quyền thư viện → thông báo rõ ràng; không crash.

### Export và nền tảng

- [ ] Xuất JSON khi đang tìm kiếm → xuất toàn bộ collection, không chỉ danh sách lọc.
- [ ] Mỗi record chỉ có `email`, `matkhau`, `hoten`, `hinhanh`; không ID/metadata; tất cả là string.
- [ ] Web desktop và cửa sổ hẹp: sidebar/thanh điều hướng, cuộn form, thao tác nút, không tràn ngang.
- [ ] Android: đăng nhập, giữ phiên, CRUD, chọn ảnh, chia sẻ JSON, đăng xuất.

## Minh chứng

Chưa có screenshot minh chứng runtime do agent chụp. Sau khi chạy các bước trên, ghi kết quả thực tế và chèn ảnh vào các vị trí trong REPORT.md. Không đánh dấu các mục chưa chạy là đạt chỉ vì build thành công.
