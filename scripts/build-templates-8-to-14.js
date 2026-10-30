const {
  saveTemplate,
  maskCutout4x1,
  maskCutout2x2,
  GEOMETRY
} = require('./template-builder');

async function buildTemplates8To14() {
  console.log('Building templates 8 to 14...');
  const slots4x1 = GEOMETRY.layouts['4x1'].slots;
  const slots2x2 = GEOMETRY.layouts['2x2'].slots;

  // ==========================================
  // 8. Hati (Task 11)
  // ==========================================
  const heartAccents4x1 = `
    <!-- Header floating small hearts -->
    <path d="M 120 70 C 120 50 95 40 70 55 C 45 70 45 105 75 130 L 120 160 L 165 130 C 195 105 195 70 170 55 C 145 40 120 50 120 70 Z" transform="scale(0.3) translate(200, 100) rotate(-15)" fill="#D6336C"/>
    <path d="M 120 70 C 120 50 95 40 70 55 C 45 70 45 105 75 130 L 120 160 L 165 130 C 195 105 195 70 170 55 C 145 40 120 50 120 70 Z" transform="scale(0.25) translate(1800, 250) rotate(12)" fill="#D6336C"/>
    <path d="M 120 70 C 120 50 95 40 70 55 C 45 70 45 105 75 130 L 120 160 L 165 130 C 195 105 195 70 170 55 C 145 40 120 50 120 70 Z" transform="scale(0.35) translate(1300, 160) rotate(-8)" fill="#D6336C"/>
    <!-- Footer floating small hearts -->
    <path d="M 120 70 C 120 50 95 40 70 55 C 45 70 45 105 75 130 L 120 160 L 165 130 C 195 105 195 70 170 55 C 145 40 120 50 120 70 Z" transform="scale(0.3) translate(300, 5600) rotate(20)" fill="#D6336C"/>
    <path d="M 120 70 C 120 50 95 40 70 55 C 45 70 45 105 75 130 L 120 160 L 165 130 C 195 105 195 70 170 55 C 145 40 120 50 120 70 Z" transform="scale(0.35) translate(1350, 5650) rotate(-15)" fill="#D6336C"/>
    <path d="M 120 70 C 120 50 95 40 70 55 C 45 70 45 105 75 130 L 120 160 L 165 130 C 195 105 195 70 170 55 C 145 40 120 50 120 70 Z" transform="scale(0.25) translate(800, 5800) rotate(5)" fill="#D6336C"/>
  `;

  const hati4x1 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1800">
    <defs>
      ${maskCutout4x1(true)}
    </defs>
    <rect width="600" height="1800" fill="#FBD9E4" mask="url(#cutout)" />
    ${heartAccents4x1}
    <!-- Slot heart stroke borders -->
    ${slots4x1.map(s => `
      <g transform="translate(${s.x}, ${s.y})">
        <path d="M 260 85 C 260 25 180 5 110 45 C 30 90 25 185 120 260 L 260 345 L 400 260 C 495 185 490 90 410 45 C 340 5 260 25 260 85 Z" fill="none" stroke="#D6336C" stroke-width="4"/>
      </g>
    `).join('\n')}
    <text x="300" y="1725" font-family="Caveat" font-weight="700" font-size="44" fill="#D6336C" text-anchor="middle">untuk kita</text>
  </svg>`;

  const hati2x2 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1200">
    <defs>
      ${maskCutout2x2(true)}
    </defs>
    <rect width="1800" height="1200" fill="#FBD9E4" mask="url(#cutout)" />
    ${slots2x2.map(s => `
      <g transform="translate(${s.x}, ${s.y})">
        <path d="M 414 135 C 414 40 286 8 175 72 C 48 143 40 295 191 414 L 414 550 L 637 414 C 788 295 780 143 653 72 C 542 8 414 40 414 135 Z" fill="none" stroke="#D6336C" stroke-width="4"/>
      </g>
    `).join('\n')}
    <text x="900" y="1185" font-family="Caveat" font-weight="700" font-size="40" fill="#D6336C" text-anchor="middle">untuk kita</text>
  </svg>`;

  const heartSlots4x1 = slots4x1.map(s => ({ ...s, shape: "heart" }));
  const heartSlots2x2 = slots2x2.map(s => ({ ...s, shape: "heart" }));

  await saveTemplate('hati', {
    json: {
      id: "hati",
      name: "Hati",
      category: "cinta",
      layouts: ["4x1", "2x2"],
      canvas: { "4x1": [600, 1800], "2x2": [1800, 1200] },
      slots: { "4x1": heartSlots4x1, "2x2": heartSlots2x2 },
      bg: "#FBD9E4",
      footerText: "untuk kita"
    },
    svg4x1: hati4x1,
    svg2x2: hati2x2,
    isHeart: true
  });

  // ==========================================
  // 9. Peringatan Kuning (Task 12)
  // ==========================================
  function generateCautionPattern(id) {
    return `
    <pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="20" height="40" fill="#FFD21F"/>
      <rect x="20" width="20" height="40" fill="#111111"/>
    </pattern>`;
  }

  const peringatan4x1 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1800">
    <defs>
      ${maskCutout4x1(false)}
      <clipPath id="clipPeringatan">
        <rect width="600" height="1800"/>
      </clipPath>
      ${generateCautionPattern('cautionStripes')}
    </defs>
    <rect width="600" height="1800" fill="#111111" mask="url(#cutout)" />

    <!-- Caution ribbon headers and footers rotated -8 deg -->
    <g clip-path="url(#clipPeringatan)">
      <g transform="translate(300, 90) rotate(-8)">
        <rect x="-400" y="-27" width="800" height="54" fill="url(#cautionStripes)" stroke="#FFD21F" stroke-width="2"/>
      </g>
      <g transform="translate(300, 1710) rotate(-8)">
        <rect x="-400" y="-27" width="800" height="54" fill="url(#cautionStripes)" stroke="#FFD21F" stroke-width="2"/>
      </g>
    </g>

    <!-- Header badge on top of ribbon -->
    <g transform="translate(300, 90)">
      <rect x="-190" y="-24" width="380" height="48" rx="6" fill="#FFD21F" stroke="#111111" stroke-width="3"/>
      <text x="0" y="9" font-family="Inter" font-weight="900" font-size="28" fill="#111111" letter-spacing="3" text-anchor="middle">AWAS KEBAHAGIAAN</text>
    </g>

    <!-- Slot frames 4px yellow -->
    ${slots4x1.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="none" stroke="#FFD21F" stroke-width="4" />`).join('\n')}

    <!-- Footer caution sign + VIRTUALAN -->
    <g transform="translate(300, 1710)">
      <rect x="-120" y="-22" width="240" height="44" rx="6" fill="#111111" stroke="#FFD21F" stroke-width="2"/>
      <!-- Warning triangle -->
      <polygon points="-80,8 -92,-14 -68,-14" fill="#FFD21F"/>
      <text x="-80" y="3" font-family="Inter" font-weight="900" font-size="16" fill="#111111" text-anchor="middle">!</text>
      <text x="12" y="8" font-family="Inter" font-weight="900" font-size="24" letter-spacing="5" fill="#FFD21F" text-anchor="middle">VIRTUALAN</text>
    </g>
  </svg>`;

  await saveTemplate('peringatan-kuning', {
    json: {
      id: "peringatan-kuning",
      name: "Peringatan Kuning",
      category: "lucu",
      layouts: ["4x1"],
      canvas: { "4x1": [600, 1800] },
      slots: { "4x1": slots4x1 },
      bg: "#111111",
      footerText: "AWAS KEBAHAGIAAN • VIRTUALAN"
    },
    svg4x1: peringatan4x1,
    isHeart: false
  });

  // ==========================================
  // 10. Polkadot Safari (Task 13)
  // ==========================================
  let dots = '';
  for (let y = 40; y < 1800; y += 120) {
    for (let x = 40; x < 600; x += 120) {
      dots += `<circle cx="${x}" cy="${y}" r="32" fill="#A8C6E8" opacity="0.85"/>\n`;
      dots += `<circle cx="${x + 60}" cy="${y + 60}" r="32" fill="#A8C6E8" opacity="0.85"/>\n`;
    }
  }

  const polkadot4x1 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1800">
    <defs>
      ${maskCutout4x1(false)}
    </defs>
    <g mask="url(#cutout)">
      <rect width="600" height="1800" fill="#8A5A3B" />
      ${dots}
    </g>
    <!-- Slot frames cream 6px rounded 14 -->
    ${slots4x1.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="14" fill="none" stroke="#F3E5CF" stroke-width="6" />`).join('\n')}
    <text x="300" y="1720" font-family="Inter" font-weight="800" font-size="26" letter-spacing="8" fill="#F3E5CF" text-anchor="middle">VIRTUALAN</text>
  </svg>`;

  await saveTemplate('polkadot', {
    json: {
      id: "polkadot",
      name: "Polkadot Safari",
      category: "pola",
      layouts: ["4x1"],
      canvas: { "4x1": [600, 1800] },
      slots: { "4x1": slots4x1 },
      bg: "#8A5A3B",
      footerText: "VIRTUALAN"
    },
    svg4x1: polkadot4x1,
    isHeart: false
  });

  // ==========================================
  // 11. Musiman: Tahun Baru (Task 14)
  // ==========================================
  const confettiPieces = [];
  const confettiColors = ['#E8C468', '#C0C6D4', '#FFFFFF'];
  const confettiCoords = [
    [50, 40, 8, 0], [180, 70, 12, 1], [320, 30, 7, 0], [450, 80, 10, 2], [540, 50, 9, 1],
    [80, 120, 11, 2], [510, 130, 8, 0], [30, 500, 10, 1], [570, 520, 12, 0],
    [30, 870, 8, 2], [570, 890, 11, 1], [30, 1240, 9, 0], [570, 1250, 10, 2],
    [60, 1640, 12, 0], [150, 1690, 8, 1], [250, 1650, 10, 2], [350, 1660, 11, 0],
    [480, 1680, 9, 1], [530, 1640, 10, 2], [90, 1740, 7, 0], [500, 1750, 12, 1],
    [200, 1760, 8, 2], [410, 1760, 9, 0]
  ];

  const confettiSvg = confettiCoords.map(([x, y, r, cIdx]) => {
    const col = confettiColors[cIdx];
    return `<circle cx="${x}" cy="${y}" r="${r/2}" fill="${col}"/>
            <polygon points="${x},${y-r} ${x+r/3},${y-r/3} ${x+r},${y} ${x+r/3},${y+r/3} ${x},${y+r} ${x-r/3},${y+r/3} ${x-r},${y} ${x-r/3},${y-r/3}" fill="${col}" opacity="0.8"/>`;
  }).join('\n');

  const musiman4x1 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1800">
    <defs>
      ${maskCutout4x1(false)}
    </defs>
    <rect width="600" height="1800" fill="#10182B" mask="url(#cutout)" />
    <!-- Confetti in header & footer areas -->
    ${confettiSvg}
    <!-- Header title -->
    <text x="300" y="115" font-family="Inter" font-weight="800" font-size="40" letter-spacing="6" fill="#E8C468" text-anchor="middle">TAHUN BARU</text>
    <line x1="220" y1="135" x2="380" y2="135" stroke="#C0C6D4" stroke-width="2" />
    <!-- Slot frames 3px gold -->
    ${slots4x1.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="none" stroke="#E8C468" stroke-width="3" />`).join('\n')}
    <text x="300" y="1725" font-family="Inter" font-weight="800" font-size="24" letter-spacing="8" fill="#C0C6D4" text-anchor="middle">VIRTUALAN</text>
  </svg>`;

  await saveTemplate('musiman-tahun-baru', {
    json: {
      id: "musiman-tahun-baru",
      name: "Musiman: Tahun Baru",
      category: "musiman",
      layouts: ["4x1"],
      canvas: { "4x1": [600, 1800] },
      slots: { "4x1": slots4x1 },
      bg: "#10182B",
      footerText: "TAHUN BARU • VIRTUALAN",
      seasonal: true
    },
    svg4x1: musiman4x1,
    isHeart: false
  });

  // ==========================================
  // 12. Snoopy (Task 15)
  // ==========================================
  const snoopyHeaderIllustration = `
    <!-- Lying snoopy on roof/ground above slot 1 -->
    <g transform="translate(240, 100)">
      <!-- Stars & flowers around -->
      <polygon points="120,-30 124,-18 136,-18 126,-10 130,2 120,-6 110,2 114,-10 104,-18 116,-18" fill="#F2B33D"/>
      <polygon points="-120,-20 -117,-10 -107,-10 -115,-4 -112,6 -120,-1 -128,6 -125,-4 -133,-10 -123,-10" fill="#F2B33D"/>
      <circle cx="-60" cy="-40" r="4" fill="#F2789F"/>
      <circle cx="80" cy="-45" r="4" fill="#F2789F"/>
      <!-- Snoopy lying down -->
      <!-- Body -->
      <ellipse cx="20" cy="10" rx="45" ry="24" fill="#FFFFFF" stroke="#20242A" stroke-width="3"/>
      <!-- Black spot on back -->
      <ellipse cx="25" cy="0" rx="14" ry="10" fill="#20242A"/>
      <!-- Paws forward -->
      <ellipse cx="65" cy="20" rx="12" ry="7" fill="#FFFFFF" stroke="#20242A" stroke-width="3"/>
      <!-- Paws back -->
      <ellipse cx="-20" cy="20" rx="12" ry="7" fill="#FFFFFF" stroke="#20242A" stroke-width="3"/>
      <!-- Head resting on front paws -->
      <ellipse cx="80" cy="5" rx="26" ry="18" fill="#FFFFFF" stroke="#20242A" stroke-width="3"/>
      <!-- Snout nose -->
      <ellipse cx="104" cy="5" rx="5" ry="6" fill="#20242A"/>
      <!-- Smiling eye closed -->
      <path d="M 82 2 Q 87 -3 92 2" fill="none" stroke="#20242A" stroke-width="3" stroke-linecap="round"/>
      <!-- Black floppy ear -->
      <path d="M 64 2 C 55 15 52 35 60 40 C 68 42 74 30 72 10 Z" fill="#20242A"/>
    </g>
  `;

  const snoopyFooterIllustration = `
    <!-- Paper boat with Snoopy & friend under moon & stars -->
    <g transform="translate(180, 1695)">
      <!-- Crescent moon -->
      <path d="M -90 -35 A 24 24 0 0 0 -70 5 A 28 28 0 1 1 -90 -35 Z" fill="#F2B33D"/>
      <polygon points="-40,-25 -38,-17 -30,-17 -36,-12 -34,-4 -40,-9 -46,-4 -44,-12 -50,-17 -42,-17" fill="#F2B33D"/>
      <polygon points="120,-30 122,-24 128,-24 123,-20 125,-14 120,-18 115,-14 117,-20 112,-24 118,-24" fill="#F2B33D"/>
      <!-- Paper boat -->
      <polygon points="-60,35 60,35 90,65 -90,65" fill="#FFFFFF" stroke="#20242A" stroke-width="3"/>
      <polygon points="0,5 -50,35 50,35" fill="#FAF4E8" stroke="#20242A" stroke-width="2"/>
      <!-- Snoopy sitting in boat -->
      <ellipse cx="-15" cy="22" rx="16" ry="12" fill="#FFFFFF" stroke="#20242A" stroke-width="2.5"/>
      <ellipse cx="-12" cy="12" rx="13" ry="10" fill="#FFFFFF" stroke="#20242A" stroke-width="2.5"/>
      <ellipse cx="-24" cy="12" rx="3.5" ry="4" fill="#20242A"/>
      <path d="M -6 12 C -2 18 -4 28 -8 28" fill="#20242A"/>
      <!-- Small friend (Woodstock bird) in front of boat -->
      <ellipse cx="25" cy="22" rx="7" ry="9" fill="#F2B33D" stroke="#20242A" stroke-width="2"/>
      <circle cx="27" cy="14" r="6" fill="#F2B33D" stroke="#20242A" stroke-width="2"/>
      <polygon points="33,14 40,16 33,18" fill="#F08C1E"/>
      <!-- Waves under boat -->
      <path d="M -110 70 Q -80 65 -50 70 T 10 70 T 70 70 T 130 70" fill="none" stroke="#20242A" stroke-width="2.5"/>
    </g>
  `;

  const snoopy4x1 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1800">
    <defs>
      ${maskCutout4x1(false)}
    </defs>
    <rect width="600" height="1800" fill="#FBF6EA" mask="url(#cutout)" />
    ${snoopyHeaderIllustration}
    <!-- Slot frames 3px rounded 10 -->
    ${slots4x1.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="10" fill="none" stroke="#20242A" stroke-width="3" />`).join('\n')}
    ${snoopyFooterIllustration}
    <!-- Footer brand bottom right -->
    <text x="520" y="1775" font-family="Inter" font-weight="800" font-size="18" letter-spacing="4" fill="#8A8171" text-anchor="end">VIRTUALAN</text>
  </svg>`;

  await saveTemplate('snoopy', {
    json: {
      id: "snoopy",
      name: "Snoopy",
      category: "karakter",
      layouts: ["4x1"],
      canvas: { "4x1": [600, 1800] },
      slots: { "4x1": slots4x1 },
      bg: "#FBF6EA",
      footerText: "VIRTUALAN"
    },
    svg4x1: snoopy4x1,
    isHeart: false
  });

  // ==========================================
  // 13. Miffy (Task 16)
  // ==========================================
  const miffyHeaderIllustration = `
    <!-- Header pastel panel -->
    <rect x="0" y="0" width="600" height="170" fill="#FDECEF"/>
    <g transform="translate(480, 85)">
      <!-- Colorful balloons -->
      <path d="M -110 30 Q -95 10 -90 -20" fill="none" stroke="#6B7280" stroke-width="1.5"/>
      <path d="M -100 30 Q -80 0 -60 -35" fill="none" stroke="#6B7280" stroke-width="1.5"/>
      <path d="M -90 30 Q -60 10 -30 -15" fill="none" stroke="#6B7280" stroke-width="1.5"/>
      <ellipse cx="-90" cy="-25" rx="18" ry="22" fill="#F6A8C1"/>
      <ellipse cx="-60" cy="-40" rx="18" ry="22" fill="#8EC9E8"/>
      <ellipse cx="-30" cy="-20" rx="18" ry="22" fill="#F9D976"/>

      <!-- Miffy character -->
      <!-- Dress -->
      <path d="M -30 25 L -45 65 L 15 65 L 0 25 Z" fill="#F08C1E" stroke="#141414" stroke-width="2.5"/>
      <!-- Body collar -->
      <ellipse cx="-15" cy="25" rx="8" ry="4" fill="#FFFFFF" stroke="#141414" stroke-width="2"/>
      <!-- Head -->
      <ellipse cx="-15" cy="5" rx="28" ry="22" fill="#FFFFFF" stroke="#141414" stroke-width="3"/>
      <!-- Long ears -->
      <ellipse cx="-28" cy="-35" rx="9" ry="26" fill="#FFFFFF" stroke="#141414" stroke-width="3"/>
      <ellipse cx="-2" cy="-35" rx="9" ry="26" fill="#FFFFFF" stroke="#141414" stroke-width="3"/>
      <!-- Eyes dots -->
      <circle cx="-25" cy="3" r="3" fill="#141414"/>
      <circle cx="-5" cy="3" r="3" fill="#141414"/>
      <!-- 'x' mouth and nose -->
      <line x1="-18" y1="12" x2="-12" y2="18" stroke="#141414" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="-12" y1="12" x2="-18" y2="18" stroke="#141414" stroke-width="2.5" stroke-linecap="round"/>
    </g>
    <!-- Friendly text in header panel -->
    <text x="140" y="95" font-family="Caveat" font-weight="700" font-size="46" fill="#C48AA0">halo, teman!</text>
  `;

  const miffy4x1 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1800">
    <defs>
      ${maskCutout4x1(false)}
    </defs>
    <rect width="600" height="1800" fill="#FDFDFB" mask="url(#cutout)" />
    ${miffyHeaderIllustration}
    <!-- Slot frames pink 4px rounded 12 -->
    ${slots4x1.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="12" fill="none" stroke="#E8B4C4" stroke-width="4" />`).join('\n')}
    <!-- Footer pastel panel -->
    <rect x="0" y="1626" width="600" height="174" fill="#FDECEF"/>
    <text x="300" y="1720" font-family="Inter" font-weight="800" font-size="24" letter-spacing="8" fill="#C48AA0" text-anchor="middle">VIRTUALAN</text>
  </svg>`;

  await saveTemplate('miffy', {
    json: {
      id: "miffy",
      name: "Miffy",
      category: "karakter",
      layouts: ["4x1"],
      canvas: { "4x1": [600, 1800] },
      slots: { "4x1": slots4x1 },
      bg: "#FDFDFB",
      footerText: "VIRTUALAN"
    },
    svg4x1: miffy4x1,
    isHeart: false
  });

  // ==========================================
  // 14. Koran Musik: About You (Task 17)
  // ==========================================
  const koranSlots = GEOMETRY.layouts['koran'].slots;
  const sBig = koranSlots[0];   // 70, 430, 640x427
  const sSmall = koranSlots[1]; // 750, 430, 380x253

  const koranCutoutMask = `
    <mask id="cutoutKoran">
      <rect width="1200" height="1600" fill="white" />
      <rect x="${sBig.x}" y="${sBig.y}" width="${sBig.w}" height="${sBig.h}" fill="black" />
      <rect x="${sSmall.x}" y="${sSmall.y}" width="${sSmall.w}" height="${sSmall.h}" fill="black" />
    </mask>
  `;

  const koranMusikSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600">
    <defs>
      ${koranCutoutMask}
    </defs>
    <rect width="1200" height="1600" fill="#F7F2E7" mask="url(#cutoutKoran)" />

    <!-- Masthead -->
    <text x="600" y="105" font-family="Playfair Display" font-style="italic" font-weight="400" font-size="54" fill="#141414" text-anchor="middle">The 1975</text>
    <line x1="70" y1="135" x2="1130" y2="135" stroke="#141414" stroke-width="3" />

    <!-- Headline -->
    <text x="600" y="270" font-family="Playfair Display" font-weight="900" font-size="118" letter-spacing="4" fill="#141414" text-anchor="middle">ABOUT YOU</text>

    <!-- Quote line -->
    <text x="600" y="350" font-family="Playfair Display" font-style="italic" font-size="34" fill="#141414" text-anchor="middle">"DO YOU THINK I HAVE FORGOTTEN ABOUT YOU?"</text>
    <line x1="70" y1="385" x2="1130" y2="385" stroke="#141414" stroke-width="1.5" />

    <!-- Photo slot frames 3px -->
    <rect x="${sBig.x}" y="${sBig.y}" width="${sBig.w}" height="${sBig.h}" fill="none" stroke="#141414" stroke-width="3" />
    <rect x="${sSmall.x}" y="${sSmall.y}" width="${sSmall.w}" height="${sSmall.h}" fill="none" stroke="#141414" stroke-width="3" />
    <!-- Caption under small slot -->
    <text x="${sSmall.x}" y="${sSmall.y + sSmall.h + 35}" font-family="Inter" font-weight="600" font-size="20" fill="#141414">masih tentangmu.</text>

    <!-- Decorative column divider -->
    <line x1="70" y1="890" x2="1130" y2="890" stroke="#141414" stroke-width="1" />

    <!-- 2 Column Article (y 920-1160) -->
    <line x1="600" y1="920" x2="600" y2="1160" stroke="#141414" stroke-width="1" stroke-dasharray="4 4" />
    <!-- Column 1 -->
    <text x="70" y="960" font-family="Inter" font-size="24" fill="#141414">
      <tspan x="70" dy="0">Lagu About You menceritakan tentang nostalgia</tspan>
      <tspan x="70" dy="38">dan kerinduan seseorang terhadap mantan</tspan>
      <tspan x="70" dy="38">kekasihnya — tentang ingatan yang tidak</tspan>
      <tspan x="70" dy="38">benar-benar pergi dari relung hati.</tspan>
    </text>
    <!-- Column 2 -->
    <text x="630" y="960" font-family="Inter" font-size="24" fill="#141414">
      <tspan x="630" dy="0">Sebuah potret perasaan tentang seseorang yang</tspan>
      <tspan x="630" dy="38">diam-diam masih berharap diingat kembali,</tspan>
      <tspan x="630" dy="38">terukir dalam melodi abadi dan kenangan</tspan>
      <tspan x="630" dy="38">bersama di setiap bait nada.</tspan>
    </text>

    <!-- Footer zone (y 1460-1560) -->
    <line x1="70" y1="1480" x2="1130" y2="1480" stroke="#141414" stroke-width="3" />
    <text x="600" y="1535" font-family="Inter" font-weight="800" font-size="24" letter-spacing="8" fill="#141414" text-anchor="middle">VIRTUALAN • EDISI MUSIK</text>
  </svg>`;

  await saveTemplate('koran-musik', {
    json: {
      id: "koran-musik",
      name: "Koran Musik: About You",
      category: "koran",
      layouts: ["koran"],
      canvas: { "koran": [1200, 1600] },
      slots: { "koran": koranSlots },
      bg: "#F7F2E7",
      footerText: "VIRTUALAN • EDISI MUSIK"
    },
    svgKoran: koranMusikSvg,
    isHeart: false
  });

  console.log('Templates 8 to 14 built.');
}

buildTemplates8To14().catch(console.error);
