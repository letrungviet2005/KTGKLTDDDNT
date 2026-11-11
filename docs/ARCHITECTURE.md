# Kiến trúc

Presentation: `app/` chứa route; `src/components/common` chứa primitive UI; `src/components/users` chứa form và xác nhận xóa. Hooks quản lý phiên và trạng thái tải dữ liệu.

Service: `authService` đăng nhập Admin; `userService` thực hiện Firestore CRUD và xuất record; `imageService` chọn/nén ảnh; `exportService` ghi tệp theo nền tảng.

Data: một Firebase app, Auth và Firestore trong `src/config/firebase.ts`. Không Storage. `platformAuth.native.ts` giữ phiên native qua AsyncStorage; web dùng Firebase browser persistence.

Luồng: màn hình → service → kiểm tra UID + validation → Firebase → cập nhật giao diện. `useFocusEffect` đọc lại server khi quay về màn hình; refresh thủ công và pull-to-refresh được hỗ trợ. Request cũ bị bỏ qua khi mất focus để tránh ghi đè dữ liệu mới.

Route `(admin)` chỉ mount khi UID hợp lệ; trạng thái Auth chưa sẵn sàng hiển thị loading. Layout desktop có sidebar; mobile có thanh điều hướng và card. Danh sách dùng FlatList. Form có KeyboardAvoidingView và ScrollView.

Ảnh chỉ xử lý khi chọn mới. Hủy picker giữ ảnh cũ; sửa thông tin không nén lại ảnh; xóa ảnh đặt chuỗi rỗng. Read từ server và transaction update phát hiện hồ sơ bị xóa. Cập nhật dùng full replacement để không lưu trường dư; sửa đồng thời cùng hồ sơ vẫn là last-writer-wins, chưa có version conflict UI.

Giới hạn: truy vấn toàn bộ collection, tìm kiếm client và thống kê client phù hợp dữ liệu nhỏ giữa kỳ. Với lượng lớn cần pagination, aggregation và tối ưu ảnh/backend. Kiểm tra email trùng là preflight, không ràng buộc duy nhất nguyên tử.
