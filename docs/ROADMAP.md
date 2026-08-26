# Roadmap / Backlog — GoalStreak

Danh sách ý tưởng phát triển tiếp theo, chưa cam kết ngày ra mắt. Ưu tiên theo mô hình **Now / Next / Later** (tương tự GIST/lean roadmap — tránh cam kết ngày cụ thể quá sớm khi chưa có dữ liệu người dùng thật).

> Đây là backlog đề xuất dựa trên khoảng trống chức năng hiện tại của bản v1.1.1, **chưa phải yêu cầu đã chốt** với chủ sản phẩm — cần review & ưu tiên hóa (backlog grooming) trước khi đưa vào kế hoạch phát triển.

---

## 🔴 Now (giá trị cao, rủi ro/effort thấp — nên làm trước)

| Hạng mục | Lý do ưu tiên |
|---|---|
| **Xuất / Nhập dữ liệu (JSON backup)** | Dữ liệu chỉ nằm trong `localStorage` của 1 trình duyệt — mất trình duyệt là mất sạch. Đây là rủi ro lớn nhất của kiến trúc hiện tại, cần giải quyết sớm. |
| **Xác nhận trước khi xóa thói quen có dữ liệu** | Hiện tại đã có `confirm()` cơ bản của trình duyệt — nên nâng cấp thành modal xác nhận đồng bộ phong cách UI, tránh mất dữ liệu do bấm nhầm. |
| **Trang thống kê tổng quan (Dashboard)** | Người dùng có nhiều thói quen hiện chưa có cái nhìn tổng thể (VD: tỉ lệ hoàn thành tuần này, biểu đồ xu hướng điểm). |

## 🟡 Next (giá trị tốt, cần thêm effort kỹ thuật)

| Hạng mục | Ghi chú |
|---|---|
| **Chế độ tối (Dark mode)** | Toggle giống ngôn ngữ, lưu preference vào `localStorage`. |
| **PWA / cài đặt như app di động** (NO. NEVER!!!)| Thêm manifest.json + service worker để "Add to Home Screen", dùng offline. |
| **Nhắc nhở / Thông báo (Notifications)** | Nhắc thói quen chưa tích trong ngày — cần Notification API + có thể cần background sync. |
| **Tìm kiếm / lọc thói quen theo nhóm** | Hữu ích khi danh sách thói quen dài. |
| **Hiệu ứng âm thanh khi hoàn thành (tùy chọn bật/tắt)** | Tăng trải nghiệm gamification, có toggle tắt cho người không thích. |

## 🟢 Later (ý tưởng dài hạn, cần đầu tư kiến trúc lớn)

| Hạng mục | Ghi chú |
|---|---|
| **Đồng bộ đa thiết bị (Cloud sync)** | Cần backend + xác thực người dùng — thay đổi kiến trúc từ client-only sang có server, chi phí/độ phức tạp cao. |
| **Chia sẻ thành tích lên mạng xã hội** | Tạo ảnh chia sẻ tự động (canvas/SVG → PNG) kèm huy chương đạt được. |
| **Nhắc nhở thông minh theo hành vi** | Gợi ý khung giờ tích thói quen dựa trên lịch sử hoàn thành. |
| **Chế độ nhóm / thử thách bạn bè** | Cạnh tranh lành mạnh giữa nhiều người dùng — cần backend + hệ thống tài khoản. |

---

### Ghi chú kỹ thuật
Mọi hạng mục có chữ **Cloud/Backend/Đồng bộ/Tài khoản** đều kéo theo thay đổi kiến trúc nền tảng (từ 100% client-side sang có server) — cần đánh giá lại toàn bộ mô hình lưu trữ dữ liệu trước khi triển khai, không nên làm nửa vời.
