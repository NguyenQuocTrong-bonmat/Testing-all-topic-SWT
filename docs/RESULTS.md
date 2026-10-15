# Kết quả kiểm chứng

Ngày chạy: 15/10/2026 (Asia/Saigon). Node.js v24.19.0, Playwright 1.61.1, Linux, Chromium 151.0.7922.173 tại /usr/bin/chromium. Test được chạy trong thư mục work rồi sao chép nguyên mã sang /workspace/Testing-all-topic-SWT; đường dẫn trong bằng chứng JSON gốc phản ánh nơi chạy ban đầu.

Lưu ý khi tải từ GitHub: các đường dẫn HTML report, trace ZIP và mutation-results bên dưới ghi lại artifact trong môi trường đã chạy, không phải tất cả đều được commit. Repository giữ mã nguồn, baseline và JSON kết quả. Chạy lại test để tái tạo HTML report/trace; phần mutation có lệnh tái tạo trong README.

## Kết quả chính

**28/28 passed, 36,5 giây, 1 worker, retries=0.** Ảnh chuẩn đã có trước lần chạy so sánh này.

| Nhóm | Passed |
|---|---:|
| E2E | 3/3 |
| Visual regression | 3/3 |
| AI-assisted | 7/7 |
| Mobile (2 profile Chromium) | 4/4 |
| Performance | 2/2 |
| API | 9/9 |

Báo cáo: playwright-report/index.html. Bằng chứng JSON: evidence/full-results.json. Chạy `npm run report` để xem báo cáo có tương tác.

## Performance chạy riêng

Hai test chạy riêng đều pass (4,9 giây). Chi tiết mẫu ở evidence/browser-metrics.json và evidence/api-metrics.json.

| Chỉ số | Đo được | Budget demo |
|---|---:|---:|
| p95 application-ready (5 mẫu) | 423.23 ms | <2000 ms |
| p95 load (5 mẫu) | 139.70 ms | <2000 ms |
| p95 GET API (20 mẫu tuần tự) | 17.86 ms | <500 ms |

Các số này chỉ mô tả phiên chạy local này. p95 API không phải max: mẫu chậm nhất là 394.51 ms. Chưa có kết luận về tải đồng thời, mạng thực, thiết bị thật hoặc SLA production. Xem phạm vi và phương pháp trong README.

## Visual regression phát hiện thay đổi thực tế

Sau lần chạy chính, chạy 1 test với VISUAL_MUTATION=1 để đổi riêng màu h1 trong browser test. Test **fail đúng như dự kiến**, exit code 1, phát hiện **1514 pixel khác biệt**. Không cập nhật ảnh chuẩn.

- mutation-report/index.html: báo cáo lỗi có chủ ý, tách với báo cáo chính 28/28 pass.
- mutation-results/visual-desktop-empty-state-visual/desktop-empty-actual.png: ảnh sau khi đổi màu.
- mutation-results/visual-desktop-empty-state-visual/desktop-empty-diff.png: ảnh khác biệt.
- mutation-results/visual-desktop-empty-state-visual/trace.zip: trace có thể mở bằng Playwright.
- evidence/mutation-results.json: bằng chứng JSON.

## Lần chạy ban đầu và cách xử lý

Lần đầu chạy với 2 workers: 26 pass, 2 timeout ở nhóm AI-assisted. Trace ghi nhận thao tác trình duyệt mất nhiều giây ở bước mở trang/fill/click; không có assertion nghiệp vụ nào báo sai kết quả. Hai test này pass khi chạy riêng 1 worker (4,3 giây). Chuyển mặc định sang 1 worker để giảm tải trong môi trường này; không đổi yêu cầu, assertion hoặc thêm retry. Sau thay đổi, chạy lại toàn bộ được 28/28 pass. Một lần chạy xanh không đủ chứng minh hết flakiness trên mọi môi trường.

Lưu evidence/initial-run.json, evidence/boundary-results.json và evidence/initial-failure-traces/ để đối chiếu. Không xóa lịch sử lỗi để che kết quả.

## Giới hạn

AI hỗ trợ thiết kế và viết test trong phiên chat, không có LLM chạy lúc test. Mobile là giả lập Chromium, không phải Safari hoặc thiết bị thật. API test dựa trên hợp đồng demo, không đại diện kiểm thử bảo mật đầy đủ. Baseline phụ thuộc browser/font/OS. App và dữ liệu nằm cục bộ; không deploy hay gọi dịch vụ ngoài khi test.
