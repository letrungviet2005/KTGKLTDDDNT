# Kịch bản video 3–5 phút

Chuẩn bị: chạy app, kiểm tra cấu hình và Rules; dùng dữ liệu minh họa không nhạy cảm, ảnh đã được phép dùng; mở Firebase Console tab Data. Không để mật khẩu hoặc thông tin riêng tư xuất hiện trong video.

1. **0:00–0:20** — Giới thiệu User Management System, React Native/Expo, mục tiêu quản lý người dùng trên web và Android.
2. **0:20–0:40** — Đăng nhập Admin. Nêu Auth Email/Password và phân quyền theo UID; không quay mật khẩu.
3. **0:40–1:00** — Dashboard: tổng số hồ sơ, có ảnh/chưa có ảnh từ Firestore thật. Mở danh sách.
4. **1:00–1:45** — Thêm hồ sơ demo với email example.com, họ tên, ảnh JPG/PNG. Giải thích placeholder mật khẩu, nén ảnh JPEG 256 px và giới hạn 100 KiB. Lưu và xem thông báo.
5. **1:45–2:10** — Console Firestore: mở document vừa tạo, chứng minh đúng `email`, `matkhau`, `hoten`, `hinhanh`; ID nằm ngoài data; không Storage.
6. **2:10–2:40** — Chỉnh sửa tên, đổi ảnh, lưu; quay danh sách và tìm theo tên/email (có thể gõ không dấu).
7. **2:40–3:10** — Xóa: thử Hủy trước để chứng minh giữ hồ sơ, sau đó xác nhận Xóa. Quan sát danh sách và Dashboard đổi theo dữ liệu.
8. **3:10–3:35** — Xuất JSON, mở tệp đã tải và kiểm tra mỗi record chỉ bốn trường. Không đưa dữ liệu thật vào video công khai.
9. **3:35–3:55** — Đăng xuất, thử truy cập route `/users` để chứng minh quay về login.
10. **3:55–4:40** — Nếu có thiết bị/emulator: mở Android, đăng nhập, cuộn danh sách, chọn ảnh và xem cùng dữ liệu Firebase. Nếu chưa kiểm thử Android, ghi rõ và không dựng minh chứng.

Chèn video/screenshot thực tế sau khi đã chạy; không dùng ảnh giả làm kết quả kiểm thử.
