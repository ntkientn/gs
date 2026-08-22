/* =========================================================
   HabitStreak — App orchestration
   ========================================================= */
const GOAL_PRESETS = [7, 14, 21, 30, 66, 100];
let editingHabitId = null;
let selectedEmoji = EMOJI_OPTIONS[0];
let selectedGroupId = GROUPS[0].id;
let selectedGoal = GOAL_PRESETS[2];
const celebrationQueue = [];

/* ---------- modal helpers ---------- */
function openModal(id){ document.getElementById(id).hidden = false; document.body.style.overflow = 'hidden'; }
function closeModal(id){
  document.getElementById(id).hidden = true;
  const anyOpen = [...document.querySelectorAll('.modal-overlay')].some(m=>!m.hidden);
  if(!anyOpen) document.body.style.overflow = '';
  if(id === 'celebrateModal') setTimeout(maybeShowNextCelebration, 250);
}
document.querySelectorAll('[data-close-modal]').forEach(btn=>{
  btn.addEventListener('click', ()=> closeModal(btn.getAttribute('data-close-modal')));
});
document.querySelectorAll('.modal-overlay').forEach(overlay=>{
  overlay.addEventListener('click', e=>{ if(e.target === overlay) closeModal(overlay.id); });
});
document.addEventListener('keydown', e=>{
  if(e.key === 'Escape'){
    const open = [...document.querySelectorAll('.modal-overlay')].find(m=>!m.hidden);
    if(open) closeModal(open.id);
  }
});

/* ---------- toast ---------- */
let toastTimer = null;
function showToast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> el.classList.remove('is-visible'), 2200);
}

/* ---------- confetti ---------- */
function spawnConfetti(){
  const layer = document.getElementById('confettiLayer');
  layer.innerHTML = '';
  const colors = ['#FF5D3E','#E8A93D','#2A9D8F','#8B7FD8','#F08A3C'];
  for(let i=0;i<26;i++){
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random()*100 + '%';
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = (Math.random()*0.4) + 's';
    p.style.transform = `rotate(${Math.random()*360}deg)`;
    layer.appendChild(p);
  }
}

/* ---------- celebration queue ---------- */
function queueCelebration(item){ celebrationQueue.push(item); }
function maybeShowNextCelebration(){
  const modal = document.getElementById('celebrateModal');
  if(!modal.hidden || celebrationQueue.length === 0) return;
  const item = celebrationQueue.shift();
  document.getElementById('celebrateIcon').innerHTML = item.iconHTML;
  document.getElementById('celebrateTitle').textContent = item.title;
  document.getElementById('celebrateText').textContent = item.text;
  spawnConfetti();
  openModal('celebrateModal');
}

function queueUnlockCelebrations(freshList){
  freshList.forEach(({type, def})=>{
    const iconHTML = `<div style="width:84px;height:84px;margin:0 auto;">${type==='medal' ? renderMedalSVG(def) : renderBadgeSVG(def)}</div>`;
    queueCelebration({
      iconHTML,
      title: type==='medal' ? i18n.t('celebrate.medalTitle') : i18n.t('celebrate.badgeTitle'),
      text: achName(def) + ' — ' + achDesc(def)
    });
  });
}

/* ---------- header stats ---------- */
function refreshHeaderStats(){
  document.getElementById('totalScoreValue').textContent = totalScore().toLocaleString(i18n.lang==='en'?'en-US':'vi-VN');
  document.getElementById('totalMedalsValue').textContent = unlockedMedalCount();
  document.getElementById('totalBadgesValue').textContent = unlockedBadgeCount();
}

/* ---------- habit list rendering ---------- */
function groupFor(id){ return GROUPS.find(g=>g.id===id) || GROUPS[0]; }

