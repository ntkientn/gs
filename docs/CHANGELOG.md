# Changelog

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/). Dự án chưa dùng Semantic Versioning nghiêm ngặt (chưa có API công khai để phá vỡ tương thích).

## [1.2.0] — 2026-08-24

### Changed — Đại tu toàn bộ hệ thống Gamification (medal/badge)
- **Huy chương**: đổi sang tông màu bão hòa cao, tươi sáng hơn hẳn (xanh lá/cam đồng/bạc/vàng); tất cả huy chương giờ có **2 dải ruy băng đỏ hai bên** như huy chương đeo cổ thật. Hạng Tối Cao dùng khối kim cương nhiều mặt xoay 3D, sao thành tích **fill vàng đặc** (không còn viền rỗng) và nằm ngay trong thân huy chương; riêng mốc **5 sao có thêm vương miện** phía trên.
- **Huy hiệu Streak**: bỏ hẳn mô-típ cờ đuôi nheo dùng chung 1 hình — thay bằng **7 hình dạng thủ công riêng biệt** cho từng mốc, tiến hóa từ khiên đơn giản (10 ngày) → giọt nước/pháo hoa (50–100) → kim cương lồng khung (200) → ngôi sao nhiều cánh (500–1.000). Mốc 1.000 có thêm **vương miện + viền vàng + dải ruy băng "STREAK"** ở đáy.
- **Huy hiệu Mục tiêu**: tương tự, tiến hóa từ hình tròn (10–50) → lục giác (100–200) → ngôi sao nhiều cánh (500–1.000), mỗi huy hiệu đều có **lõi bia ngắm + mũi tên cắm trúng tâm**. Mốc 1.000 có vương miện + dải ruy băng "GOALS".
- Đổi tên huy chương đầu "Huy chương Khởi Đầu" → **"Khởi Đầu Xanh"**.

### Fixed
- Bộ dữ liệu huy chương/huy hiệu mới không còn trường `nameEn`/`descEn` — vá `achName()`/`achDesc()` trong `gamification.js` để tự động dùng lại tên/mô tả tiếng Việt khi thiếu bản tiếng Anh, tránh hiện chữ "undefined" khi chuyển giao diện sang EN.

### Known issue
- Các SVG huy chương/huy hiệu mới có gắn class Tailwind (`drop-shadow-lg`, `hover:scale-105`...) nhưng dự án hiện **không nạp Tailwind CDN**, nên các class này chưa có hiệu lực (không gây lỗi, chỉ đơn giản là không tạo hiệu ứng). Xem `ARCHITECTURE.md` mục 7 để biết chi tiết.

## [1.1.1] — 2026-08-24

### Fixed
- Nút "← WebNet" đổi từ `position:fixed` sang dải tĩnh (`utility-strip`) thật sự nằm ở đầu trang, tránh trôi vị trí khi chụp full-page hoặc lệch giữa các trình duyệt.
- Khung Toast (thông báo khen ngợi/undo) thêm `visibility:hidden` ở trạng thái ẩn, đảm bảo không lộ ra ngoài trong bất kỳ điều kiện render nào.

## [1.1.0] — 2026-08-22

### Changed
- Đổi tên sản phẩm từ **HabitStreak** → **GoalStreak** (tránh trùng tên với nhiều app phổ biến trên store).
- Icon nút "Thành tích" đổi từ ngôi sao (dễ nhầm là nút favorite) → cúp outline.
- Huy chương đầu tiên đổi tên "Huy chương Xanh" → **"Huy chương Khởi Đầu"**.
- Hạng **Tối Cao** rút gọn từ 10 sao còn **5 sao** (mốc 10k/20k/30k/40k/50k điểm), đổi hẳn hình dạng sang **viên ngọc nhiều mặt** (thay vì đĩa mặt trời) để phân biệt rõ với 4 hạng thường.
- Huy hiệu **Mục tiêu** đổi hình dạng sang **bia ngắm (target)**, giữ huy hiệu **Streak** ở dạng cờ đuôi nheo — hai bộ huy hiệu giờ khác biệt cả hình lẫn màu.
- Modal chi tiết huy chương/huy hiệu: hiển thị **đầy đủ màu sắc thật** kèm icon khóa 🔒 khi chưa đạt được, thay vì làm xám icon như trước (lưới tổng quan vẫn giữ hiệu ứng xám/mờ).
- Emoji picker mở rộng từ 24 → **50 icon**.
- Thứ tự form Thêm/Sửa thói quen đổi thành: Tên → Emoji → Nhóm/Màu → Mục tiêu.

### Added
- Nút "Xem câu khác" dưới câu danh ngôn — random câu mới không lặp lại câu đang hiển thị.
- Nút "← WebNet" liên kết ra trang chủ tác giả.
- Footer bản quyền.

### Fixed
- **Bug lịch không cập nhật ngay**: sau khi tích/bỏ tích một ngày trong lịch chi tiết, ô ngày chỉ đổi màu sau khi đóng/mở lại modal do quên gọi lại hàm vẽ lịch. Đã sửa: lịch vẽ lại ngay lập tức sau mỗi lần tương tác.

## [1.0.1] — 2026-08-22

### Fixed
- **Bug nghiêm trọng**: mọi modal (`hidden` attribute) hiển thị đè lên toàn màn hình ngay khi mở trang, khiến app không dùng được. Nguyên nhân: các rule CSS tự viết (`.btn`, `.modal-overlay`, `.certified-chip`...) có khai báo `display:` riêng, vô tình thắng rule mặc định `[hidden]{display:none}` của trình duyệt do author stylesheet luôn được ưu tiên hơn user-agent stylesheet. Khắc phục bằng rule toàn cục `[hidden]{display:none !important;}`.

## [1.0.0] — 2026-08-22

### Added — Bản phát hành đầu tiên
- Quản lý thói quen: thêm/sửa/xóa, emoji, nhóm màu, mục tiêu số ngày streak (khóa sau ngày hoàn thành đầu tiên).
- Lịch trực quan theo tháng cho từng thói quen, cho phép đánh dấu bù ngày quá khứ.
- Tính Current Streak / Longest Streak / điểm số theo thời gian thực.
- Hệ thống điểm: +1 khi tạo thói quen, +10 mỗi ngày hoàn thành, +100 khi đạt mục tiêu (đóng thói quen).
- Hệ thống huy chương (Xanh/Đồng/Bạc/Vàng/Tối Cao) theo tổng điểm tích lũy.
- Hệ thống huy hiệu Streak & Mục tiêu theo 7 mốc: 10/20/50/100/200/500/1000.
- 50 câu danh ngôn tiếng Việt hiển thị ngẫu nhiên.
- Thông báo khen ngợi ngẫu nhiên + modal ăn mừng khi phá kỷ lục / đạt mục tiêu / mở khóa thành tích.
- Giao diện song ngữ VI (mặc định) / EN qua toggle.
- Lưu trữ toàn bộ dữ liệu vào `localStorage`, không cần server.
- Responsive cho cả mobile và desktop.
