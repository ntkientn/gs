# Architecture — GoalStreak

Tài liệu kỹ thuật mô tả kiến trúc, data model và các luồng xử lý chính. Đối tượng đọc: dev tiếp nhận/bảo trì code sau này (kể cả chính tác giả, 6 tháng sau khi đã quên chi tiết).

## 1. Tổng quan kiến trúc

GoalStreak là **ứng dụng client-side thuần túy** — không backend, không build step, không dependency ngoài (ngoại trừ 1 font từ Google Fonts CDN). Toàn bộ logic chạy trong trình duyệt, state lưu trong `localStorage`.

```
┌─────────────────────────────────────────────┐
│                index.html                     │
│  (cấu trúc DOM tĩnh, modal templates)         │
└──────────────────┬────────────────────────────┘
                    │ <script> tuần tự
        ┌───────────┼───────────┬───────────┬──────────┬──────────────┬─────────┐
        ▼           ▼           ▼           ▼          ▼              ▼         ▼
     i18n.js    quotes.js    badges.js  storage.js  calendar.js  gamification.js app.js
```

Thứ tự load trong `index.html` **có ý nghĩa** — mỗi file phụ thuộc vào các file load trước nó (không dùng module bundler nên phụ thuộc qua global scope):

| File | Phụ thuộc vào | Cung cấp cho |
|---|---|---|
| `i18n.js` | — | tất cả (đối tượng `i18n`, hàm `i18n.t()`) |
| `quotes.js` | — | `app.js` (mảng `QUOTES_VI`, hàm `getRandomQuote()`) |
| `badges.js` | — | `gamification.js`, `app.js` (định nghĩa `MEDALS`, `STREAK_BADGES`, `GOAL_BADGES`, SVG generators) |
| `storage.js` | — | tất cả (biến `STATE`, CRUD thói quen, tính streak/điểm) |
| `calendar.js` | `storage.js`, `i18n.js` | `app.js` |
| `gamification.js` | `badges.js`, `storage.js`, `i18n.js` | `app.js` |
| `app.js` | tất cả file trên | — (điểm vào, chạy `init()` cuối file) |

## 2. Data model

Toàn bộ state nằm trong 1 object `STATE`, serialize vào `localStorage` dưới key **`goalstreak_v1`**.

```js
STATE = {
  lang: 'vi' | 'en',
  celebratedIds: string[],   // id huy chương/huy hiệu đã từng hiện modal ăn mừng — tránh lặp lại
  habits: [
    {
      id: string,                 // 'h_' + timestamp base36 + random suffix
      name: string,
      emoji: string,
      groupId: 'health'|'study'|'work'|'mind'|'finance'|'creative'|'social'|'other',
      goal: number,                // số ngày streak mục tiêu (2–1000)
      createdAt: 'YYYY-MM-DD',
      completedDates: string[],    // mảng 'YYYY-MM-DD', không nhất thiết liên tục
      currentStreak: number,       // derived, tính lại mỗi lần toggleDate()
      longestStreak: number,       // derived, giữ nguyên kể cả khi streak hiện tại bị đứt
      score: number,               // derived: 1 + completedDates.length*10 + (100 nếu status==='completed')
      status: 'active' | 'completed',
      completedAt: 'YYYY-MM-DD' | null
    }
  ]
}
```

**Lưu ý quan trọng**: `currentStreak`, `longestStreak`, `score` là **derived fields** — được tính lại từ `completedDates` mỗi lần `recomputeHabit()` chạy (trong `storage.js`), không phải nguồn sự thật. Nếu sau này cần migrate schema, chỉ `completedDates` + các field tĩnh (`id/name/emoji/groupId/goal/createdAt/status/completedAt`) là bắt buộc phải giữ đúng.

## 3. Thuật toán tính Streak

```
computeStreaks(completedDates):
  1. Sort completedDates tăng dần
  2. longest = độ dài dãy con liên tiếp dài nhất (so sánh khoảng cách 1 ngày giữa 2 phần tử kề nhau)
  3. current = 0 nếu ngày hoàn thành gần nhất cách hôm nay > 1 ngày (streak đã đứt)
             = độ dài dãy liên tiếp tính lùi từ ngày gần nhất, nếu cách hôm nay ≤ 1 ngày
```

Quy tắc "cách hôm nay ≤ 1 ngày" nghĩa là streak **không bị coi là đứt cho đến hết ngày hôm nay** — nếu hôm qua có tích mà hôm nay chưa tích, streak vẫn tính là "còn sống" (current streak) đến khi qua nửa đêm mà vẫn chưa tích.

## 4. Luồng khóa thói quen khi đạt mục tiêu

```
toggleDate(habitId, date)
  → nếu habit.status === 'completed': return null (đã khóa, không cho sửa)
  → thêm/xóa date khỏi completedDates
  → recomputeHabit():
      - tính lại current/longestStreak
      - nếu status==='active' && currentStreak >= goal:
          → status = 'completed', completedAt = hôm nay (ĐÓNG THÓI QUEN VĨNH VIỄN)
      - tính lại score
  → return { habit, didComplete, newRecord, justHitGoal }
```

Một khi `status` chuyển thành `'completed'`, **không có đường quay lại** trong UI hiện tại — đúng theo business rule đã chốt ("1 thói quen chỉ có 1 mục tiêu, đạt xong thì khóa").

## 5. Hệ thống Gamification