function habitCardHTML(habit){
  const group = groupFor(habit.groupId);
  const pct = Math.min(100, Math.round((habit.currentStreak / habit.goal) * 100));
  const closed = habit.status === 'completed';
  return `
  <div class="habit-card ${closed?'is-closed':''}" style="--hc:${group.hex}" data-habit-id="${habit.id}">
    <div class="habit-emoji-badge">${habit.emoji}</div>
    <div class="habit-info">
      <div class="habit-name">${escapeHTML(habit.name)} ${closed ? certifiedIconSVG() : ''}</div>
      <div class="habit-meta">
        <span class="streak-pill">🔥 ${habit.currentStreak} ${i18n.t('unit.days')}</span>
        <span>${habit.score.toLocaleString(i18n.lang==='en'?'en-US':'vi-VN')} ${i18n.t('unit.pts')}</span>
      </div>
      <div class="habit-progress-track"><div class="habit-progress-fill" style="width:${pct}%"></div></div>
    </div>
    ${closed ? '' : `<button class="check-btn ${habit.completedDates.includes(todayStr())?'is-done':''}" data-check-id="${habit.id}" aria-label="check">
      ${habit.completedDates.includes(todayStr()) ? '✓' : ''}
    </button>`}
  </div>`;
}
function certifiedIconSVG(){
  return `<svg class="certified-icon" viewBox="0 0 24 24" width="16" height="16" fill="none"><circle cx="12" cy="12" r="10" fill="#E7B23D"/><path d="M8 12.5l2.5 2.5L16 9" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
function escapeHTML(s){
  const d = document.createElement('div'); d.textContent = s; return d.innerHTML;
}

function renderHabitList(){
  const active = STATE.habits.filter(h=>h.status==='active');
  const closed = STATE.habits.filter(h=>h.status==='completed');
  const listEl = document.getElementById('habitList');
  const emptyEl = document.getElementById('emptyState');
  const completedWrap = document.getElementById('completedWrap');
  const completedList = document.getElementById('completedList');

  listEl.innerHTML = active.map(habitCardHTML).join('');
  emptyEl.hidden = STATE.habits.length > 0;

  if(closed.length){
    completedWrap.hidden = false;
    completedList.innerHTML = closed.map(habitCardHTML).join('');
  } else {
    completedWrap.hidden = true;
  }

  listEl.querySelectorAll('[data-check-id]').forEach(btn=>{
    btn.addEventListener('click', e=>{ e.stopPropagation(); handleQuickCheck(btn.getAttribute('data-check-id'), btn); });
  });
  [...listEl.querySelectorAll('.habit-card'), ...completedList.querySelectorAll('.habit-card')].forEach(card=>{
    card.addEventListener('click', ()=> openDetail(card.getAttribute('data-habit-id')));
  });

  refreshHeaderStats();
}

/* ---------- quick check (today) from list ---------- */
function handleQuickCheck(habitId, btnEl){
  const result = toggleDate(habitId, todayStr());
  if(!result) return;
  btnEl.classList.add('is-pulse');
  setTimeout(()=>btnEl.classList.remove('is-pulse'), 500);
  handlePostToggle(result);
  renderHabitList();
}

/* ---------- shared post-toggle celebration logic ---------- */
function handlePostToggle(result){
  const { didComplete, newRecord, justHitGoal, habit } = result;
  if(didComplete){
    const praises = i18n.t('praises');
    showToast(praises[Math.floor(Math.random()*praises.length)]);
    if(justHitGoal){
      queueCelebration({ iconHTML:'🎊', title:i18n.t('celebrate.goalTitle'), text:i18n.t('celebrate.goalText') });
    } else if(newRecord){
      queueCelebration({ iconHTML:'🏆', title:i18n.t('celebrate.recordTitle'), text:i18n.t('celebrate.recordText') });
    }
    queueUnlockCelebrations(detectNewlyUnlocked());
    maybeShowNextCelebration();
  } else {
    showToast(i18n.t('toast.uncheck'));
  }
  refreshHeaderStats();
}
window.onCalendarDayToggled = function(result){
  handlePostToggle(result);
  renderHabitList();
  renderDetailStats(getHabit(result.habit.id));
  renderCalendarGrid();
};

/* ---------- detail modal ---------- */
function openDetail(habitId){
  const habit = getHabit(habitId);
  if(!habit) return;
  document.getElementById('detailModal').dataset.habitId = habitId;
  document.getElementById('detailEmoji').textContent = habit.emoji;
  document.getElementById('detailName').textContent = habit.name;
  renderDetailStats(habit);
  openCalendarFor(habitId);
  openModal('detailModal');
}
function renderDetailStats(habit){
  if(!habit) return;
  document.getElementById('detailCertified').hidden = habit.status !== 'completed';
  document.getElementById('detailCurrentStreak').textContent = habit.currentStreak;
  document.getElementById('detailLongestStreak').textContent = habit.longestStreak;
  document.getElementById('detailScore').textContent = habit.score.toLocaleString(i18n.lang==='en'?'en-US':'vi-VN');
  document.getElementById('detailGoal').textContent = habit.goal;
  const pct = Math.min(100, Math.round((habit.currentStreak / habit.goal) * 100));
  document.getElementById('goalProgressFill').style.width = pct + '%';
  document.getElementById('goalProgressText').textContent = `${habit.currentStreak} / ${habit.goal} ${i18n.t('unit.days')}`;
}
document.getElementById('calPrev').addEventListener('click', ()=>shiftCalendarMonth(-1));
document.getElementById('calNext').addEventListener('click', ()=>shiftCalendarMonth(1));
document.getElementById('editHabitBtn').addEventListener('click', ()=>{
  const id = document.getElementById('detailModal').dataset.habitId;
  closeModal('detailModal');
  openHabitForm(id);
});

/* ---------- habit add/edit form ---------- */
function buildEmojiPicker(){
  const wrap = document.getElementById('emojiPicker');
  wrap.innerHTML = EMOJI_OPTIONS.map(em=>`<button type="button" class="emoji-opt" data-emoji="${em}">${em}</button>`).join('');
  wrap.querySelectorAll('.emoji-opt').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      selectedEmoji = btn.getAttribute('data-emoji');
      wrap.querySelectorAll('.emoji-opt').forEach(b=>b.classList.toggle('is-selected', b===btn));
    });
  });
}
function buildColorPicker(){
  const wrap = document.getElementById('colorPicker');
  wrap.innerHTML = GROUPS.map(g=>`<button type="button" class="color-opt" style="background:${g.hex}" data-group="${g.id}" title="${i18n.t(g.labelKey)}"></button>`).join('');
  wrap.querySelectorAll('.color-opt').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      selectedGroupId = btn.getAttribute('data-group');
      wrap.querySelectorAll('.color-opt').forEach(b=>b.classList.toggle('is-selected', b===btn));
    });
  });
}
function buildGoalPicker(){
  const wrap = document.getElementById('goalPicker');
  wrap.innerHTML = GOAL_PRESETS.map(n=>`<button type="button" class="goal-opt" data-goal="${n}">${n} ${i18n.t('unit.days')}</button>`).join('');
  wrap.querySelectorAll('.goal-opt').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      selectedGoal = Number(btn.getAttribute('data-goal'));
      document.getElementById('habitGoalCustom').value = '';
      wrap.querySelectorAll('.goal-opt').forEach(b=>b.classList.toggle('is-selected', b===btn));
    });
  });
}
document.getElementById('habitGoalCustom').addEventListener('input', e=>{
  if(e.target.value){
    selectedGoal = Number(e.target.value);
    document.querySelectorAll('#goalPicker .goal-opt').forEach(b=>b.classList.remove('is-selected'));
  }
});

function markSelected(containerId, attr, value){
  document.querySelectorAll(`#${containerId} > *`).forEach(el=>{
    el.classList.toggle('is-selected', el.getAttribute(attr) === String(value));
  });
}

