/* =========================================================
   HabitStreak — i18n
   Toggle between Vietnamese (default) and English.
   ========================================================= */
const I18N = {
  vi: {
    "nav.achievements": "Thành tích",
    "hero.totalScore": "Điểm tích lũy",
    "hero.medals": "Huy chương",
    "hero.badges": "Huy hiệu",
    "hero.moreQuote": "Xem câu khác",
    "habits.title": "Thói quen của bạn",
    "habits.add": "Thêm thói quen",
    "habits.emptyTitle": "Chưa có thói quen nào cả",
    "habits.emptySub": "Bắt đầu hành trình bằng cách thêm thói quen đầu tiên của bạn nhé.",
    "habits.completedTitle": "🏅 Đã hoàn thành mục tiêu",
    "modal.addTitle": "Thói quen mới",
    "modal.editTitle": "Sửa thói quen",
    "modal.emoji": "Biểu tượng",
    "modal.name": "Tên thói quen",
    "modal.group": "Nhóm / Màu sắc",
    "modal.goal": "Mục tiêu (số ngày streak)",
    "modal.lockHint": "Không thể sửa mục tiêu sau khi thói quen đã có ngày hoàn thành.",
    "modal.delete": "Xóa thói quen",
    "modal.save": "Lưu thói quen",
    "detail.edit": "Sửa",
    "detail.certified": "✓ Đã đạt mục tiêu",
    "detail.current": "Chuỗi hiện tại",
    "detail.longest": "Chuỗi dài nhất",
    "detail.score": "Điểm",
    "detail.goal": "Mục tiêu",
    "detail.tapHint": "Chạm vào một ngày để đánh dấu hoàn thành hoặc bỏ đánh dấu (kể cả ngày trong quá khứ).",
    "ach.title": "Thành tích của bạn",
    "ach.medals": "🥇 Huy chương",
    "ach.streakBadges": "📆 Huy hiệu chuỗi ngày",
    "ach.goalBadges": "🎯 Huy hiệu mục tiêu",
    "ach.detailTitle": "Chi tiết",
    "celebrate.continue": "Tuyệt vời, tiếp tục nào!",
    "groups.health": "Sức khỏe",
    "groups.study": "Học tập",
    "groups.work": "Công việc",
    "groups.mind": "Tinh thần",
    "groups.finance": "Tài chính",
    "groups.creative": "Sáng tạo",
    "groups.social": "Kết nối",
    "groups.other": "Khác",
    "weekdays": ["T2","T3","T4","T5","T6","T7","CN"],
    "months": ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"],
    "confirm.delete": "Xóa thói quen này? Toàn bộ lịch sử sẽ mất vĩnh viễn.",
    "unit.days": "ngày",
    "unit.pts": "điểm",
    "toast.uncheck": "Đã bỏ đánh dấu ngày này.",
    "praises": [
      "Tuyệt vời lắm! 🎉","Bạn đang làm rất tốt! 👏","Tiếp tục giữ vững phong độ nhé! 🔥",
      "Xuất sắc, cứ vậy phát huy! 🌟","Một ngày nữa được chinh phục! 💪","Bạn giỏi quá đi mất! ✨",
      "Kiên trì như vậy thì thành công không còn xa! 🚀","Quá đỉnh, tự hào về bạn! 🏆",
      "Từng bước nhỏ tạo nên thay đổi lớn! 🌱","Cứ đà này, mục tiêu trong tầm tay! 🎯"
    ],
    "celebrate.recordTitle": "Kỷ lục mới! 🏆",
    "celebrate.recordText": "Bạn vừa vượt qua chuỗi dài nhất trước đây. Đây là mức cao nhất từ trước đến giờ!",
    "celebrate.goalTitle": "Chúc mừng hoàn thành mục tiêu! 🎊",
    "celebrate.goalText": "Bạn đã chinh phục trọn vẹn mục tiêu của thói quen này. Thói quen được đóng lại và chứng nhận!",
    "celebrate.medalTitle": "Mở khóa huy chương mới!",
    "celebrate.badgeTitle": "Mở khóa huy hiệu mới!",
    "auth.login": "Đăng nhập",
    "auth.logout": "Đăng xuất",
    "drawer.title": "Tài khoản & Cài đặt",
    "drawer.syncDesc": "Đăng nhập để đồng bộ thói quen trên nhiều thiết bị.",
    "drawer.syncing": "✓ Đang đồng bộ",
  },
  en: {
    "nav.achievements": "Achievements",
    "hero.totalScore": "Total score",
    "hero.medals": "Medals",
    "hero.badges": "Badges",
    "hero.moreQuote": "Show another",
    "habits.title": "Your habits",
    "habits.add": "Add habit",
    "habits.emptyTitle": "No habits yet",
    "habits.emptySub": "Start your journey by adding your first habit.",
    "habits.completedTitle": "🏅 Goals completed",
    "modal.addTitle": "New habit",
    "modal.editTitle": "Edit habit",
    "modal.emoji": "Icon",
    "modal.name": "Habit name",
    "modal.group": "Group / Color",
    "modal.goal": "Goal (streak length in days)",
    "modal.lockHint": "The goal can't be changed once a day has been completed.",
    "modal.delete": "Delete habit",
    "modal.save": "Save habit",
    "detail.edit": "Edit",
    "detail.certified": "✓ Goal achieved",
    "detail.current": "Current streak",
    "detail.longest": "Longest streak",
    "detail.score": "Score",
    "detail.goal": "Goal",
    "detail.tapHint": "Tap a day to mark it complete or undo it, including past days.",
    "ach.title": "Your achievements",
    "ach.medals": "🥇 Medals",
    "ach.streakBadges": "📆 Streak badges",
    "ach.goalBadges": "🎯 Goal badges",
    "ach.detailTitle": "Details",
    "celebrate.continue": "Awesome, let's keep going!",
    "groups.health": "Health",
    "groups.study": "Study",
    "groups.work": "Work",
    "groups.mind": "Mindfulness",
    "groups.finance": "Finance",
    "groups.creative": "Creativity",
    "groups.social": "Social",
    "groups.other": "Other",
    "weekdays": ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    "months": ["January","February","March","April","May","June","July","August","September","October","November","December"],
    "confirm.delete": "Delete this habit? All history will be lost permanently.",
    "unit.days": "days",
    "unit.pts": "pts",
    "toast.uncheck": "Day unmarked.",
    "praises": [
      "Awesome job! 🎉","You're doing great! 👏","Keep up the momentum! 🔥",
      "Excellent, keep it up! 🌟","Another day conquered! 💪","You're crushing it! ✨",
      "Keep this up and success is close! 🚀","Amazing, so proud of you! 🏆",
      "Small steps, big change! 🌱","At this pace, your goal is within reach! 🎯"
    ],
    "celebrate.recordTitle": "New record! 🏆",
    "celebrate.recordText": "You just beat your previous longest streak. This is your best ever!",
    "celebrate.goalTitle": "Goal completed! 🎊",
    "celebrate.goalText": "You've fully achieved this habit's goal. It's now closed and certified!",
    "celebrate.medalTitle": "New medal unlocked!",
    "celebrate.badgeTitle": "New badge unlocked!",
    "auth.login": "Log in",
    "auth.logout": "Log out",
    "drawer.title": "Account & Settings",
    "drawer.syncDesc": "Log in to sync your habits across devices.",
    "drawer.syncing": "✓ Syncing enabled",
  }
};

const i18n = {
  lang: 'vi',
  t(key){
    const dict = I18N[this.lang] || I18N.vi;
    return dict[key] !== undefined ? dict[key] : (I18N.vi[key] !== undefined ? I18N.vi[key] : key);
  },
  setLang(lang){
    this.lang = (lang === 'en') ? 'en' : 'vi';
    document.documentElement.lang = this.lang;
    this.applyStaticText();
  },
  applyStaticText(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      el.textContent = this.t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el=>{
      el.title = this.t(el.getAttribute('data-i18n-title'));
    });
    document.querySelectorAll('.lang-opt').forEach(el=>{
      el.classList.toggle('is-active', el.getAttribute('data-lang') === this.lang);
    });
  }
};
