# Playwright: demo 6 chủ đề kiểm thử

Ứng dụng Task Lab chạy cục bộ, không cần tài khoản hoặc API key. Gồm **28 test** trên 7 Playwright projects.

## Tải về và mở bằng VS Code

[Tải mã nguồn ZIP](https://github.com/NguyenQuocTrong-bonmat/Testing-all-topic-SWT/archive/refs/heads/main.zip), giải nén, rồi chọn **VS Code → File → Open Folder** mở thư mục chứa package.json. Hoặc vào repository → **Code → Download ZIP**. Hướng dẫn chi tiết cho Windows/macOS/Linux ở [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md).

## Chạy nhanh

Yêu cầu Node.js 22+ và npm. Trong thư mục dự án:

```bash
npm ci
npx playwright install chromium
npm test
npm run report
```

Linux thiếu thư viện hệ thống: cài dependencies theo hướng dẫn Playwright (`npx playwright install-deps chromium`, có thể cần quyền quản trị).

Playwright tự khởi động và dừng server tại `http://127.0.0.1:4173`. Cổng phải trống. Muốn thử app bằng tay, chạy `npm start` rồi mở URL này; dừng bằng Ctrl+C trước khi chạy test.

Môi trường hiện tại có Chromium hệ thống. Lệnh đã dùng để kiểm chứng:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test
```

Nếu muốn dùng browser do Playwright cài, bỏ biến trên. Bộ demo dùng Playwright 1.61.1; package-lock.json khóa dependency.

## 6 chủ đề

| Chủ đề | File test | Số test | Nội dung |
|---|---|---:|---|
| Web E2E Testing | tests/e2e.spec.ts | 3 | tạo → hoàn thành → lọc → reload → xóa; bàn phím; lỗi server và thử lại |
| Visual regression | tests/visual.spec.ts | 3 | desktop rỗng, desktop có dữ liệu, mobile rỗng |
| AI-assisted Testing | tests/ai-assisted.spec.ts | 7 | biên 0/1/80/81, khoảng trắng, Unicode, chèn HTML |
| Mobile Testing | tests/mobile.spec.ts | 4 | 2 test × 2 profile Pixel 7/iPhone 13, tap, chiều rộng, nút chính ≥44px |
| Performance Testing | tests/performance.spec.ts | 2 | 5 lần tải trang và 20 GET API tuần tự, p95 và budget |
| API Testing | tests/api.spec.ts | 9 | CRUD, tách phiên, schema, input lỗi, JSON lỗi, content type |

Chạy riêng:

```bash
npm run test:e2e
npm run test:visual
npm run test:ai
npm run test:mobile
npm run test:performance
npm run test:api
```

## Visual regression đúng quy trình

Ảnh chuẩn đã được tạo trên Linux với Chromium 151.0.7922.173. Khác OS, browser hoặc font có thể sinh chênh lệch; nên giữ cùng môi trường trong CI. Đã xem ảnh chuẩn trước lần so sánh. Đổi baseline chỉ khi đã duyệt giao diện mới:

```bash
npm run visual:baseline
npm run test:visual
```

**Lần đầu tạo baseline không chứng minh regression pass.** Lần test sau mới so sánh ảnh với baseline hiện có. Không tự động cập nhật baseline để làm test xanh.

Thử khả năng phát hiện regression (lệnh này chủ ý trả exit code 1 và có 1 test fail):

```bash
VISUAL_MUTATION=1 REPORT_DIR=mutation-report JSON_REPORT=evidence/mutation-results.json npx playwright test --project=visual --grep 'desktop empty state' --output=mutation-results
```

Biến này chỉ chèn CSS đổi màu h1 trong trình duyệt test, không sửa app hoặc baseline. Ảnh expected/actual/diff và trace ở mutation-results; báo cáo ở mutation-report. Với Chromium hệ thống, thêm PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH như lệnh ở trên.

## AI-assisted là gì trong demo này?

Trợ lý AI thiết kế và viết các test từ hợp đồng ở docs/requirements.md. Tài liệu ghi prompt, ánh xạ yêu cầu → test và điểm cần người duyệt. Playwright thực thi assertion cố định; không gọi LLM lúc chạy, không cần API key và không có self-healing tự động. Demo này không đánh giá chất lượng của một sản phẩm AI.

## Phạm vi mobile và performance

Cả hai profile mobile đều chạy trên Chromium: iPhone là giả lập viewport/user-agent/touch, chưa kiểm tra WebKit/Safari, Android native hay iOS native. Không dùng thiết bị thật.

Performance là phép đo smoke cục bộ, không phải load/stress test và không thay thế k6/JMeter hoặc đánh giá Core Web Vitals thực địa. Browser budget p95 <2000ms cho load/application-ready; API p95 <500ms. API dùng 20 mẫu tuần tự với concurrency=1; browser dùng 5 mẫu mới điều hướng. p95 dùng nearest-rank; 5 mẫu quá ít để suy luận thống kê production. Test browser đo TTFB, DOMContentLoaded, load và application-ready; không đo đầy đủ LCP/CLS/INP. Để đo ít nhiễu hơn, chạy project performance riêng khi không có test khác hoạt động. JSON metrics được đính kèm báo cáo.

## Cấu trúc và bằng chứng

- app/: HTTP server Node.js và giao diện HTML/CSS/JS, không có dependency runtime.
- tests/: test TypeScript và helpers.
- baselines/visual/: 3 ảnh chuẩn được lưu để so sánh.
- docs/requirements.md: yêu cầu và quy trình AI-assisted.
- docs/RESULTS.md: kết quả chạy thực tế và giới hạn.
- evidence/: JSON của lần chạy chính, performance riêng và mutation.
- playwright-report/: báo cáo HTML lần chạy chính; performance-report/ và mutation-report/ giữ các lần chạy riêng.

API phiên demo dùng cookie HttpOnly/SameSite=Lax để tách dữ liệu, chưa phải hệ thống xác thực. Dữ liệu nằm trong RAM và mất khi server restart. Không triển khai server demo làm dịch vụ production. Chỉ route `/` và API phục vụ mục đích kiểm thử này.
