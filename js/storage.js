/* =========================================================
   HabitStreak — Storage & core data logic (Firebase Sync Ready)
   ========================================================= */
const STORAGE_KEY = 'goalstreak_v1';

const GROUPS = [
  { id:'health',   color:'var(--c-health)',   hex:'#FF5D3E', labelKey:'groups.health' },
  { id:'study',    color:'var(--c-study)',    hex:'#5d21f5', labelKey:'groups.study' },
  { id:'work',     color:'var(--c-work)',     hex:'#f8ce2a', labelKey:'groups.work' },
  { id:'mind',     color:'var(--c-mind)',     hex:'#a97dfc', labelKey:'groups.mind' },
  { id:'finance',  color:'var(--c-finance)',  hex:'#3a62a2', labelKey:'groups.finance' },
  { id:'creative', color:'var(--c-creative)', hex:'#d9f37a', labelKey:'groups.creative' },
  { id:'social',   color:'var(--c-social)',   hex:'#ffad6f', labelKey:'groups.social' },
  { id:'other',    color:'var(--c-other)',    hex:'#8B7E70', labelKey:'groups.other' },
  { id: 'family',  color: 'var(--c-family)',  hex:'#FF9CEE', labelKey: 'groups.family' },
  { id: 'home',    color: 'var(--c-home)',    hex:'#54E3C2', labelKey: 'groups.home' }
];

const EMOJI_OPTIONS = [
  '⚠', '❌', '⛔', '✅', 
  '🏃‍♂️', '🏋️‍♀️', '🚴', '🧘‍♀️',
  '📚', '👨‍💻', '🧠', '✍️', 
  '💼', '📈', '🛒', '🎯', 
  '🎨', '🎵', '🎮', '🪴',
  '🫶', '👏', '🙏', '👍', 
  '🛌', '🌅', '💧'
];

const DEFAULT_STATE = () => ({
  lang: 'vi',
  habits: [],
  celebratedIds: [],   
  seedInstalled: true,
});

var STATE = load();

function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return DEFAULT_STATE();
    const parsed = JSON.parse(raw);
    return Object.assign(DEFAULT_STATE(), parsed);
  }catch(e){
    console.warn('HabitStreak: could not read storage, starting fresh.', e);
    return DEFAULT_STATE();
  }
}

function save(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
    // Tự động sync ngầm lên Firestore nếu đang đăng nhập
    if(typeof window.pushDataToFirebase === 'function') {
      window.pushDataToFirebase();
    }
  }catch(e){
    console.warn('HabitStreak: could not save to storage.', e);
  }
}

