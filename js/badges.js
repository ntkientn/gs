/* =========================================================
   Goal Streak — Gamification SVGs (Bản Tinh Xảo Final - Fix khoảng cách Sao Supreme)
   ========================================================= */

/* ---------- 1. Helpers & Core Elements ---------- */
function polarPoint(cx, cy, r, angleDeg){
    const a = (angleDeg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

// Vương miện tinh xảo (5 chóp, đính ngọc, căn giữa tuyệt đối)
function getCrownSVG(cx, cy, scale) {
    return `
    <g transform="translate(${cx - 50*scale}, ${cy - 38*scale}) scale(${scale})">
        <path d="M25,32 Q50,40 75,32 L68,22 Q50,28 32,22 Z" fill="#D97706"/>
        <path d="M22,32 L15,10 L33,20 L50,0 L67,20 L85,10 L78,32 Z" fill="#FBBF24" stroke="#92400E" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M20,32 L80,32 L78,37 L22,37 Z" fill="#78350F"/>
        <path d="M22,32 L78,32 L76,34 L24,34 Z" fill="#B45309"/>
        <circle cx="50" cy="0" r="3.5" fill="#FFFFFF" stroke="#92400E" stroke-width="1"/>
        <circle cx="15" cy="10" r="2.5" fill="#FFFFFF" stroke="#92400E" stroke-width="1"/>
        <circle cx="85" cy="10" r="2.5" fill="#FFFFFF" stroke="#92400E" stroke-width="1"/>
        <circle cx="33" cy="20" r="2.5" fill="#FFFFFF" stroke="#92400E" stroke-width="1"/>
        <circle cx="67" cy="20" r="2.5" fill="#FFFFFF" stroke="#92400E" stroke-width="1"/>
        <polygon points="50,15 54,21 50,27 46,21" fill="#EF4444"/> 
        <polygon points="33,28 35,31 33,34 31,31" fill="#3B82F6"/> 
        <polygon points="67,28 69,31 67,34 65,31" fill="#3B82F6"/> 
    </g>`;
}

function getThinRibbonSVG() {
    return `
    <path d="M40,-10 L58,25 L62,25 L80,-10 L74,-10 L60,16 L46,-10 Z" fill="#B91C1C" />
    <circle cx="60" cy="27" r="4" fill="none" stroke="#FBBF24" stroke-width="2"/>
    `;
}

// Dải Ruy băng dưới đáy
function getBottomRibbon(text, type) {
    const isStreak = type === 'streak';
    const bg = isStreak ? '#B91C1C' : '#F59E0B';
    const border = isStreak ? '#FBBF24' : '#B45309';
    const textColor = isStreak ? '#FFFFFF' : '#78350F';
    return `
    <path d="M30,82 L90,82 L85,102 L60,97 L35,102 Z" fill="${bg}" stroke="${border}" stroke-width="2" stroke-linejoin="round"/>
    <text x="60" y="94" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="11" fill="${textColor}">${text}</text>
    `;
}

// Lõi Bia ngắm + Mũi tên (Cắm vào tâm)
function getBullseye(cx, cy, ringColor, coreColor, arrowColor) {
    return `
    <circle cx="${cx}" cy="${cy}" r="24" fill="none" stroke="${ringColor}" stroke-width="3" opacity="0.8"/>
    <circle cx="${cx}" cy="${cy}" r="17" fill="${coreColor}" />
    <path d="M${cx+27},${cy-27} L${cx+9},${cy-9}" stroke="${arrowColor}" stroke-width="2.5" stroke-linecap="round"/>
    <polygon points="${cx+9},${cy-9} ${cx+13},${cy-18} ${cx+18},${cy-13}" fill="${arrowColor}"/>
    `;
}


/* ---------- 2. Medal Builders ---------- */
const TIER_COLORS = {
    green:   { main:'#22C55E', light:'#4ADE80', dark:'#16A34A', ring:'#15803D' },
    bronze:  { main:'#F97316', light:'#FDBA74', dark:'#C2410C', ring:'#9A3412' },
    silver:  { main:'#CBD5E1', light:'#F1F5F9', dark:'#94A3B8', ring:'#64748B' },
    gold:    { main:'#FDE047', light:'#FEF08A', dark:'#EAB308', ring:'#CA8A04' },
    supreme: { main:'#8B5CF6', light:'#DDD6FE', dark:'#6D28D9', ring:'#FBBF24' },
};

function sunMedalSVG(tier) {
    const c = TIER_COLORS[tier];
    let rays = '';
    for(let i=0; i<12; i++) {
        rays += `<polygon points="60,32 65,48 55,48" transform="rotate(${i*30} 60 65)" fill="${c.light}" />`;
    }
    return `
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-lg transition-transform hover:scale-105">
        ${getThinRibbonSVG()}
        <circle cx="60" cy="70" r="40" fill="${c.ring}" />
        <circle cx="60" cy="70" r="38.5" fill="${c.main}" />
        <g transform="translate(0, 5)">${rays}</g>
        <circle cx="60" cy="70" r="22" fill="${c.dark}" />
        <circle cx="60" cy="70" r="16" fill="none" stroke="${c.ring}" stroke-width="2" stroke-dasharray="4 4" opacity="0.8"/>
    </svg>`;
}

function supremeMedalSVG(stars) {
    const c = TIER_COLORS['supreme'];
    let starsArr = '';
    // Tăng khoảng cách góc giữa các sao (từ 20 lên 28 độ) để chúng không dính sát nhau
    const step = 28; 
    
    for(let i=0; i<stars; i++) {
        // Công thức tính góc xoay căn giữa động theo số lượng sao
        const angle = (i - (stars - 1) / 2) * step;
        // Đẩy nhẹ các sao ra xa lõi kim cương (Radius từ 26 lên 28)
        const [sx, sy] = polarPoint(60, 70, 28, angle);
        starsArr += `<g transform="translate(${sx}, ${sy}) scale(1.4)"><polygon points="0,-4 1.5,-1.5 4.5,-1.5 2,0.5 3,3.5 0,1.5 -3,3.5 -2,0.5 -4.5,-1.5 -1.5,-1.5" fill="#FBBF24" stroke="#92400E" stroke-width="0.5" stroke-linejoin="round"/></g>`;
    }
    return `
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-xl transition-transform hover:scale-105">
        ${getThinRibbonSVG()}
        <circle cx="60" cy="70" r="40" fill="${c.main}" stroke="${c.ring}" stroke-width="1.5"/>
        <circle cx="60" cy="70" r="37.5" fill="${c.light}" />
        ${starsArr}
        <g transform="translate(0, 15)">
            <polygon points="60,40 82,53 60,80 38,53" fill="#6D28D9" />
            <polygon points="38,53 60,40 82,53 60,58" fill="#8B5CF6" />
            <polygon points="60,40 82,53 60,58" fill="#A78BFA" />
            <polygon points="60,80 82,53 60,58" fill="#5B21B6" />
        </g>
        ${stars === 5 ? getCrownSVG(60, 38, 0.65) : ''}
    </svg>`;
}


/* ---------- 3. Badge Builders (7 Cấp độ Tiến hóa Riêng biệt) ---------- */

// --- STREAK BADGES ---
function getStreakBadge(val) {
    let shape = '', ribbon = '', crown = '', textY = 65, textSize = 32;

    if(val === 10) { 
        shape = `<path d="M30,20 L90,20 L90,90 L60,110 L30,90 Z" fill="#F97316" stroke="#C2410C" stroke-width="2"/><text x="60" y="85" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="12" fill="#78350F">STREAK</text>`;
    } 
    else if(val === 20) { 
        shape = `<path d="M25,25 L95,25 L95,95 L60,80 L25,95 Z" fill="#EF4444" stroke="#991B1B" stroke-width="2"/><text x="60" y="76" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="11" fill="#FEF2F2">STREAK</text>`;
        textY = 58;
    } 
    else if(val === 50) { 
        shape = `<path d="M20,20 L100,20 L100,60 Q100,105 60,115 Q20,105 20,60 Z" fill="#BE123C" stroke="#881337" stroke-width="2"/><polygon points="60,25 65,35 75,35 67,42 70,52 60,45 50,52 53,42 45,35 55,35" fill="#FDA4AF" opacity="0.3"/><text x="60" y="88" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="12" fill="#FFC107">STREAK</text>`;
    } 
    else if(val === 100) { 
        shape = `<polygon points="60,15 100,35 100,85 60,105 20,85 20,35" fill="#7C3AED" stroke="#4C1D95" stroke-width="2"/>
                 <path d="M30,45 L25,60 L35,60 L30,75 M90,45 L95,60 L85,60 L90,75" stroke="#DDD6FE" stroke-width="2" fill="none" stroke-linecap="round"/>
                 <text x="60" y="88" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="12" fill="#E9D5FF">STREAK</text>`;
    } 
    else if(val === 200) { 
        shape = `<polygon points="60,10 105,55 60,100 15,55" fill="#4338CA" stroke="#312E81" stroke-width="2"/><polygon points="60,20 93,55 60,90 27,55" fill="none" stroke="#818CF8" stroke-width="2"/>`;
        ribbon = getBottomRibbon('STREAK', 'streak');
        textY = 62;
    } 
    else if(val === 500) { 
        shape = `<path d="M60,10 L75,35 L105,35 L85,60 L100,90 L60,75 L20,90 L35,60 L15,35 L45,35 Z" fill="#0D9488" stroke="#134E4A" stroke-width="2"/><circle cx="60" cy="55" r="28" fill="none" stroke="#5EEAD4" stroke-width="1.5" stroke-dasharray="4 4"/>`;
        ribbon = getBottomRibbon('STREAK', 'streak');
        textY = 62; textSize = 28;
    } 
    else if(val === 1000) { 
        shape = `<path d="M60,15 L70,35 L95,35 L80,55 L90,80 L60,70 L30,80 L40,55 L25,35 L50,35 Z" fill="#0F766E" stroke="#FBBF24" stroke-width="3"/>
                 <circle cx="60" cy="53" r="22" fill="#14B8A6" stroke="#042F2E" stroke-width="2"/>`;
        ribbon = getBottomRibbon('STREAK', 'streak');
        crown = getCrownSVG(60, 28, 0.6);
        textY = 62; textSize = 24;
    }

    return `
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-lg">
        ${shape}
        <text x="60" y="${textY}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="${textSize}" fill="#FFFFFF">${val}</text>
        ${ribbon}
        ${crown}
    </svg>`;
}

// --- GOAL BADGES ---
function getGoalBadge(val) {
    let shape = '', ribbon = '', crown = '', textY = 60, textSize = 18;
    let bullseye = '';

    if(val === 10) { 
        shape = `<circle cx="60" cy="55" r="42" fill="#0EA5E9" />`;
        bullseye = getBullseye(60, 55, '#BAE6FD', '#0284C7', '#FFFFFF');
        shape += `<text x="60" y="85" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="10" fill="#0C4A6E">GOALS</text>`;
    } 
    else if(val === 20) { 
        shape = `<circle cx="60" cy="55" r="44" fill="#3B82F6" stroke="#1E40AF" stroke-width="2" stroke-dasharray="6 4"/>`;
        bullseye = getBullseye(60, 55, '#BFDBFE', '#1E3A8A', '#FBBF24');
        shape += `<text x="60" y="88" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="11" fill="#EFF6FF">GOALS</text>`;
    } 
    else if(val === 50) { 
        shape = `<circle cx="60" cy="55" r="45" fill="#4F46E5" /><circle cx="60" cy="55" r="38" fill="none" stroke="#C7D2FE" stroke-width="1.5" stroke-dasharray="2 4"/>`;
        bullseye = getBullseye(60, 55, '#A5B4FC', '#312E81', '#FBBF24');
        shape += `<text x="60" y="88" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="11" fill="#E0E7FF">GOALS</text>`;
    } 
    else if(val === 100) { 
        shape = `<polygon points="60,10 99,32.5 99,77.5 60,100 21,77.5 21,32.5" fill="#8B5CF6" />`;
        bullseye = getBullseye(60, 55, '#DDD6FE', '#4C1D95', '#FBBF24');
        shape += `<text x="60" y="88" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="11" fill="#2E1065">GOALS</text>`;
    } 
    else if(val === 200) { 
        shape = `<polygon points="60,10 99,32.5 99,77.5 60,100 21,77.5 21,32.5" fill="#D946EF" stroke="#701A75" stroke-width="3"/><polygon points="60,17 93,36 93,74 60,93 27,74 27,36" fill="none" stroke="#FDF4FF" stroke-width="1"/>`;
        bullseye = getBullseye(60, 50, '#F5D0FE', '#86198F', '#FBBF24');
        ribbon = getBottomRibbon('GOALS', 'goal');
        textY = 55;
    } 
    else if(val === 500) { 
        shape = `<path d="M60,8 L72,30 L95,30 L78,48 L85,73 L60,58 L35,73 L42,48 L25,30 L48,30 Z" fill="#F43F5E" stroke="#9F1239" stroke-width="2"/>`;
        bullseye = getBullseye(60, 48, '#FECDD3', '#9F1239', '#FBBF24');
        ribbon = getBottomRibbon('GOALS', 'goal');
        textY = 53;
    } 
    else if(val === 1000) { 
        shape = `<path d="M60,10 L68,28 L88,20 L80,38 L100,50 L80,62 L88,80 L68,72 L60,90 L52,72 L32,80 L40,62 L20,50 L40,38 L32,20 L52,28 Z" fill="#FF7E67" stroke="#FBBF24" stroke-width="2"/>`;
        bullseye = getBullseye(60, 50, '#FFD0C7', '#E84C3D', '#FBBF24');
        ribbon = getBottomRibbon('GOALS', 'goal');
        crown = getCrownSVG(60, 25, 0.6);
        textY = 55;
    }

    return `
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-lg">
        ${shape}
        ${bullseye}
        <text x="60" y="${textY}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="${textSize}" fill="#FFFFFF">${val}</text>
        ${ribbon}
        ${crown}
    </svg>`;
}

/* ---------- 4. Data Arrays & Main Render Functions ---------- */
const MEDALS = [
    { id:'medal_green',  tier:'green',  threshold:10,   nameVi:'Khởi Đầu Xanh', descVi:'Đạt 10 điểm — dấu mốc cho ngày hoàn thành đầu tiên.' },
    { id:'medal_bronze', tier:'bronze', threshold:300,  nameVi:'Huy chương Đồng', descVi:'Đạt 300 điểm, tương đương gần 30 ngày.' },
    { id:'medal_silver', tier:'silver', threshold:1000, nameVi:'Huy chương Bạc', descVi:'Đạt 1.000 điểm, tương đương gần 100 ngày.' },
    { id:'medal_gold',   tier:'gold',   threshold:5000, nameVi:'Huy chương Vàng', descVi:'Đạt 5.000 điểm, tương đương gần 500 ngày.' },
];

for(let i=1; i<=5; i++) {
    MEDALS.push({
        id:`medal_supreme_${i}`, tier:'supreme', stars:i, threshold: i*10000,
        nameVi:`Tối cao ${i} Sao`, descVi:`Đạt ${i*10}k điểm — đẳng cấp cao nhất.`
    });
}

const BADGE_THRESHOLDS = [10, 20, 50, 100, 200, 500, 1000];
const STREAK_BADGES = BADGE_THRESHOLDS.map(n => ({
    id:`streak_${n}`, kind:'streak', threshold:n, nameVi:`Chuỗi ${n} ngày`, descVi:`Đạt chuỗi ${n} ngày.`
}));
const GOAL_BADGES = BADGE_THRESHOLDS.map(n => ({
    id:`goal_${n}`, kind:'goal', threshold:n, nameVi:`${n} Mục tiêu`, descVi:`Hoàn thành ${n} mục tiêu.`
}));

function renderMedalSVG(medal) {
    if(medal.tier === 'supreme') return supremeMedalSVG(medal.stars || 1);
    return sunMedalSVG(medal.tier);
}

function renderBadgeSVG(badge) {
    if(badge.kind === 'streak') return getStreakBadge(badge.threshold);
    return getGoalBadge(badge.threshold);
}
