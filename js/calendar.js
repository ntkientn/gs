/* =========================================================
   HabitStreak — Calendar view (per-habit month grid)
   ========================================================= */
const calState = { habitId: null, year: null, month: null }; // month: 0-11

function openCalendarFor(habitId){
  const now = new Date();
  calState.habitId = habitId;
  calState.year = now.getFullYear();
  calState.month = now.getMonth();
  renderCalendarGrid();
}

function shiftCalendarMonth(delta){
  let m = calState.month + delta;
  let y = calState.year;
  if(m < 0){ m = 11; y--; }
  if(m > 11){ m = 0; y++; }
  calState.month = m; calState.year = y;
  renderCalendarGrid();
}

function renderCalendarGrid(){
  const habit = getHabit(calState.habitId);
  if(!habit) return;
  const grid = document.getElementById('calendarGrid');
  const label = document.getElementById('calLabel');
  const months = i18n.t('months');
  label.textContent = `${months[calState.month]} ${calState.year}`;

  const firstOfMonth = new Date(calState.year, calState.month, 1);
  // Monday-first weekday index (0=Mon..6=Sun)
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(calState.year, calState.month + 1, 0).getDate();
  const today = todayStr();
  const groupHex = (GROUPS.find(g=>g.id===habit.groupId) || GROUPS[0]).hex;

  let html = '';
  i18n.t('weekdays').forEach(dow=>{ html += `<div class="cal-dow">${dow}</div>`; });
  for(let i=0;i<startOffset;i++){ html += `<div class="cal-day is-empty"></div>`; }

  for(let d=1; d<=daysInMonth; d++){
    const dateStr = `${calState.year}-${String(calState.month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isDone = habit.completedDates.includes(dateStr);
    const isFuture = dateStr > today;
    const isToday = dateStr === today;
    const classes = ['cal-day'];
    if(isDone) classes.push('is-done');
    if(isFuture) classes.push('is-future');
    if(isToday) classes.push('is-today');
    html += `<div class="${classes.join(' ')}" style="--hc:${groupHex}" data-date="${dateStr}" ${isFuture?'':`role="button" tabindex="0"`}>${d}</div>`;
  }
  grid.innerHTML = html;

  if(habit.status !== 'completed'){
    grid.querySelectorAll('.cal-day:not(.is-empty):not(.is-future)').forEach(cell=>{
      cell.addEventListener('click', ()=>{
        const result = toggleDate(habit.id, cell.getAttribute('data-date'));
        if(result && window.onCalendarDayToggled) window.onCalendarDayToggled(result);
      });
    });
  } else {
    grid.querySelectorAll('.cal-day').forEach(cell=> cell.style.cursor = 'default');
  }
}