function openHabitForm(habitId){
  editingHabitId = habitId || null;
  const habit = habitId ? getHabit(habitId) : null;
  document.getElementById('habitModalTitle').textContent = habit ? i18n.t('modal.editTitle') : i18n.t('modal.addTitle');
  document.getElementById('habitId').value = habitId || '';
  document.getElementById('habitName').value = habit ? habit.name : '';
  selectedEmoji = habit ? habit.emoji : EMOJI_OPTIONS[0];
  selectedGroupId = habit ? habit.groupId : GROUPS[0].id;
  selectedGoal = habit ? habit.goal : GOAL_PRESETS[2];
  document.getElementById('habitGoalCustom').value = habit && !GOAL_PRESETS.includes(habit.goal) ? habit.goal : '';
  markSelected('emojiPicker','data-emoji', selectedEmoji);
  markSelected('colorPicker','data-group', selectedGroupId);
  markSelected('goalPicker','data-goal', selectedGoal);

  const goalLocked = habit && habit.completedDates.length > 0;
  document.getElementById('goalPicker').querySelectorAll('button').forEach(b=>b.disabled = goalLocked);
  document.getElementById('habitGoalCustom').disabled = goalLocked;
  document.getElementById('editLockHint').hidden = !goalLocked;

  document.getElementById('deleteHabitBtn').hidden = !habit;
  openModal('habitModal');
}
document.getElementById('addHabitBtn').addEventListener('click', ()=>openHabitForm(null));

document.getElementById('habitForm').addEventListener('submit', e=>{
  e.preventDefault();
  const name = document.getElementById('habitName').value.trim();
  if(!name) return;
  const goal = Math.max(2, Math.min(1000, Number(selectedGoal) || GOAL_PRESETS[2]));
  if(editingHabitId){
    updateHabit(editingHabitId, { name, emoji: selectedEmoji, groupId: selectedGroupId, goal });
  } else {
    createHabit({ name, emoji: selectedEmoji, groupId: selectedGroupId, goal });
  }
  closeModal('habitModal');
  renderHabitList();
});

document.getElementById('deleteHabitBtn').addEventListener('click', ()=>{
  if(!editingHabitId) return;
  if(confirm(i18n.t('confirm.delete'))){
    deleteHabit(editingHabitId);
    closeModal('habitModal');
    closeModal('detailModal');
    renderHabitList();
  }
});

/* ---------- achievements ---------- */
document.getElementById('openAchievements').addEventListener('click', ()=>{
  renderAchievementsGrids();
  openModal('achievementsModal');
});

/* ---------- language toggle ---------- */
document.getElementById('langToggle').addEventListener('click', ()=>{
  const newLang = i18n.lang === 'vi' ? 'en' : 'vi';
  i18n.setLang(newLang);
  STATE.lang = newLang;
  save();
  buildColorPicker(); // refresh titles
  buildGoalPicker();
  renderHabitList();
  refreshHeaderStats();
});

document.getElementById('newQuoteBtn').addEventListener('click', ()=>{
  let next = getRandomQuote();
  const current = document.getElementById('quoteText').textContent;
  if(QUOTES_VI.length > 1){
    while(next === current) next = getRandomQuote();
  }
  document.getElementById('quoteText').textContent = next;
});

/* ---------- init ---------- */
function init(){
  i18n.setLang(STATE.lang || 'vi');
  document.getElementById('quoteText').textContent = getRandomQuote();
  buildEmojiPicker();
  buildColorPicker();
  buildGoalPicker();
  renderHabitList();
  refreshHeaderStats();
}
init();