- **Huy chương** (`MEDALS` trong `badges.js`): unlock dựa trên `totalScore()`. 4 hạng thường (Khởi Đầu Xanh/Đồng/Bạc/Vàng) dùng `sunMedalSVG(tier)` — đĩa tia nắng 2 lớp màu (`main`/`ring`) đọc từ `TIER_COLORS`. Hạng Tối Cao (1–5 sao) dùng `supremeMedalSVG(stars)` — khối kim cương nhiều mặt (4 polygon tạo hiệu ứng 3D) với sao **fill vàng đặc** đặt bằng `polarPoint()` quanh đỉnh kim cương. Mọi huy chương đều có `getThinRibbonSVG()` (2 dải ruy băng đỏ) vẽ phía sau; riêng `stars === 5` gọi thêm `getCrownSVG()` để đặt vương miện lên trên.
- **Huy hiệu Streak** (`STREAK_BADGES`, hàm `getStreakBadge(val)`): unlock dựa trên `maxStreakAcrossHabits()`. Khác với huy chương (dùng công thức tham số hóa chung), **mỗi mốc trong 7 mốc (10/20/50/100/200/500/1.000) có hình dạng SVG viết tay riêng** trong 1 chuỗi `if/else if` — tăng dần độ tinh xảo (khiên đơn giản → hình giọt nước có sao lấp lánh → hexagon có tia sét → kim cương lồng khung → ngôi sao nhiều cánh). Mốc 200 trở lên có thêm `getBottomRibbon()` (dải ruy băng ghi "STREAK" ở đáy); mốc 1.000 có thêm `getCrownSVG()`.
- **Huy hiệu Mục tiêu** (`GOAL_BADGES`, hàm `getGoalBadge(val)`): unlock dựa trên `goalsAchievedCount()`. Cùng triết lý "7 hình thủ công tiến hóa riêng" như Streak, nhưng theo họ hình tròn → lục giác → ngôi sao, và LUÔN có `getBullseye()` (bia ngắm 2 vòng + mũi tên cắm vào tâm) chồng lên trên để giữ ngôn ngữ hình ảnh "nhắm trúng mục tiêu" xuyên suốt mọi mốc.
- **Celebration queue** (`app.js`): mỗi lần có thể có nhiều unlock cùng lúc (VD: vừa đạt mục tiêu vừa lên hạng huy chương) — các modal ăn mừng được xếp hàng (`celebrationQueue`) và hiện tuần tự, không chồng lên nhau. `STATE.celebratedIds` đảm bảo mỗi thành tích chỉ ăn mừng **đúng 1 lần** dù mở lại app nhiều lần.
- **i18n cho tên/mô tả thành tích**: `MEDALS`/`STREAK_BADGES`/`GOAL_BADGES` hiện chỉ có `nameVi`/`descVi` (không có bản `nameEn`/`descEn`). `achName()`/`achDesc()` trong `gamification.js` được vá để tự fallback về tiếng Việt khi thiếu bản tiếng Anh — tránh hiện "undefined" khi người dùng chuyển giao diện sang EN, nhưng đồng nghĩa **tên huy chương/huy hiệu hiển thị tiếng Việt ngay cả ở chế độ EN** (giống cách xử lý danh ngôn).

## 6. Quốc tế hóa (i18n)

Từ điển VI/EN nằm trong `I18N` object (`i18n.js`), áp dụng qua `data-i18n` / `data-i18n-title` attribute trên DOM. **Ngoại lệ có chủ đích**: 50 câu danh ngôn trong `quotes.js`, và (từ v1.2.0) tên/mô tả huy chương & huy hiệu, luôn hiển thị tiếng Việt bất kể ngôn ngữ giao diện.

## 7. Giới hạn đã biết (Known limitations)

- **Không có backend** → không đồng bộ đa thiết bị, mất dữ liệu nếu xóa cache trình duyệt.
- **Không có automated test** (unit/e2e) — mọi thay đổi hiện đang được xác minh thủ công qua kiểm tra bằng mắt và `node --check` cho lỗi cú pháp. Rủi ro regression khi codebase lớn dần.
- **`localStorage` giới hạn ~5–10MB** — không phải vấn đề ở quy mô hiện tại, nhưng cần lưu ý nếu sau này lưu thêm ảnh/dữ liệu lớn.
- **Không có build/minify step** — chấp nhận được ở quy mô hiện tại, nhưng nếu codebase phình to nên cân nhắc bundler.
- **Class Tailwind trong `badges.js` chưa có hiệu lực**: các SVG huy chương/huy hiệu (v1.2.0) có gắn `class="drop-shadow-lg"`, `class="hover:scale-105"`... nhưng `index.html` không nạp Tailwind CDN, nên các class này hiện là no-op (không lỗi, chỉ không tạo hiệu ứng đổ bóng/phóng to khi hover). Muốn các hiệu ứng này hoạt động, cần thêm `<script src="https://cdn.tailwindcss.com"></script>` vào `index.html`, hoặc viết lại hiệu ứng tương đương bằng CSS thuần trong `style.css` để giữ nguyên tắc "không phụ thuộc thư viện ngoài".
- **7 hình dạng huy hiệu mỗi bộ là code viết tay** (không phải hàm tham số hóa) — nghĩa là muốn thêm mốc thứ 8 (VD: 2.000 ngày) sẽ cần viết thêm 1 nhánh `if` mới trong `getStreakBadge`/`getGoalBadge`, không tự sinh được như hệ thống cũ.

Xem thêm định hướng khắc phục các giới hạn này tại [`ROADMAP.md`](../ROADMAP.md).
