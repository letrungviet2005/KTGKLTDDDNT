# Cơ sở dữ liệu

Cloud Firestore, collection `users`. Mỗi document có đúng bốn trường string:

```json
{
  "email": "an@example.com",
  "matkhau": "DEMO_NOT_FOR_LOGIN",
  "hoten": "Nguyễn Văn An",
  "hinhanh": ""
}
```

`email`: trim và lowercase, đúng định dạng, tối đa 254 ký tự. `hoten`: trim, 1–100 ký tự. `matkhau`: giá trị minh họa cố định, không dùng xác thực, không hash client, không hiển thị trong danh sách/chi tiết. `hinhanh`: rỗng hoặc JPEG Data URI Base64 tối đa 102400 byte (100 KiB); Data URI là ASCII nên số ký tự bằng số byte UTF-8.

Document ID chỉ được ghép vào model ứng dụng để thao tác. Service tạo payload mới đúng bốn trường; không lưu `id`, timestamps hoặc metadata. Update transaction kiểm tra document tồn tại rồi set toàn bộ payload, không merge trường ngoài schema.

Email được kiểm tra trùng không phân biệt hoa/thường trước khi ghi. Hai thao tác đồng thời có thể cùng vượt kiểm tra. Không tuyên bố duy nhất tuyệt đối. Nếu mở rộng nhiều Admin, cần thiết kế server/transaction reservation phù hợp; ngoài phạm vi đề bài.

Firestore document có giới hạn 1 MiB; giới hạn ảnh 100 KiB giúp còn dư dung lượng. Ảnh tối đa 256 px mỗi cạnh, giữ tỷ lệ, JPEG quality 0.6; thử 0.4 rồi 0.2 nếu cần. Không Firebase Storage.

## Xuất dữ liệu nộp bài

Đăng nhập Admin → Người dùng → Xuất JSON. Luôn đọc lại collection từ server (không chỉ kết quả lọc đang hiển thị). Tệp là mảng record đúng bốn trường, không có ID; lỗi đọc hoặc schema sẽ ngăn export. Trên web tải tệp; Android chia sẻ/lưu tệp. Tệp này phục vụ nộp bài, không bảo toàn ID cho backup kỹ thuật. Mẫu độc lập: `users.sample.json`, không tự seed vào database.

Không commit dữ liệu thật/ảnh người dùng vào repository công khai. Thư mục `exports/` được ignore. Các hồ sơ legacy có mật khẩu thật hoặc schema khác phải được xử lý riêng, không tự động di chuyển trong ứng dụng.
