/* =========================================================
   HabitStreak — Gamification engine
   ========================================================= */
function isMedalUnlocked(medal){ return totalScore() >= medal.threshold; }
function isBadgeUnlocked(badge){
  return badge.kind === 'streak'
    ? maxStreakAcrossHabits() >= badge.threshold
    : goalsAchievedCount() >= badge.threshold;
}

function unlockedMedalCount(){ return MEDALS.filter(isMedalUnlocked).length; }
function unlockedBadgeCount(){
  return STREAK_BADGES.filter(isBadgeUnlocked).length + GOAL_BADGES.filter(isBadgeUnlocked).length;
}

/** Call after any state change that could unlock something.
 *  Returns an array of newly-unlocked defs (not yet celebrated). */
function detectNewlyUnlocked(){
  const fresh = [];
  MEDALS.forEach(m=>{
    if(isMedalUnlocked(m) && !STATE.celebratedIds.includes(m.id)){
      fresh.push({ type:'medal', def:m });
      STATE.celebratedIds.push(m.id);
    }
  });
  [...STREAK_BADGES, ...GOAL_BADGES].forEach(b=>{
    if(isBadgeUnlocked(b) && !STATE.celebratedIds.includes(b.id)){
      fresh.push({ type:'badge', def:b });
      STATE.celebratedIds.push(b.id);
    }
  });
  if(fresh.length) save();
  return fresh;
}

function achName(def){ return i18n.lang === 'en' ? def.nameEn : def.nameVi; }
function achDesc(def){ return i18n.lang === 'en' ? def.descEn : def.descVi; }

function buildAchItem(def, type){
  const unlocked = type === 'medal' ? isMedalUnlocked(def) : isBadgeUnlocked(def);
  const wrap = document.createElement('div');
  wrap.className = 'ach-item' + (unlocked ? '' : ' is-locked');
  wrap.innerHTML = `
    <div class="ach-icon-wrap">${type === 'medal' ? renderMedalSVG(def) : renderBadgeSVG(def)}</div>
    <span class="ach-item-label">${achName(def)}</span>`;
  wrap.addEventListener('click', ()=> openAchievementDetail(def, type, unlocked));
  return wrap;
}

function renderAchievementsGrids(){
  const medalGrid = document.getElementById('medalGrid');
  const streakGrid = document.getElementById('streakBadgeGrid');
  const goalGrid = document.getElementById('goalBadgeGrid');
  medalGrid.innerHTML = ''; streakGrid.innerHTML = ''; goalGrid.innerHTML = '';
  MEDALS.forEach(m => medalGrid.appendChild(buildAchItem(m, 'medal')));
  STREAK_BADGES.forEach(b => streakGrid.appendChild(buildAchItem(b, 'badge')));
  GOAL_BADGES.forEach(b => goalGrid.appendChild(buildAchItem(b, 'badge')));
}

function openAchievementDetail(def, type, unlocked){
  document.getElementById('achDetailName').textContent = achName(def);
  document.getElementById('achDetailDesc').textContent = achDesc(def);
  const iconWrap = document.getElementById('achDetailIcon');
  iconWrap.className = 'ach-detail-icon';
  iconWrap.innerHTML = (type === 'medal' ? renderMedalSVG(def) : renderBadgeSVG(def))
    + (unlocked ? '' : `<span class="lock-overlay">${lockIconSVG()}</span>`);
  const status = document.getElementById('achDetailStatus');
  status.textContent = unlocked
    ? (i18n.lang==='en' ? 'Unlocked' : 'Đã mở khóa')
    : (i18n.lang==='en' ? `Locked · needs ${def.threshold.toLocaleString('en-US')} ${type==='medal' ? 'pts' : (def.kind==='streak'?'day streak':'goals')}` : `Chưa mở · cần ${def.threshold.toLocaleString('vi-VN')} ${type==='medal' ? 'điểm' : (def.kind==='streak'?'ngày streak':'lần đạt mục tiêu')}`);
  status.className = 'ach-detail-status ' + (unlocked ? 'is-unlocked' : 'is-locked');
  openModal('achDetailModal');
}
function lockIconSVG(){
  return `<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="5" y="10.5" width="14" height="9.5" rx="2.5" fill="#2B2118"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" stroke="#2B2118" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="15" r="1.6" fill="#FFFBF3"/></svg>`;
}
