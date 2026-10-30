const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const ASSETS_DIR = path.resolve(__dirname, '../assets');
const STICKERS_DIR = path.resolve(ASSETS_DIR, 'stickers');
const FONTS_DIR = path.resolve(ASSETS_DIR, 'fonts');

function svgToPng(svgStr) {
  const resvg = new Resvg(svgStr, {
    font: {
      fontDirs: [FONTS_DIR],
      loadSystemFonts: false,
      defaultFontFamily: 'Caveat',
    }
  });
  return resvg.render().asPng();
}

const stickers = {
  // ==========================================
  // Task 18: Hewan & Ekspresi (8 stiker)
  // ==========================================
  'kucing': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Ears -->
    <polygon points="120,220 70,80 200,140" fill="#FFA500" stroke="#141414" stroke-width="10" stroke-linejoin="round"/>
    <polygon points="120,200 85,105 180,145" fill="#FF70A6"/>
    <polygon points="392,220 442,80 312,140" fill="#FFA500" stroke="#141414" stroke-width="10" stroke-linejoin="round"/>
    <polygon points="392,200 427,105 332,145" fill="#FF70A6"/>
    <!-- Head -->
    <ellipse cx="256" cy="280" rx="190" ry="160" fill="#FFA500" stroke="#141414" stroke-width="10"/>
    <!-- Stripes on forehead -->
    <path d="M 235,130 L 256,180 L 277,130" fill="none" stroke="#D35400" stroke-width="10" stroke-linecap="round"/>
    <line x1="256" y1="130" x2="256" y2="190" stroke="#D35400" stroke-width="10" stroke-linecap="round"/>
    <!-- Cheeks blush -->
    <circle cx="130" cy="310" r="25" fill="#FF70A6" opacity="0.6"/>
    <circle cx="382" cy="310" r="25" fill="#FF70A6" opacity="0.6"/>
    <!-- Happy closed eyes -->
    <path d="M 160,250 Q 195,220 230,250" fill="none" stroke="#141414" stroke-width="10" stroke-linecap="round"/>
    <path d="M 282,250 Q 317,220 352,250" fill="none" stroke="#141414" stroke-width="10" stroke-linecap="round"/>
    <!-- Nose & mouth -->
    <polygon points="245,285 267,285 256,298" fill="#FF70A6" stroke="#141414" stroke-width="6"/>
    <path d="M 230,320 Q 256,335 256,300 Q 256,335 282,320" fill="none" stroke="#141414" stroke-width="9" stroke-linecap="round"/>
    <!-- Whiskers 3 each side -->
    <line x1="80" y1="280" x2="160" y2="295" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
    <line x1="70" y1="315" x2="160" y2="315" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
    <line x1="80" y1="350" x2="160" y2="335" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
    <line x1="432" y1="280" x2="352" y2="295" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
    <line x1="442" y1="315" x2="352" y2="315" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
    <line x1="432" y1="350" x2="352" y2="335" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
  </svg>`,

  'anjing': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Droopy ears -->
    <path d="M 120,180 C 40,240 50,380 120,380 C 160,380 160,260 150,200 Z" fill="#935116" stroke="#141414" stroke-width="10"/>
    <path d="M 392,180 C 472,240 462,380 392,380 C 352,380 352,260 362,200 Z" fill="#935116" stroke="#141414" stroke-width="10"/>
    <!-- Head -->
    <ellipse cx="256" cy="270" rx="170" ry="150" fill="#E59866" stroke="#141414" stroke-width="10"/>
    <!-- Snout -->
    <ellipse cx="256" cy="330" rx="90" ry="70" fill="#FADBD8" stroke="#141414" stroke-width="9"/>
    <!-- Nose -->
    <ellipse cx="256" cy="295" rx="32" ry="22" fill="#141414"/>
    <!-- Tongue hanging out happily -->
    <path d="M 236,360 C 236,410 276,410 276,360 Z" fill="#E74C3C" stroke="#141414" stroke-width="8"/>
    <line x1="256" y1="360" x2="256" y2="395" stroke="#922B21" stroke-width="5"/>
    <path d="M 215,350 Q 256,370 256,325 Q 256,370 297,350" fill="none" stroke="#141414" stroke-width="9" stroke-linecap="round"/>
    <!-- Eyes -->
    <ellipse cx="190" cy="225" rx="18" ry="24" fill="#141414"/>
    <circle cx="184" cy="217" r="7" fill="#FFFFFF"/>
    <ellipse cx="322" cy="225" rx="18" ry="24" fill="#141414"/>
    <circle cx="316" cy="217" r="7" fill="#FFFFFF"/>
    <!-- Eyebrows -->
    <path d="M 170,185 Q 190,175 210,185" fill="none" stroke="#935116" stroke-width="9" stroke-linecap="round"/>
    <path d="M 302,185 Q 322,175 342,185" fill="none" stroke="#935116" stroke-width="9" stroke-linecap="round"/>
  </svg>`,

  'bebek': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Body -->
    <ellipse cx="230" cy="320" rx="150" ry="110" fill="#F4D03F" stroke="#141414" stroke-width="10"/>
    <!-- Tail -->
    <path d="M 90,290 Q 50,260 70,230 Q 110,250 120,280 Z" fill="#F4D03F" stroke="#141414" stroke-width="9"/>
    <!-- Wing -->
    <path d="M 170,300 C 150,370 260,370 280,310 C 290,280 230,270 170,300 Z" fill="#F1C40F" stroke="#141414" stroke-width="9"/>
    <!-- Head -->
    <circle cx="330" cy="180" r="85" fill="#F4D03F" stroke="#141414" stroke-width="10"/>
    <!-- Eye -->
    <circle cx="355" cy="165" r="14" fill="#141414"/>
    <circle cx="351" cy="160" r="5" fill="#FFFFFF"/>
    <!-- Cheek blush -->
    <ellipse cx="325" cy="205" rx="18" ry="12" fill="#E67E22" opacity="0.5"/>
    <!-- Beak orange side view -->
    <path d="M 395,175 C 470,175 480,210 405,225 Z" fill="#E67E22" stroke="#141414" stroke-width="10"/>
    <!-- Feet -->
    <polygon points="200,420 180,460 220,460" fill="#E67E22" stroke="#141414" stroke-width="8"/>
    <polygon points="270,420 250,460 290,460" fill="#E67E22" stroke="#141414" stroke-width="8"/>
  </svg>`,

  'beruang': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Round ears -->
    <circle cx="110" cy="140" r="60" fill="#784212" stroke="#141414" stroke-width="10"/>
    <circle cx="110" cy="140" r="35" fill="#D35400"/>
    <circle cx="402" cy="140" r="60" fill="#784212" stroke="#141414" stroke-width="10"/>
    <circle cx="402" cy="140" r="35" fill="#D35400"/>
    <!-- Head -->
    <circle cx="256" cy="270" r="170" fill="#784212" stroke="#141414" stroke-width="10"/>
    <!-- Snout cream -->
    <ellipse cx="256" cy="315" rx="85" ry="65" fill="#FAD7A0" stroke="#141414" stroke-width="9"/>
    <!-- Nose -->
    <ellipse cx="256" cy="285" rx="30" ry="20" fill="#141414"/>
    <!-- Mouth -->
    <path d="M 225,335 Q 256,355 256,310 Q 256,355 287,335" fill="none" stroke="#141414" stroke-width="9" stroke-linecap="round"/>
    <!-- Eyes -->
    <circle cx="185" cy="225" r="15" fill="#141414"/>
    <circle cx="180" cy="220" r="5" fill="#FFFFFF"/>
    <circle cx="327" cy="225" r="15" fill="#141414"/>
    <circle cx="322" cy="220" r="5" fill="#FFFFFF"/>
  </svg>`,

  'kelinci': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Left upright ear -->
    <ellipse cx="180" cy="130" rx="38" ry="105" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
    <ellipse cx="180" cy="130" rx="20" ry="75" fill="#FADBD8"/>
    <!-- Right bent ear -->
    <path d="M 310,210 C 310,130 350,70 410,70 C 440,70 430,120 370,160 C 350,175 340,210 340,220 Z" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
    <path d="M 325,195 C 325,145 355,95 395,95 C 410,95 405,120 370,150 Z" fill="#FADBD8"/>
    <!-- Head -->
    <ellipse cx="256" cy="320" rx="160" ry="140" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
    <!-- Blush -->
    <ellipse cx="145" cy="345" rx="22" ry="15" fill="#F1948A" opacity="0.6"/>
    <ellipse cx="367" cy="345" rx="22" ry="15" fill="#F1948A" opacity="0.6"/>
    <!-- Eyes -->
    <ellipse cx="195" cy="290" rx="14" ry="20" fill="#141414"/>
    <circle cx="190" cy="283" r="5" fill="#FFFFFF"/>
    <ellipse cx="317" cy="290" rx="14" ry="20" fill="#141414"/>
    <circle cx="312" cy="283" r="5" fill="#FFFFFF"/>
    <!-- Pink nose & mouth -->
    <polygon points="247,330 265,330 256,342" fill="#E74C3C"/>
    <path d="M 235,360 Q 256,375 256,345 Q 256,375 277,360" fill="none" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
  </svg>`,

  'panda': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Black ears -->
    <circle cx="110" cy="140" r="55" fill="#141414"/>
    <circle cx="402" cy="140" r="55" fill="#141414"/>
    <!-- Head -->
    <circle cx="256" cy="270" r="170" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
    <!-- Black eye patches angled -->
    <ellipse cx="175" cy="245" rx="42" ry="55" transform="rotate(-20 175 245)" fill="#141414"/>
    <ellipse cx="337" cy="245" rx="42" ry="55" transform="rotate(20 337 245)" fill="#141414"/>
    <!-- White eye pupils inside patch -->
    <circle cx="185" cy="240" r="14" fill="#FFFFFF"/>
    <circle cx="187" cy="240" r="7" fill="#141414"/>
    <circle cx="327" cy="240" r="14" fill="#FFFFFF"/>
    <circle cx="325" cy="240" r="7" fill="#141414"/>
    <!-- Nose & mouth -->
    <ellipse cx="256" cy="305" rx="26" ry="18" fill="#141414"/>
    <path d="M 230,345 Q 256,365 256,325 Q 256,365 282,345" fill="none" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
    <ellipse cx="140" cy="335" rx="18" ry="12" fill="#F1948A" opacity="0.5"/>
    <ellipse cx="372" cy="335" rx="18" ry="12" fill="#F1948A" opacity="0.5"/>
  </svg>`,

  'wajah-ngantuk': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Head yellow -->
    <circle cx="256" cy="270" r="180" fill="#F9E79F" stroke="#141414" stroke-width="10"/>
    <!-- Half-closed sleepy eyes -->
    <path d="M 150,230 L 220,230" stroke="#141414" stroke-width="10" stroke-linecap="round"/>
    <path d="M 150,230 A 35,25 0 0,0 220,230" fill="#F39C12" stroke="#141414" stroke-width="10"/>
    <path d="M 292,230 L 362,230" stroke="#141414" stroke-width="10" stroke-linecap="round"/>
    <path d="M 292,230 A 35,25 0 0,0 362,230" fill="#F39C12" stroke="#141414" stroke-width="10"/>
    <!-- Small open yawn mouth -->
    <ellipse cx="256" cy="330" rx="35" ry="45" fill="#C0392B" stroke="#141414" stroke-width="9"/>
    <!-- Cheeks -->
    <circle cx="150" cy="300" r="22" fill="#F1948A" opacity="0.6"/>
    <circle cx="362" cy="300" r="22" fill="#F1948A" opacity="0.6"/>
    <!-- Floating Z z bubbles light blue -->
    <text x="390" y="110" font-family="Inter" font-weight="900" font-size="70" fill="#5DADE2" stroke="#141414" stroke-width="4">Z</text>
    <text x="440" y="65" font-family="Inter" font-weight="900" font-size="46" fill="#85C1E9" stroke="#141414" stroke-width="3">z</text>
  </svg>`,

  'wajah-cinta': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Head yellow -->
    <circle cx="256" cy="256" r="190" fill="#F9E79F" stroke="#141414" stroke-width="10"/>
    <!-- Red heart eyes -->
    <g transform="translate(180, 200)">
      <path d="M 0,-15 C -35,-50 -70,-10 0,45 C 70,-10 35,-50 0,-15 Z" fill="#E74C3C" stroke="#141414" stroke-width="8"/>
    </g>
    <g transform="translate(332, 200)">
      <path d="M 0,-15 C -35,-50 -70,-10 0,45 C 70,-10 35,-50 0,-15 Z" fill="#E74C3C" stroke="#141414" stroke-width="8"/>
    </g>
    <!-- Big happy smile -->
    <path d="M 170,300 Q 256,410 342,300" fill="#C0392B" stroke="#141414" stroke-width="10"/>
    <path d="M 170,300 Q 256,410 342,300 Z" fill="#C0392B"/>
    <!-- Tongue in smile -->
    <path d="M 215,350 Q 256,330 297,350 Q 256,410 215,350 Z" fill="#F1948A"/>
    <!-- Cheeks -->
    <circle cx="130" cy="290" r="24" fill="#F1948A" opacity="0.6"/>
    <circle cx="382" cy="290" r="24" fill="#F1948A" opacity="0.6"/>
  </svg>`,

  // ==========================================
  // Task 19: Dekorasi (8 stiker)
  // ==========================================
  'bintang': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Star 5 points -->
    <polygon points="256,35 323,172 473,194 365,300 390,450 256,380 122,450 147,300 39,194 189,172" fill="#F1C40F" stroke="#141414" stroke-width="10" stroke-linejoin="round"/>
    <!-- Smiling face in center -->
    <circle cx="215" cy="250" r="12" fill="#141414"/>
    <circle cx="297" cy="250" r="12" fill="#141414"/>
    <path d="M 225,280 Q 256,310 287,280" fill="none" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
    <circle cx="185" cy="275" r="14" fill="#E74C3C" opacity="0.5"/>
    <circle cx="327" cy="275" r="14" fill="#E74C3C" opacity="0.5"/>
  </svg>`,

  'sparkle': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Big 4-point sparkle pink -->
    <path d="M 230,50 Q 230,230 50,230 Q 230,230 230,410 Q 230,230 410,230 Q 230,230 230,50 Z" fill="#F2789F" stroke="#141414" stroke-width="10" stroke-linejoin="round"/>
    <!-- Center highlight -->
    <circle cx="230" cy="230" r="28" fill="#FFFFFF"/>
    <!-- Small white 4-point sparkle top right -->
    <path d="M 410,70 Q 410,120 360,120 Q 410,120 410,170 Q 410,120 460,120 Q 410,120 410,70 Z" fill="#FFFFFF" stroke="#141414" stroke-width="8" stroke-linejoin="round"/>
  </svg>`,

  'hati': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Big glossy red heart -->
    <path d="M 256,130 C 190,20 60,70 60,200 C 60,330 210,410 256,460 C 302,410 452,330 452,200 C 452,70 322,20 256,130 Z" fill="#E74C3C" stroke="#141414" stroke-width="10" stroke-linejoin="round"/>
    <!-- White glossy reflection highlight -->
    <path d="M 120,170 C 110,130 150,90 190,95 C 160,105 130,135 130,180 Z" fill="#FFFFFF" opacity="0.8"/>
    <ellipse cx="120" cy="220" rx="8" ry="16" transform="rotate(-20 120 220)" fill="#FFFFFF" opacity="0.8"/>
  </svg>`,

  'pita': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Kawaii pink bow -->
    <!-- Left loop -->
    <path d="M 230,256 C 110,130 40,240 100,320 C 150,380 220,290 230,256 Z" fill="#F48FB1" stroke="#141414" stroke-width="10" stroke-linejoin="round"/>
    <!-- Right loop -->
    <path d="M 282,256 C 402,130 472,240 412,320 C 362,380 292,290 282,256 Z" fill="#F48FB1" stroke="#141414" stroke-width="10" stroke-linejoin="round"/>
    <!-- Left ribbon tail -->
    <path d="M 220,280 L 130,440 L 190,410 L 240,430 Z" fill="#F06292" stroke="#141414" stroke-width="9"/>
    <!-- Right ribbon tail -->
    <path d="M 292,280 L 382,440 L 322,410 L 272,430 Z" fill="#F06292" stroke="#141414" stroke-width="9"/>
    <!-- Center knot -->
    <ellipse cx="256" cy="256" rx="42" ry="46" fill="#E91E63" stroke="#141414" stroke-width="10"/>
    <circle cx="245" cy="245" r="10" fill="#FFFFFF" opacity="0.6"/>
  </svg>`,

  'bunga': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- 5 Petal Sakura light pink -->
    <g transform="translate(256, 256)">
      ${[0, 72, 144, 216, 288].map(ang => `
        <g transform="rotate(${ang})">
          <path d="M 0,-50 C -60,-120 -40,-190 0,-180 C 40,-190 60,-120 0,-50 Z" fill="#FCE4EC" stroke="#141414" stroke-width="9"/>
          <path d="M -15,-180 L 0,-165 L 15,-180" fill="#F8BBD0"/>
        </g>
      `).join('')}
      <!-- Yellow center stamen -->
      <circle cx="0" cy="0" r="50" fill="#FDD835" stroke="#141414" stroke-width="9"/>
      <circle cx="-12" cy="-12" r="8" fill="#FFFFFF"/>
    </g>
  </svg>`,

  'balon': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Heart shaped red balloon -->
    <path d="M 256,110 C 200,20 90,60 90,170 C 90,270 215,340 256,380 C 297,340 422,270 422,170 C 422,60 312,20 256,110 Z" fill="#E53935" stroke="#141414" stroke-width="10"/>
    <!-- Balloon knot -->
    <polygon points="246,380 266,380 256,396" fill="#C62828" stroke="#141414" stroke-width="6"/>
    <!-- Curly string -->
    <path d="M 256,396 Q 230,420 260,450 T 240,490" fill="none" stroke="#141414" stroke-width="7" stroke-linecap="round"/>
    <!-- Reflection highlight -->
    <path d="M 140,140 C 130,110 160,80 190,85" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>
  </svg>`,

  'mahkota': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Gold crown 3 peaks -->
    <path d="M 70,360 L 90,190 L 190,260 L 256,100 L 322,260 L 422,190 L 442,360 Z" fill="#F1C40F" stroke="#141414" stroke-width="10" stroke-linejoin="round"/>
    <!-- Bottom base rim -->
    <rect x="70" y="360" width="372" height="50" rx="8" fill="#D4AC0D" stroke="#141414" stroke-width="10"/>
    <!-- Red jewel in center -->
    <circle cx="256" cy="385" r="18" fill="#E74C3C" stroke="#141414" stroke-width="6"/>
    <circle cx="150" cy="385" r="12" fill="#3498DB" stroke="#141414" stroke-width="5"/>
    <circle cx="362" cy="385" r="12" fill="#3498DB" stroke="#141414" stroke-width="5"/>
    <!-- Jewels on peak tips -->
    <circle cx="90" cy="180" r="15" fill="#E74C3C" stroke="#141414" stroke-width="6"/>
    <circle cx="256" cy="90" r="18" fill="#E74C3C" stroke="#141414" stroke-width="6"/>
    <circle cx="422" cy="180" r="15" fill="#E74C3C" stroke="#141414" stroke-width="6"/>
  </svg>`,

  'kacamata': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Retro thick frame black sunglasses -->
    <!-- Left lens & frame -->
    <rect x="60" y="190" width="160" height="120" rx="25" fill="#141414" stroke="#141414" stroke-width="12"/>
    <rect x="75" y="205" width="130" height="90" rx="15" fill="#2C3E50"/>
    <!-- Highlight in left lens -->
    <polygon points="90,215 150,215 110,285 80,285" fill="#FFFFFF" opacity="0.3"/>
    <!-- Right lens & frame -->
    <rect x="292" y="190" width="160" height="120" rx="25" fill="#141414" stroke="#141414" stroke-width="12"/>
    <rect x="307" y="205" width="130" height="90" rx="15" fill="#2C3E50"/>
    <!-- Highlight in right lens -->
    <polygon points="322,215 382,215 342,285 312,285" fill="#FFFFFF" opacity="0.3"/>
    <!-- Bridge connecting frames -->
    <rect x="210" y="210" width="92" height="20" rx="6" fill="#141414"/>
    <!-- Temple stems -->
    <path d="M 60,200 L 20,180" stroke="#141414" stroke-width="12" stroke-linecap="round"/>
    <path d="M 452,200 L 492,180" stroke="#141414" stroke-width="12" stroke-linecap="round"/>
  </svg>`,

  // ==========================================
  // Task 20: Makanan (4 stiker)
  // ==========================================
  'kopi': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Steam curved lines -->
    <path d="M 210,110 Q 190,80 210,50" fill="none" stroke="#BDC3C7" stroke-width="8" stroke-linecap="round"/>
    <path d="M 256,120 Q 236,80 256,40" fill="none" stroke="#BDC3C7" stroke-width="8" stroke-linecap="round"/>
    <path d="M 302,110 Q 282,80 302,50" fill="none" stroke="#BDC3C7" stroke-width="8" stroke-linecap="round"/>
    <!-- Cup body -->
    <polygon points="150,180 362,180 330,450 182,450" fill="#FFFFFF" stroke="#141414" stroke-width="10" stroke-linejoin="round"/>
    <!-- Kraft sleeve holder -->
    <polygon points="160,260 352,260 338,370 174,370" fill="#D35400" stroke="#141414" stroke-width="9"/>
    <!-- Heart logo on sleeve -->
    <path d="M 256,305 C 245,290 225,295 225,315 C 225,335 256,350 256,350 C 256,350 287,335 287,315 C 287,295 267,290 256,305 Z" fill="#FFFFFF"/>
    <!-- Brown lid -->
    <rect x="135" y="150" width="242" height="35" rx="10" fill="#6E2C00" stroke="#141414" stroke-width="10"/>
    <rect x="175" y="130" width="162" height="25" rx="6" fill="#6E2C00" stroke="#141414" stroke-width="8"/>
  </svg>`,

  'boba': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Big pink straw sticking out top -->
    <rect x="235" y="40" width="38" height="240" rx="8" fill="#F48FB1" stroke="#141414" stroke-width="9"/>
    <!-- Cup transparent rounded -->
    <path d="M 130,160 L 382,160 L 345,430 C 345,455 320,465 295,465 L 217,465 C 192,465 167,455 167,430 Z" fill="#E0BB95" stroke="#141414" stroke-width="10"/>
    <!-- Dome lid -->
    <path d="M 120,160 C 120,80 392,80 392,160 Z" fill="#FFFFFF" opacity="0.6" stroke="#141414" stroke-width="10"/>
    <!-- Black tapioca pearls at bottom -->
    <circle cx="200" cy="420" r="22" fill="#141414"/>
    <circle cx="250" cy="430" r="22" fill="#141414"/>
    <circle cx="300" cy="415" r="22" fill="#141414"/>
    <circle cx="225" cy="380" r="20" fill="#141414"/>
    <circle cx="275" cy="375" r="20" fill="#141414"/>
    <circle cx="180" cy="365" r="18" fill="#141414"/>
    <circle cx="320" cy="365" r="18" fill="#141414"/>
  </svg>`,

  'eskrim': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Waffle cone -->
    <polygon points="160,260 352,260 256,470" fill="#EDBB99" stroke="#141414" stroke-width="10" stroke-linejoin="round"/>
    <!-- Waffle grid lines -->
    <line x1="200" y1="260" x2="280" y2="420" stroke="#D35400" stroke-width="4"/>
    <line x1="250" y1="260" x2="265" y2="450" stroke="#D35400" stroke-width="4"/>
    <line x1="310" y1="260" x2="235" y2="420" stroke="#D35400" stroke-width="4"/>
    <!-- Chocolate scoop bottom -->
    <circle cx="256" cy="220" r="95" fill="#6E2C00" stroke="#141414" stroke-width="10"/>
    <!-- Pink scoop top -->
    <circle cx="256" cy="150" r="80" fill="#F48FB1" stroke="#141414" stroke-width="10"/>
    <!-- Red cherry on top -->
    <circle cx="256" cy="65" r="28" fill="#C0392B" stroke="#141414" stroke-width="8"/>
    <path d="M 256,40 Q 290,10 320,30" fill="none" stroke="#141414" stroke-width="6" stroke-linecap="round"/>
  </svg>`,

  'donat': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Doughnut base dough -->
    <circle cx="256" cy="256" r="190" fill="#E59866" stroke="#141414" stroke-width="10"/>
    <!-- Chocolate icing glaze -->
    <path d="M 256,80 C 370,80 430,150 430,256 C 430,340 370,420 256,420 C 150,420 80,340 80,256 C 80,150 150,80 256,80 Z" fill="#6E2C00" stroke="#141414" stroke-width="9"/>
    <!-- Center hole -->
    <circle cx="256" cy="256" r="65" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
    <!-- Colorful sprinkles -->
    <rect x="150" y="150" width="14" height="30" rx="6" transform="rotate(30 150 150)" fill="#F1C40F"/>
    <rect x="330" y="140" width="14" height="30" rx="6" transform="rotate(-40 330 140)" fill="#E74C3C"/>
    <rect x="380" y="240" width="14" height="30" rx="6" transform="rotate(60 380 240)" fill="#2ECC71"/>
    <rect x="340" y="340" width="14" height="30" rx="6" transform="rotate(15 340 340)" fill="#3498DB"/>
    <rect x="180" y="350" width="14" height="30" rx="6" transform="rotate(-50 180 350)" fill="#E91E63"/>
    <rect x="110" y="260" width="14" height="30" rx="6" transform="rotate(20 110 260)" fill="#F1C40F"/>
    <rect x="240" y="110" width="14" height="30" rx="6" transform="rotate(80 240 110)" fill="#FFFFFF"/>
  </svg>`,

  // ==========================================
  // Task 21: Teks Tempel (4 stiker)
  // Caveat 700, stroke 14px white outline + shadow color
  // ==========================================
  'teks-bestie': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <!-- Shadow -->
    <text x="264" y="288" font-family="Caveat" font-weight="700" font-size="130" fill="#FBD3DD" text-anchor="middle">BESTIE</text>
    <!-- White thick outline -->
    <text x="256" y="280" font-family="Caveat" font-weight="700" font-size="130" fill="#F2789F" stroke="#FFFFFF" stroke-width="24" stroke-linejoin="round" text-anchor="middle">BESTIE</text>
    <!-- Main text -->
    <text x="256" y="280" font-family="Caveat" font-weight="700" font-size="130" fill="#F2789F" text-anchor="middle">BESTIE</text>
  </svg>`,

  'teks-ldr': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <text x="264" y="288" font-family="Caveat" font-weight="700" font-size="110" fill="#B9CFE8" text-anchor="middle">LDR CLUB</text>
    <text x="256" y="280" font-family="Caveat" font-weight="700" font-size="110" fill="#2456A6" stroke="#FFFFFF" stroke-width="24" stroke-linejoin="round" text-anchor="middle">LDR CLUB</text>
    <text x="256" y="280" font-family="Caveat" font-weight="700" font-size="110" fill="#2456A6" text-anchor="middle">LDR CLUB</text>
  </svg>`,

  'teks-ketemu': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <text x="264" y="228" font-family="Caveat" font-weight="700" font-size="100" fill="#C9F2D8" text-anchor="middle">AKHIRNYA</text>
    <text x="264" y="338" font-family="Caveat" font-weight="700" font-size="100" fill="#C9F2D8" text-anchor="middle">KETEMU</text>
    <text x="256" y="220" font-family="Caveat" font-weight="700" font-size="100" fill="#1E9E6A" stroke="#FFFFFF" stroke-width="24" stroke-linejoin="round" text-anchor="middle">AKHIRNYA</text>
    <text x="256" y="330" font-family="Caveat" font-weight="700" font-size="100" fill="#1E9E6A" stroke="#FFFFFF" stroke-width="24" stroke-linejoin="round" text-anchor="middle">KETEMU</text>
    <text x="256" y="220" font-family="Caveat" font-weight="700" font-size="100" fill="#1E9E6A" text-anchor="middle">AKHIRNYA</text>
    <text x="256" y="330" font-family="Caveat" font-weight="700" font-size="100" fill="#1E9E6A" text-anchor="middle">KETEMU</text>
  </svg>`,

  'teks-pose': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <text x="264" y="298" font-family="Caveat" font-weight="700" font-size="140" fill="#FDEBD2" text-anchor="middle">POSE!</text>
    <text x="256" y="290" font-family="Caveat" font-weight="700" font-size="140" fill="#F08C1E" stroke="#FFFFFF" stroke-width="24" stroke-linejoin="round" text-anchor="middle">POSE!</text>
    <text x="256" y="290" font-family="Caveat" font-weight="700" font-size="140" fill="#F08C1E" text-anchor="middle">POSE!</text>
  </svg>`,

  // ==========================================
  // Task 22: Karakter berlisensi (8 stiker)
  // ==========================================
  'snoopy-baring': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <g transform="translate(256, 260)">
      <!-- Body lying on belly -->
      <ellipse cx="-40" cy="20" rx="120" ry="60" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
      <!-- Black spot -->
      <ellipse cx="-40" cy="-5" rx="35" ry="25" fill="#141414"/>
      <!-- Paws forward -->
      <ellipse cx="90" cy="50" rx="30" ry="18" fill="#FFFFFF" stroke="#141414" stroke-width="9"/>
      <!-- Back paws -->
      <ellipse cx="-130" cy="50" rx="30" ry="18" fill="#FFFFFF" stroke="#141414" stroke-width="9"/>
      <!-- Tail -->
      <path d="M -160,20 Q -180,-10 -170,-20" fill="none" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
      <!-- Head resting on front paws -->
      <ellipse cx="120" cy="10" rx="65" ry="45" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
      <!-- Black nose -->
      <ellipse cx="180" cy="10" rx="14" ry="16" fill="#141414"/>
      <!-- Smiling eye -->
      <path d="M 125,5 Q 137,-7 150,5" fill="none" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
      <!-- Black ear -->
      <path d="M 80,5 C 60,35 55,75 75,85 C 95,90 105,65 100,20 Z" fill="#141414"/>
    </g>
  </svg>`,

  'snoopy-duduk': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <g transform="translate(240, 240)">
      <!-- Sitting body -->
      <ellipse cx="-20" cy="70" rx="65" ry="85" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
      <ellipse cx="-50" cy="60" rx="20" ry="30" fill="#141414"/>
      <!-- Foot extended forward -->
      <ellipse cx="30" cy="140" rx="45" ry="22" fill="#FFFFFF" stroke="#141414" stroke-width="9"/>
      <!-- Arm / paw -->
      <ellipse cx="20" cy="70" rx="22" ry="40" fill="#FFFFFF" stroke="#141414" stroke-width="8"/>
      <!-- Head -->
      <ellipse cx="40" cy="-50" rx="75" ry="55" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
      <!-- Nose -->
      <ellipse cx="110" cy="-50" rx="16" ry="18" fill="#141414"/>
      <!-- Eye -->
      <ellipse cx="45" cy="-60" rx="7" ry="12" fill="#141414"/>
      <!-- Long black ear hanging -->
      <path d="M -10,-45 C -40,10 -30,80 -5,80 C 15,80 15,10 5,-40 Z" fill="#141414"/>
    </g>
  </svg>`,

  'snoopy-topi': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <g transform="translate(240, 260)">
      <!-- Body sitting -->
      <ellipse cx="-10" cy="60" rx="65" ry="80" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
      <!-- Head -->
      <ellipse cx="40" cy="-40" rx="75" ry="55" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
      <ellipse cx="110" cy="-40" rx="15" ry="18" fill="#141414"/>
      <ellipse cx="45" cy="-50" rx="6" ry="12" fill="#141414"/>
      <path d="M -10,-35 C -35,15 -25,75 -5,75 C 15,75 15,15 5,-30 Z" fill="#141414"/>
      <!-- Party triangle cone hat colorful -->
      <polygon points="10,-85 60,-85 35,-190" fill="#F1C40F" stroke="#141414" stroke-width="8" stroke-linejoin="round"/>
      <polygon points="18,-115 52,-115 45,-145 25,-145" fill="#E74C3C"/>
      <circle cx="35" cy="-195" r="16" fill="#3498DB" stroke="#141414" stroke-width="6"/>
      <!-- Party blower in mouth -->
      <path d="M 85,-25 Q 150,-30 180,-60" fill="none" stroke="#E91E63" stroke-width="8" stroke-linecap="round"/>
    </g>
  </svg>`,

  'woodstock': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <g transform="translate(240, 240)">
      <!-- Woodstock small yellow bird standing -->
      <!-- Spiky yellow feathers on head -->
      <path d="M -30,-80 L -10,-120 L 0,-85 L 20,-130 L 25,-80" fill="none" stroke="#141414" stroke-width="9" stroke-linejoin="round"/>
      <!-- Head -->
      <ellipse cx="10" cy="-50" rx="55" ry="40" fill="#F1C40F" stroke="#141414" stroke-width="9"/>
      <!-- Eye -->
      <circle cx="15" cy="-55" r="6" fill="#141414"/>
      <!-- Orange beak -->
      <polygon points="55,-60 95,-50 55,-40" fill="#E67E22" stroke="#141414" stroke-width="8" stroke-linejoin="round"/>
      <!-- Body -->
      <ellipse cx="-10" cy="30" rx="45" ry="55" fill="#F1C40F" stroke="#141414" stroke-width="9"/>
      <!-- Wing -->
      <path d="M -20,10 Q -50,40 -20,60" fill="#F39C12" stroke="#141414" stroke-width="8"/>
      <!-- Thin legs -->
      <line x1="-20" y1="85" x2="-20" y2="150" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
      <line x1="5" y1="85" x2="5" y2="150" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
      <line x1="-40" y1="150" x2="-10" y2="150" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
      <line x1="-15" y1="150" x2="15" y2="150" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
    </g>
  </svg>`,

  'miffy-berdiri': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <g transform="translate(256, 260)">
      <!-- Orange dress -->
      <path d="M -60,50 L -90,160 L 90,160 L 60,50 Z" fill="#E67E22" stroke="#141414" stroke-width="10" stroke-linejoin="round"/>
      <!-- Feet -->
      <ellipse cx="-45" cy="175" rx="30" ry="16" fill="#FFFFFF" stroke="#141414" stroke-width="8"/>
      <ellipse cx="45" cy="175" rx="30" ry="16" fill="#FFFFFF" stroke="#141414" stroke-width="8"/>
      <!-- Head -->
      <ellipse cx="0" cy="-10" rx="85" ry="68" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
      <!-- Long ears -->
      <ellipse cx="-40" cy="-125" rx="26" ry="80" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
      <ellipse cx="40" cy="-125" rx="26" ry="80" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
      <!-- Eyes dots -->
      <circle cx="-32" cy="-18" r="9" fill="#141414"/>
      <circle cx="32" cy="-18" r="9" fill="#141414"/>
      <!-- 'x' mouth -->
      <line x1="-14" y1="8" x2="14" y2="28" stroke="#141414" stroke-width="9" stroke-linecap="round"/>
      <line x1="14" y1="8" x2="-14" y2="28" stroke="#141414" stroke-width="9" stroke-linecap="round"/>
    </g>
  </svg>`,

  'miffy-biru': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <g transform="translate(230, 270)">
      <!-- Blue dress -->
      <path d="M -55,45 L -85,150 L 85,150 L 55,45 Z" fill="#2980B9" stroke="#141414" stroke-width="10" stroke-linejoin="round"/>
      <!-- Feet -->
      <ellipse cx="-40" cy="165" rx="26" ry="14" fill="#FFFFFF" stroke="#141414" stroke-width="8"/>
      <ellipse cx="40" cy="165" rx="26" ry="14" fill="#FFFFFF" stroke="#141414" stroke-width="8"/>
      <!-- Head -->
      <ellipse cx="0" cy="-10" rx="75" ry="60" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
      <!-- Long ears -->
      <ellipse cx="-35" cy="-115" rx="24" ry="70" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
      <ellipse cx="35" cy="-115" rx="24" ry="70" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
      <!-- Eyes & x mouth -->
      <circle cx="-28" cy="-15" r="8" fill="#141414"/>
      <circle cx="28" cy="-15" r="8" fill="#141414"/>
      <line x1="-12" y1="6" x2="12" y2="24" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
      <line x1="12" y1="6" x2="-12" y2="24" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
      <!-- Holding red balloon -->
      <path d="M 60,80 Q 90,50 110,-60" fill="none" stroke="#141414" stroke-width="5"/>
      <ellipse cx="115" cy="-110" rx="42" ry="52" fill="#E74C3C" stroke="#141414" stroke-width="9"/>
      <polygon points="110,-58 120,-58 115,-50" fill="#C0392B"/>
    </g>
  </svg>`,

  'miffy-bunga': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <g transform="translate(256, 260)">
      <!-- Yellow dress -->
      <path d="M -55,45 L -85,150 L 85,150 L 55,45 Z" fill="#F1C40F" stroke="#141414" stroke-width="10" stroke-linejoin="round"/>
      <ellipse cx="-40" cy="165" rx="26" ry="14" fill="#FFFFFF" stroke="#141414" stroke-width="8"/>
      <ellipse cx="40" cy="165" rx="26" ry="14" fill="#FFFFFF" stroke="#141414" stroke-width="8"/>
      <!-- Head & ears -->
      <ellipse cx="0" cy="-10" rx="75" ry="60" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
      <ellipse cx="-35" cy="-115" rx="24" ry="70" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
      <ellipse cx="35" cy="-115" rx="24" ry="70" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
      <!-- Face -->
      <circle cx="-28" cy="-15" r="8" fill="#141414"/>
      <circle cx="28" cy="-15" r="8" fill="#141414"/>
      <line x1="-12" y1="6" x2="12" y2="24" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
      <line x1="12" y1="6" x2="-12" y2="24" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
      <!-- Bouquet of pink flowers in front -->
      <g transform="translate(0, 90)">
        <circle cx="-25" cy="-10" r="18" fill="#F48FB1" stroke="#141414" stroke-width="6"/>
        <circle cx="25" cy="-10" r="18" fill="#F48FB1" stroke="#141414" stroke-width="6"/>
        <circle cx="0" cy="-25" r="22" fill="#E91E63" stroke="#141414" stroke-width="6"/>
        <circle cx="0" cy="-25" r="8" fill="#FDD835"/>
      </g>
    </g>
  </svg>`,

  'miffy-gelombang': `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <g transform="translate(256, 260)">
      <!-- Green dress -->
      <path d="M -55,45 L -85,150 L 85,150 L 55,45 Z" fill="#27AE60" stroke="#141414" stroke-width="10" stroke-linejoin="round"/>
      <ellipse cx="-40" cy="165" rx="26" ry="14" fill="#FFFFFF" stroke="#141414" stroke-width="8"/>
      <ellipse cx="40" cy="165" rx="26" ry="14" fill="#FFFFFF" stroke="#141414" stroke-width="8"/>
      <!-- Waving right arm -->
      <path d="M 50,60 Q 95,30 105,-10" fill="none" stroke="#FFFFFF" stroke-width="26" stroke-linecap="round"/>
      <path d="M 50,60 Q 95,30 105,-10" fill="none" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
      <!-- Head & ears -->
      <ellipse cx="0" cy="-10" rx="75" ry="60" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
      <ellipse cx="-35" cy="-115" rx="24" ry="70" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
      <ellipse cx="35" cy="-115" rx="24" ry="70" fill="#FFFFFF" stroke="#141414" stroke-width="10"/>
      <!-- Face -->
      <circle cx="-28" cy="-15" r="8" fill="#141414"/>
      <circle cx="28" cy="-15" r="8" fill="#141414"/>
      <line x1="-12" y1="6" x2="12" y2="24" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
      <line x1="12" y1="6" x2="-12" y2="24" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
    </g>
  </svg>`
};

async function buildAllStickers() {
  console.log('Rendering 32 stickers to 512x512 transparent PNG...');
  if (!fs.existsSync(STICKERS_DIR)) fs.mkdirSync(STICKERS_DIR, { recursive: true });

  const keys = Object.keys(stickers);
  for (const id of keys) {
    const svgStr = stickers[id];
    const pngBuf = svgToPng(svgStr);
    const dest = path.join(STICKERS_DIR, `${id}.png`);
    fs.writeFileSync(dest, pngBuf);
    console.log(`✓ Sticker ${id}.png generated`);
  }
  console.log(`All ${keys.length} stickers generated successfully.`);
}

buildAllStickers().catch(console.error);