/* ---------- date helpers ---------- */
function todayStr(){ return fmtDate(new Date()); }
function fmtDate(d){
  const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function parseDate(s){
  const [y,m,d] = s.split('-').map(Number);
  return new Date(y, m-1, d);
}
function addDays(dateStr, n){
  const d = parseDate(dateStr);
  d.setDate(d.getDate()+n);
  return fmtDate(d);
}
function daysBetween(a,b){
  return Math.round((parseDate(b) - parseDate(a)) / 86400000);
}

/* ---------- streak / score computation ---------- */
function computeStreaks(completedDates){
  const dates = [...completedDates].sort();
  if(dates.length === 0) return { current:0, longest:0 };
  let longest = 1, run = 1;
  for(let i=1;i<dates.length;i++){
    if(daysBetween(dates[i-1], dates[i]) === 1) run++;
    else run = 1;
    if(run > longest) longest = run;
  }
  // current streak: consecutive run ending today or yesterday
  const last = dates[dates.length-1];
  const gapToToday = daysBetween(last, todayStr());
  let current = 0;
  if(gapToToday <= 1){
    current = 1;
    for(let i=dates.length-1;i>0;i--){
      if(daysBetween(dates[i-1], dates[i]) === 1) current++;
      else break;
    }
  }
  if(current > longest) longest = current;
  return { current, longest };
}

function computeHabitScore(habit){
  let score = 1; 
  score += habit.completedDates.length * 10;
  if(habit.status === 'completed') score += 100;
  return score;
}

function totalScore(){
  return STATE.habits.reduce((sum,h)=> sum + h.score, 0);
}

function goalsAchievedCount(){
  return STATE.habits.filter(h=>h.status==='completed').length;
}

function maxStreakAcrossHabits(){
  return STATE.habits.reduce((m,h)=> Math.max(m, h.longestStreak||0), 0);
}

function recomputeHabit(habit){
  const { current, longest } = computeStreaks(habit.completedDates);
  const prevLongest = habit.longestStreak || 0;
  habit.currentStreak = current;
  habit.longestStreak = longest;
  const justHitGoal = habit.status === 'active' && current >= habit.goal;
  if(justHitGoal){
    habit.status = 'completed';
    habit.completedAt = todayStr();
  }
  habit.score = computeHabitScore(habit);
  return { newRecord: longest > prevLongest && prevLongest > 0, justHitGoal };
}

/* ---------- CRUD ---------- */
function createHabit({ name, emoji, groupId, goal }){
  const habit = {
    id: 'h_' + Date.now().toString(36) + Math.random().toString(36).slice(2,6),
    name, emoji, groupId, goal,
    createdAt: todayStr(),
    updatedAt: Date.now(), // Đánh dấu thời gian để Sync
    completedDates: [],
    currentStreak: 0,
    longestStreak: 0,
    score: 1,
    status: 'active',
    completedAt: null,
  };
  STATE.habits.unshift(habit);
  save();
  return habit;
}

function updateHabit(id, patch){
  const h = STATE.habits.find(h=>h.id===id);
  if(!h) return null;
  patch.updatedAt = Date.now(); // Cập nhật thời gian
  Object.assign(h, patch);
  save();
  return h;
}

function deleteHabit(id){
  STATE.habits = STATE.habits.filter(h=>h.id!==id);
  save();
}

function getHabit(id){
  return STATE.habits.find(h=>h.id===id);
}

function toggleDate(habitId, dateStr){
  const h = getHabit(habitId);
  if(!h) return null;
  if(h.status === 'completed') return null;
  const idx = h.completedDates.indexOf(dateStr);
  let didComplete;
  if(idx >= 0){
    h.completedDates.splice(idx,1);
    didComplete = false;
  } else {
    h.completedDates.push(dateStr);
    didComplete = true;
  }
  const { newRecord, justHitGoal } = recomputeHabit(h);
  h.updatedAt = Date.now(); // Cập nhật thời gian khi thay đổi tiến độ
  save();
  return { habit:h, didComplete, newRecord, justHitGoal };
}

/* ---------- SYNC & MERGE LOGIC ---------- */
function mergeStates(localState, cloudState) {
  if (!cloudState || !cloudState.habits) return localState;
  
  const mergedHabits = [];
  const localMap = new Map(localState.habits.map(h => [h.id, h]));
  const cloudMap = new Map(cloudState.habits.map(h => [h.id, h]));
  const allIds = new Set([...localMap.keys(), ...cloudMap.keys()]);

  allIds.forEach(id => {
    const localHabit = localMap.get(id);
    const cloudHabit = cloudMap.get(id);

    if (localHabit && !cloudHabit) {
      mergedHabits.push(localHabit);
    } else if (!localHabit && cloudHabit) {
      mergedHabits.push(cloudHabit);
    } else {
      // Có ở cả 2 nơi -> Tiến hành Merge
      // 1. Gộp mảng completedDates (loại bỏ trùng lặp)
      const mergedDates = [...new Set([...localHabit.completedDates, ...cloudHabit.completedDates])].sort();
      
      // 2. Lấy thông tin (name, emoji, goal...) từ bản có updatedAt mới hơn
      const localTime = localHabit.updatedAt || 0;
      const cloudTime = cloudHabit.updatedAt || 0;
      const baseHabit = localTime >= cloudTime ? localHabit : cloudHabit;
      
      const mergedHabit = { ...baseHabit, completedDates: mergedDates };
      
      // 3. Tính toán lại Streak và Score sau khi gộp ngày
      recomputeHabit(mergedHabit);
      mergedHabits.push(mergedHabit);
    }
  });

  return {
    ...localState,
    habits: mergedHabits.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  };
}
