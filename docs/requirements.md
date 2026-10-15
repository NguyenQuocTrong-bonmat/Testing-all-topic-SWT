# Hợp đồng ứng dụng dùng để thiết kế test

- R1: Mỗi phiên trình duyệt có danh sách công việc riêng. Reload giữ dữ liệu trong phiên; restart server xóa dữ liệu.
- R2: Tiêu đề được trim, dài 1–80 UTF-16 code units (JavaScript `.length`). Priority là normal hoặc high.
- R3: Tạo, hoàn thành, lọc, xóa được qua UI. Nút Enter gửi form. Lỗi API phải hiện và có thể thử lại.
- R4: Nội dung người dùng hiển thị dưới dạng text, không thực thi HTML.
- R5: Desktop 1280×800 và mobile 390×844 có baseline. Nội dung dài không tràn ngang. Nút Add task cao/rộng ít nhất 44 CSS px.
- R6: API trả JSON; POST 201, PATCH 200, DELETE 204; input không hợp lệ 400, content type không hỗ trợ 415, tài nguyên không có 404.
- R7: Budget demo local: p95 application-ready và page load < 2000 ms; p95 GET API < 500 ms. Đây là ngân sách minh họa, không phải SLA production.

## AI-assisted Testing

AI (trợ lý trong phiên chat này) đọc yêu cầu ở trên, đề xuất và viết test; lúc chạy Playwright không gọi LLM và không cần API key.

| Yêu cầu | AI đề xuất | Lý do |
|---|---|---|
| R2 | rỗng, chỉ khoảng trắng | trim có thể biến input thành rỗng |
| R2 | độ dài 1, 80, 81 | kiểm tra hai đầu biên và ngay ngoài biên |
| R2 | tiếng Việt kèm khoảng trắng | giữ nguyên Unicode sau chuẩn hóa |
| R4 | chuỗi img/onerror | phát hiện chèn HTML qua cách render thiếu an toàn |

Prompt dùng để tái tạo: “Đọc hợp đồng R1–R7. Đề xuất test biên cho tiêu đề và kiểm tra HTML được render như text. Viết Playwright test với assertion cụ thể, không dùng thời gian chờ cố định. Đối chiếu expected result với yêu cầu; không thay expected chỉ để test pass.”

Quy trình: AI đề xuất → người duyệt đối chiếu yêu cầu → chạy test → xem trace/ảnh lỗi → sửa lỗi có căn cứ → chạy lại. Bộ demo đã được AI kiểm tra theo yêu cầu và chạy thực tế; chưa có bước phê duyệt độc lập của con người. Không có self-healing tự động hay đánh giá chất lượng một mô hình AI trong demo này.
