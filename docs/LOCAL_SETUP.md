# Chạy trên máy cá nhân bằng VS Code

`/workspace/Testing-all-topic-SWT` là đường dẫn của môi trường chat, không phải thư mục đã có trên máy bạn.

## Tải và mở

Tải [ZIP từ GitHub](https://github.com/NguyenQuocTrong-bonmat/Testing-all-topic-SWT/archive/refs/heads/main.zip) hoặc vào repository → Code → Download ZIP. Giải nén và mở thư mục `Testing-all-topic-SWT-main` bằng VS Code → File → Open Folder.

Cài Node.js 22 trở lên (bản LTS) và VS Code trước. Trong Terminal → New Terminal tại thư mục có package.json:

```bash
node --version
npm --version
npm ci
npx playwright install chromium
```

Linux thiếu thư viện: `npx playwright install-deps chromium` (có thể cần quyền quản trị).

## Chạy

```bash
npm test
npm run report
```

Trên máy cá nhân không cần đặt PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium. Playwright dùng browser vừa tải. Test tự mở server tại cổng 4173, không cần chạy npm start trước.

Ảnh chuẩn đính kèm được tạo trên Linux/Chromium hệ thống. Trên Windows/macOS/browser khác, visual test có thể báo khác ảnh. Xem expected/actual/diff trong báo cáo, xác nhận giao diện đúng rồi tạo baseline riêng cho máy của bạn bằng `npm run visual:baseline`, xem các ảnh trong baselines/visual, sau đó chạy lại `npm test`. Không cập nhật baseline để bỏ qua một lỗi giao diện chưa được duyệt. Có thể kiểm tra nhanh phần E2E trước bằng `npm run test:e2e`.

## Trong giao diện VS Code

Cài extension **Playwright Test for VSCode** của Microsoft (ms-playwright.playwright; dự án đã khai báo recommendation). Mở biểu tượng Testing ở thanh bên, chọn project/test và bấm Run hoặc Debug. Có thể dùng `npx playwright test --ui` trong terminal để mở Playwright UI Mode.

## Chạy từng nhóm

```bash
npm run test:e2e
npm run test:visual
npm run test:ai
npm run test:mobile
npm run test:performance
npm run test:api
```

Muốn xem ứng dụng bằng tay: `npm start` rồi mở http://127.0.0.1:4173. Dừng bằng Ctrl+C trước khi chạy test để tránh trùng cổng.

Nếu PowerShell chặn npm.ps1, dùng terminal Command Prompt trong VS Code hoặc chạy npm.cmd/npx.cmd thay cho npm/npx; không cần đổi execution policy toàn máy.

Xem README.md để hiểu phạm vi AI, giả lập mobile và phép đo performance; docs/RESULTS.md lưu kết quả đã chạy trong môi trường chat.
