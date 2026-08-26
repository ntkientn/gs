# 🔥 GoalStreak

Ứng dụng web theo dõi thói quen hàng ngày (habit tracker) dành cho người dùng Việt Nam — giao diện 100% tiếng Việt (có toggle English), thiết kế ấm áp, cổ vũ động viên, và có hệ thống gamification (huy chương/huy hiệu) để duy trì động lực dài hạn.

**Tác giả:** Nguyen Trung Kien
**Trang chủ tác giả:** https://ntkientn.github.io/webnet/
**Phiên bản hiện tại:** v1.2.0 — xem chi tiết tại [`CHANGELOG.md`](./CHANGELOG.md)

---

## ✨ Tính năng chính

- **Quản lý thói quen**: thêm/sửa/xóa, chọn emoji (50 icon), nhóm màu, đặt mục tiêu số ngày streak.
- **Lịch trực quan theo tháng**: tô màu ngày đã hoàn thành, cho phép đánh dấu bù ngày trong quá khứ.
- **Streak & điểm số**: tự động tính Current Streak, Longest Streak, điểm tích lũy theo công thức cố định.
- **Gamification**: 9 huy chương (Khởi Đầu Xanh → Đồng → Bạc → Vàng → Tối Cao 1–5 sao, đeo ruy băng, mốc 5 sao có vương miện) và 14 huy hiệu (7 mốc Streak + 7 mốc Mục tiêu, mỗi mốc là 1 hình dạng thủ công riêng, tiến hóa từ đơn giản đến tinh xảo) — vẽ hoàn toàn bằng SVG tự viết, không dùng icon có sẵn.
- **Động lực**: 50 câu danh ngôn tiếng Việt (random, có nút "Xem câu khác"), thông báo khen ngợi ngẫu nhiên, modal ăn mừng khi phá kỷ lục / đạt mục tiêu / mở khóa thành tích.
- **Song ngữ VI/EN**: toggle chuyển ngôn ngữ giao diện tức thời (danh ngôn luôn giữ tiếng Việt theo chủ đích thiết kế).
- **Lưu trữ cục bộ**: toàn bộ dữ liệu lưu trong `localStorage` của trình duyệt — không cần server, không cần tài khoản.

## 🚀 Bắt đầu sử dụng

Không cần cài đặt, không cần build:

1. Giải nén / clone thư mục dự án.
2. Mở trực tiếp file `index.html` bằng trình duyệt (double-click hoặc kéo thả vào cửa sổ trình duyệt).
3. Xong — dữ liệu được lưu tự động trên chính trình duyệt đó.

> ⚠️ Vì dữ liệu lưu trong `localStorage`, nó gắn với **từng trình duyệt/thiết bị cụ thể**. Xóa cache trình duyệt hoặc đổi sang trình duyệt khác sẽ không thấy dữ liệu cũ. Không có tính năng đồng bộ đám mây ở phiên bản này (xem [`ROADMAP.md`](./ROADMAP.md)).

## 🗂️ Cấu trúc thư mục

```
goalstreak/
├── index.html              # Điểm vào duy nhất — mở file này để chạy app
├── css/
│   └── style.css           # Toàn bộ design token + style (xem docs/design-system.html)
├── js/
│   ├── i18n.js              # Từ điển VI/EN + engine dịch giao diện
│   ├── quotes.js             # 50 câu danh ngôn tiếng Việt
│   ├── badges.js             # Định nghĩa huy chương/huy hiệu + SVG generator
│   ├── storage.js            # State model, localStorage, tính streak/điểm
│   ├── calendar.js           # Lịch tháng theo từng thói quen
│   ├── gamification.js       # Logic mở khóa thành tích + render lưới thành tích
│   └── app.js                # Điều phối UI, form, celebration, khởi tạo app
└── docs/                    # Tài liệu sản phẩm (thư mục này)
```

Không có bước build (không Webpack/Vite/npm install) — toàn bộ chạy trực tiếp bằng HTML/CSS/JS thuần + Google Fonts CDN.

## 🧱 Công nghệ sử dụng

- **Vanilla JavaScript (ES6+)** — không framework, không dependency ngoài.
- **CSS thuần** với design token (`:root` custom properties).
- **Google Fonts**: Be Vietnam Pro (hỗ trợ dấu tiếng Việt đầy đủ).
- **Web Storage API** (`localStorage`) cho persistence.
- **Inline SVG generator tự viết** cho toàn bộ huy chương/huy hiệu (mô-típ mặt trời trống đồng Đông Sơn cho huy chương, viên ngọc nhiều mặt cho hạng Tối Cao, bia ngắm cho huy hiệu Mục tiêu, cờ đuôi nheo cho huy hiệu Streak).

## 📚 Tài liệu liên quan

| Tài liệu | Nội dung |
|---|---|
| [`docs/PRD.docx`](./docs/PRD.docx) | Yêu cầu sản phẩm đầy đủ, business rules, quyết định thiết kế |
| [`docs/User-Guide.docx`](./docs/User-Guide.docx) | Hướng dẫn sử dụng cho người dùng cuối |
| [`docs/GoalStreak-One-Pager.docx`](./docs/GoalStreak-One-Pager.docx) | Tóm tắt sản phẩm 1 trang (dùng cho portfolio) |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Kiến trúc kỹ thuật, data model, luồng xử lý |
| [`docs/design-system.html`](./docs/design-system.html) | Design tokens, component preview trực quan |
| [`ROADMAP.md`](./ROADMAP.md) | Backlog / tính năng dự kiến |
| [`CHANGELOG.md`](./CHANGELOG.md) | Lịch sử thay đổi theo phiên bản |

## 📄 Giấy phép

© 2026 Nguyen Trung Kien. All rights reserved.
