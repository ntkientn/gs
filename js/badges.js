/* =========================================================
   HabitStreak — Gamification definitions
   Signature visual: medals styled after the Đông Sơn bronze-
   drum sun motif (rays around a dotted core) instead of
   generic trophy/star icons. Badges use a pennant shape.
   ========================================================= */

/* ---------- SVG builders ---------- */
function polarPoint(cx, cy, r, angleDeg){
  const a = (angleDeg - 90) * Math.PI / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

/** Sun-drum medal: radiating triangular rays + dotted concentric core. */
function sunMedalSVG({ mainColor, darkColor, lightColor, rayCount = 12, stars = 0, size = 120 }){
  const cx = 60, cy = 60;
  const outerR = 56, rayInnerR = 30, rayOuterR = 54, coreR = 26, dotRingR = 17;
  let rays = '';
  for(let i=0;i<rayCount;i++){
    const a0 = (360/rayCount) * i;
    const half = (360/rayCount) * 0.32;
    const [x1,y1] = polarPoint(cx,cy,rayInnerR,a0-half);
    const [x2,y2] = polarPoint(cx,cy,rayOuterR,a0);
    const [x3,y3] = polarPoint(cx,cy,rayInnerR,a0+half);
    rays += `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="${lightColor}"/>`;
  }
  let dots = '';
  const dotCount = 8;
  for(let i=0;i<dotCount;i++){
    const [x,y] = polarPoint(cx,cy,dotRingR,(360/dotCount)*i);
    dots += `<circle cx="${x}" cy="${y}" r="2.6" fill="${darkColor}" opacity=".55"/>`;
  }
  let starMarks = '';
  if(stars > 0){
    const shown = Math.min(stars, 10);
    for(let i=0;i<shown;i++){
      const angle = 180 + (shown===1?0:( (i/(shown-1))*70 - 35 ));
      const [x,y] = polarPoint(cx,cy,outerR+9, angle);
      starMarks += `<circle cx="${x}" cy="${y}" r="3.2" fill="#FFFFFF" stroke="${darkColor}" stroke-width="1"/>`;
    }
  }
  return `
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${cx}" cy="${cy}" r="${outerR}" fill="${mainColor}"/>
    <circle cx="${cx}" cy="${cy}" r="${outerR}" fill="none" stroke="${darkColor}" stroke-width="2" opacity=".35"/>
    ${rays}
    <circle cx="${cx}" cy="${cy}" r="${coreR}" fill="${mainColor}" stroke="${darkColor}" stroke-width="2" opacity=".9"/>
    <circle cx="${cx}" cy="${cy}" r="${coreR-7}" fill="none" stroke="${darkColor}" stroke-width="1.4" opacity=".5"/>
    ${dots}
    ${starMarks}
  </svg>`;
}

/** Pennant badge — used for Streak badges (flag planted each day). */
function pennantBadgeSVG({ mainColor, darkColor, label, size = 120 }){
  return `
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 8 L104 34 L104 90 Q60 116 16 90 L16 34 Z" fill="${mainColor}" stroke="${darkColor}" stroke-width="2" opacity=".95"/>
    <path d="M60 8 L104 34 L60 60 L16 34 Z" fill="#FFFFFF" opacity=".18"/>
    <text x="60" y="70" text-anchor="middle" font-family="'Be Vietnam Pro',sans-serif" font-weight="900" font-size="30" fill="#FFFFFF">${label}</text>
  </svg>`;
}

/** Target / bullseye badge — used for Goal badges (hitting the mark). */
function targetBadgeSVG({ mainColor, darkColor, accentColor, label }){
  return `
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="54" fill="#FFFFFF" stroke="${darkColor}" stroke-width="2"/>
    <circle cx="60" cy="60" r="54" fill="${mainColor}" opacity=".18"/>
    <circle cx="60" cy="60" r="40" fill="${mainColor}"/>
    <circle cx="60" cy="60" r="40" fill="none" stroke="${darkColor}" stroke-width="2" opacity=".4"/>
    <circle cx="60" cy="60" r="25" fill="#FFFFFF"/>
    <circle cx="60" cy="60" r="25" fill="none" stroke="${darkColor}" stroke-width="2" opacity=".4"/>
    <circle cx="60" cy="60" r="12" fill="${accentColor}" stroke="${darkColor}" stroke-width="2"/>
    <path d="M60 6 L66 18 L54 18 Z" fill="${accentColor}"/>
    <text x="60" y="98" text-anchor="middle" font-family="'Be Vietnam Pro',sans-serif" font-weight="900" font-size="19" fill="${darkColor}">${label}</text>
  </svg>`;
}

/** 5-point star polygon helper (returns "x,y x,y ..." string). */
function starPoints(cx, cy, outerR, innerR){
  let pts = [];
  for(let i=0;i<10;i++){
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = -90 + i * 36;
    pts.push(polarPoint(cx, cy, r, angle + 90).join(','));
  }
  return pts.join(' ');
}

/** Faceted gem medal — visually distinct shape reserved for the
 *  Supreme tier (1–5 stars), so it never reads as "just another color". */
function gemMedalSVG({ mainColor, darkColor, lightColor, stars = 1 }){
  let starsRow = '';
  const count = Math.max(1, Math.min(5, stars));
  const spacing = 16;
  const startX = 60 - ((count-1) * spacing) / 2;
  for(let i=0;i<count;i++){
    starsRow += `<polygon points="${starPoints(startX + i*spacing, 30, 7, 3)}" fill="#FFFFFF" stroke="${darkColor}" stroke-width="1"/>`;
  }
  return `
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <polygon points="60,44 90,44 108,62 60,112 12,62" fill="${mainColor}" stroke="${darkColor}" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="30,44 90,44 60,44" fill="${lightColor}"/>
    <polygon points="30,44 12,62 60,72" fill="${lightColor}" opacity=".7"/>
    <polygon points="90,44 108,62 60,72" fill="${darkColor}" opacity=".25"/>
    <polygon points="12,62 60,112 60,72" fill="${darkColor}" opacity=".18"/>
    <polygon points="108,62 60,112 60,72" fill="${lightColor}" opacity=".45"/>
    <polygon points="30,44 90,44 60,72" fill="#FFFFFF" opacity=".22"/>
    ${starsRow}
  </svg>`;
}

/* ---------- Tier palettes ---------- */
const TIER_COLORS = {
  green:   { main:'#4CAF7D', dark:'#2E7D52', light:'#8FDCB2' },
  bronze:  { main:'#C97A3D', dark:'#8F521F', light:'#E7A876' },
  silver:  { main:'#9AA6B2', dark:'#5F6B77', light:'#D3DAE1' },
  gold:    { main:'#E7B23D', dark:'#A87615', light:'#F6D686' },
  supreme: { main:'#7C5CE0', dark:'#4C2FA0', light:'#BBA6F5' },
};

/* ---------- Medal definitions ---------- */
const MEDALS = [
  { id:'medal_green',  tier:'green',  threshold:10,   nameVi:'Huy chương Khởi Đầu', nameEn:'Starting Medal',
    descVi:'Đạt 10 điểm — dấu mốc cho ngày hoàn thành đầu tiên của bạn.', descEn:'Reach 10 points — your very first completed day.' },
  { id:'medal_bronze', tier:'bronze', threshold:300,  nameVi:'Huy chương Đồng',   nameEn:'Bronze Medal',
    descVi:'Đạt 300 điểm, tương đương gần 30 ngày duy trì thói quen.', descEn:'Reach 300 points — about 30 days of consistency.' },
  { id:'medal_silver', tier:'silver', threshold:1000, nameVi:'Huy chương Bạc',    nameEn:'Silver Medal',
    descVi:'Đạt 1.000 điểm, tương đương gần 100 ngày duy trì thói quen.', descEn:'Reach 1,000 points — about 100 days of consistency.' },
  { id:'medal_gold',   tier:'gold',   threshold:5000, nameVi:'Huy chương Vàng',   nameEn:'Gold Medal',
    descVi:'Đạt 5.000 điểm, tương đương gần 500 ngày duy trì thói quen.', descEn:'Reach 5,000 points — about 500 days of consistency.' },
];
for(let i=1;i<=5;i++){
  const threshold = i*10000;
  MEDALS.push({
    id:`medal_supreme_${i}`, tier:'supreme', stars:i, threshold,
    nameVi:`Huy chương Tối cao ${i} sao`, nameEn:`Supreme Medal ${i}-Star`,
    descVi:`Đạt ${threshold.toLocaleString('vi-VN')} điểm — đẳng cấp cao nhất của người bền bỉ.`,
    descEn:`Reach ${threshold.toLocaleString('en-US')} points — the highest tier of dedication.`
  });
}

const BADGE_THRESHOLDS = [10,20,50,100,200,500,1000];
const STREAK_BADGES = BADGE_THRESHOLDS.map(n=>({
  id:`streak_${n}`, kind:'streak', threshold:n,
  nameVi:`Chuỗi ${n} ngày`, nameEn:`${n}-Day Streak`,
  descVi:`Đạt chuỗi ${n} ngày liên tiếp ở bất kỳ thói quen nào.`,
  descEn:`Reach a ${n}-day streak in any habit.`
}));
const GOAL_BADGES = BADGE_THRESHOLDS.map(n=>({
  id:`goal_${n}`, kind:'goal', threshold:n,
  nameVi:`${n} Mục tiêu`, nameEn:`${n} Goals`,
  descVi:`Hoàn thành mục tiêu thành công ${n} lần (cộng dồn qua các thói quen).`,
  descEn:`Successfully complete a goal ${n} times, across all your habits.`
}));

function renderMedalSVG(medal){
  const c = TIER_COLORS[medal.tier];
  if(medal.tier === 'supreme'){
    return gemMedalSVG({ mainColor:c.main, darkColor:c.dark, lightColor:c.light, stars: medal.stars || 1 });
  }
  return sunMedalSVG({ mainColor:c.main, darkColor:c.dark, lightColor:c.light });
}
function renderBadgeSVG(badge){
  if(badge.kind === 'streak'){
    return pennantBadgeSVG({ mainColor:'#FF5D3E', darkColor:'#DD3E22', label: badge.threshold });
  }
  return targetBadgeSVG({ mainColor:'#2A9D8F', darkColor:'#15736A', accentColor:'#E8A93D', label: badge.threshold });
}
