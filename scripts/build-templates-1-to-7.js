const {
  saveTemplate,
  maskCutout4x1,
  maskCutout2x2,
  generatePerforations4x1,
  generatePerforations2x2,
  GEOMETRY
} = require('./template-builder');

async function buildTemplates1To7() {
  console.log('Building templates 1 to 7...');

  // ==========================================
  // 1. Film Hitam (Task 4)
  // ==========================================
  const slots4x1 = GEOMETRY.layouts['4x1'].slots;
  const slots2x2 = GEOMETRY.layouts['2x2'].slots;

  const filmHitam4x1 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1800">
    <defs>
      ${maskCutout4x1(false)}
    </defs>
    <!-- Background with cutout -->
    <rect width="600" height="1800" fill="#141414" mask="url(#cutout)" />
    <!-- Perforations -->
    ${generatePerforations4x1('#F5F2EA')}
    <!-- Slot borders 4px white -->
    ${slots4x1.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="none" stroke="#FFFFFF" stroke-width="4" />`).join('\n')}
    <!-- Footer brand -->
    <text x="300" y="1720" font-family="Inter" font-weight="800" font-size="28" letter-spacing="8" fill="#FFFFFF" text-anchor="middle">VIRTUALAN</text>
  </svg>`;

  const filmHitam2x2 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1200">
    <defs>
      ${maskCutout2x2(false)}
    </defs>
    <rect width="1800" height="1200" fill="#141414" mask="url(#cutout)" />
    ${generatePerforations2x2('#F5F2EA')}
    ${slots2x2.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="none" stroke="#FFFFFF" stroke-width="4" />`).join('\n')}
    <text x="900" y="1175" font-family="Inter" font-weight="800" font-size="24" letter-spacing="8" fill="#FFFFFF" text-anchor="middle">VIRTUALAN</text>
  </svg>`;

  await saveTemplate('film-hitam', {
    json: {
      id: "film-hitam",
      name: "Film Hitam",
      category: "klasik",
      layouts: ["4x1", "2x2"],
      canvas: { "4x1": [600, 1800], "2x2": [1800, 1200] },
      slots: { "4x1": slots4x1, "2x2": slots2x2 },
      bg: "#141414",
      footerText: "VIRTUALAN"
    },
    svg4x1: filmHitam4x1,
    svg2x2: filmHitam2x2,
    isHeart: false
  });

  // ==========================================
  // 2. Film Putih (Task 5)
  // ==========================================
  const filmPutih4x1 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1800">
    <defs>
      ${maskCutout4x1(false)}
    </defs>
    <rect width="600" height="1800" fill="#FAF8F3" mask="url(#cutout)" />
    ${generatePerforations4x1('#D9D5CB')}
    ${slots4x1.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="none" stroke="#CFC9BB" stroke-width="3" />`).join('\n')}
    <text x="300" y="1720" font-family="Inter" font-weight="800" font-size="28" letter-spacing="8" fill="#8A8171" text-anchor="middle">VIRTUALAN</text>
  </svg>`;

  const filmPutih2x2 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1200">
    <defs>
      ${maskCutout2x2(false)}
    </defs>
    <rect width="1800" height="1200" fill="#FAF8F3" mask="url(#cutout)" />
    ${generatePerforations2x2('#D9D5CB')}
    ${slots2x2.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="none" stroke="#CFC9BB" stroke-width="3" />`).join('\n')}
    <text x="900" y="1175" font-family="Inter" font-weight="800" font-size="24" letter-spacing="8" fill="#8A8171" text-anchor="middle">VIRTUALAN</text>
  </svg>`;

  await saveTemplate('film-putih', {
    json: {
      id: "film-putih",
      name: "Film Putih",
      category: "klasik",
      layouts: ["4x1", "2x2"],
      canvas: { "4x1": [600, 1800], "2x2": [1800, 1200] },
      slots: { "4x1": slots4x1, "2x2": slots2x2 },
      bg: "#FAF8F3",
      footerText: "VIRTUALAN"
    },
    svg4x1: filmPutih4x1,
    svg2x2: filmPutih2x2,
    isHeart: false
  });

  // ==========================================
  // 3. Polos Krem (Task 6)
  // ==========================================
  const polosKrem4x1 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1800">
    <defs>
      ${maskCutout4x1(false)}
      <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#000000" flood-opacity="0.12" />
      </filter>
    </defs>
    <rect width="600" height="1800" fill="#F7F1E3" mask="url(#cutout)" />
    ${slots4x1.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="1.5" filter="url(#softShadow)" />`).join('\n')}
    <text x="300" y="1685" font-family="Caveat" font-weight="700" font-size="40" fill="#6B5E4F" text-anchor="middle">hari ini, kita.</text>
    <text x="300" y="1735" font-family="Inter" font-weight="800" font-size="24" letter-spacing="6" fill="#B09A7A" text-anchor="middle">VIRTUALAN</text>
  </svg>`;

  const polosKrem2x2 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1200">
    <defs>
      ${maskCutout2x2(false)}
      <filter id="softShadow2" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#000000" flood-opacity="0.12" />
      </filter>
    </defs>
    <rect width="1800" height="1200" fill="#F7F1E3" mask="url(#cutout)" />
    ${slots2x2.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="1.5" filter="url(#softShadow2)" />`).join('\n')}
    <text x="750" y="1185" font-family="Caveat" font-weight="700" font-size="34" fill="#6B5E4F" text-anchor="middle">hari ini, kita.</text>
    <text x="1050" y="1185" font-family="Inter" font-weight="800" font-size="22" letter-spacing="6" fill="#B09A7A" text-anchor="middle">VIRTUALAN</text>
  </svg>`;

  await saveTemplate('polos-krem', {
    json: {
      id: "polos-krem",
      name: "Polos Krem",
      category: "klasik",
      layouts: ["4x1", "2x2"],
      canvas: { "4x1": [600, 1800], "2x2": [1800, 1200] },
      slots: { "4x1": slots4x1, "2x2": slots2x2 },
      bg: "#F7F1E3",
      footerText: "hari ini, kita. VIRTUALAN"
    },
    svg4x1: polosKrem4x1,
    svg2x2: polosKrem2x2,
    isHeart: false
  });

  // ==========================================
  // 4. Koran Harian (Task 7)
  // ==========================================
  const koranHarian4x1 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1800">
    <defs>
      ${maskCutout4x1(false)}
    </defs>
    <rect width="600" height="1800" fill="#FDFBF4" mask="url(#cutout)" />
    <!-- Header decorations -->
    <line x1="40" y1="45" x2="560" y2="45" stroke="#141414" stroke-width="3" />
    <line x1="40" y1="52" x2="560" y2="52" stroke="#141414" stroke-width="1" />
    <text x="300" y="115" font-family="Playfair Display" font-weight="900" font-size="64" fill="#141414" text-anchor="middle">KABAR HARI INI</text>
    <line x1="40" y1="130" x2="560" y2="130" stroke="#141414" stroke-width="1" />
    <text x="300" y="155" font-family="Inter" font-weight="600" font-size="20" fill="#C0392B" letter-spacing="2" text-anchor="middle">EDISI HARI INI • SPESIAL DUA ORANG</text>
    <line x1="40" y1="168" x2="560" y2="168" stroke="#141414" stroke-width="2" />

    <!-- Slot frames 3px ink -->
    ${slots4x1.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="none" stroke="#141414" stroke-width="3" />`).join('\n')}

    <!-- Footer decorations -->
    <line x1="40" y1="1640" x2="560" y2="1640" stroke="#141414" stroke-width="3" />
    <line x1="40" y1="1647" x2="560" y2="1647" stroke="#141414" stroke-width="1" />
    <text x="300" y="1695" font-family="Playfair Display" font-style="italic" font-size="34" fill="#141414" text-anchor="middle">"Hari ini milik kita."</text>
    <text x="300" y="1745" font-family="Inter" font-weight="800" font-size="22" letter-spacing="6" fill="#C0392B" text-anchor="middle">VIRTUALAN</text>
  </svg>`;

  const koranHarian2x2 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1200">
    <defs>
      ${maskCutout2x2(false)}
    </defs>
    <rect width="1800" height="1200" fill="#FDFBF4" mask="url(#cutout)" />
    <!-- Header top -->
    <line x1="60" y1="20" x2="1740" y2="20" stroke="#141414" stroke-width="3" />
    <line x1="60" y1="26" x2="1740" y2="26" stroke="#141414" stroke-width="1" />
    <text x="900" y="42" font-family="Playfair Display" font-weight="900" font-size="22" fill="#141414" text-anchor="middle">KABAR HARI INI • EDISI HARI INI • SPESIAL DUA ORANG</text>

    <!-- Slot frames 3px ink -->
    ${slots2x2.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="none" stroke="#141414" stroke-width="3" />`).join('\n')}

    <!-- Footer bottom -->
    <line x1="60" y1="1185" x2="1740" y2="1185" stroke="#141414" stroke-width="2" />
    <text x="600" y="1198" font-family="Playfair Display" font-style="italic" font-size="18" fill="#141414" text-anchor="middle">"Hari ini milik kita."</text>
    <text x="1200" y="1198" font-family="Inter" font-weight="800" font-size="16" letter-spacing="6" fill="#C0392B" text-anchor="middle">VIRTUALAN</text>
  </svg>`;

  await saveTemplate('koran-harian', {
    json: {
      id: "koran-harian",
      name: "Koran Harian",
      category: "koran",
      layouts: ["4x1", "2x2"],
      canvas: { "4x1": [600, 1800], "2x2": [1800, 1200] },
      slots: { "4x1": slots4x1, "2x2": slots2x2 },
      bg: "#FDFBF4",
      footerText: "Hari ini milik kita. VIRTUALAN"
    },
    svg4x1: koranHarian4x1,
    svg2x2: koranHarian2x2,
    isHeart: false
  });

  // ==========================================
  // 5. Senja (Task 8)
  // ==========================================
  const senja4x1 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1800">
    <defs>
      ${maskCutout4x1(false)}
      <linearGradient id="senjaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#F6B17A" />
        <stop offset="55%" stop-color="#EE7B9B" />
        <stop offset="100%" stop-color="#7E6BA8" />
      </linearGradient>
    </defs>
    <!-- Background with cutout -->
    <rect width="600" height="1800" fill="url(#senjaGrad)" mask="url(#cutout)" />

    <!-- Wave layers at bottom (y 1560-1800) -->
    <path d="M 0 1670 Q 150 1630 300 1670 T 600 1670 L 600 1800 L 0 1800 Z" fill="#5B4A8A" opacity="0.9" />
    <path d="M 0 1710 Q 150 1680 300 1710 T 600 1710 L 600 1800 L 0 1800 Z" fill="#463A6E" />

    <!-- Slot frames with rounded corners 12 -->
    ${slots4x1.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="12" fill="none" stroke="#FFF7EC" stroke-width="4" />`).join('\n')}

    <!-- Footer brand -->
    <text x="300" y="1760" font-family="Inter" font-weight="800" font-size="26" letter-spacing="8" fill="#FFF7EC" text-anchor="middle">VIRTUALAN</text>
  </svg>`;

  const senja2x2 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1200">
    <defs>
      ${maskCutout2x2(false)}
      <linearGradient id="senjaGrad2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#F6B17A" />
        <stop offset="55%" stop-color="#EE7B9B" />
        <stop offset="100%" stop-color="#7E6BA8" />
      </linearGradient>
    </defs>
    <rect width="1800" height="1200" fill="url(#senjaGrad2)" mask="url(#cutout)" />
    <!-- Wave layers -->
    <path d="M 0 1140 Q 450 1110 900 1140 T 1800 1140 L 1800 1200 L 0 1200 Z" fill="#5B4A8A" opacity="0.9" />
    <path d="M 0 1165 Q 450 1140 900 1165 T 1800 1165 L 1800 1200 L 0 1200 Z" fill="#463A6E" />
    ${slots2x2.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="12" fill="none" stroke="#FFF7EC" stroke-width="4" />`).join('\n')}
    <text x="900" y="1188" font-family="Inter" font-weight="800" font-size="20" letter-spacing="8" fill="#FFF7EC" text-anchor="middle">VIRTUALAN</text>
  </svg>`;

  await saveTemplate('senja', {
    json: {
      id: "senja",
      name: "Senja",
      category: "warna",
      layouts: ["4x1", "2x2"],
      canvas: { "4x1": [600, 1800], "2x2": [1800, 1200] },
      slots: { "4x1": slots4x1, "2x2": slots2x2 },
      bg: "#EE7B9B",
      footerText: "VIRTUALAN"
    },
    svg4x1: senja4x1,
    svg2x2: senja2x2,
    isHeart: false
  });

  // ==========================================
  // 6. Pita Biru (Task 9)
  // ==========================================
  const pitaBiru4x1 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1800">
    <defs>
      ${maskCutout4x1(false)}
      <clipPath id="canvasClip">
        <rect width="600" height="1800" />
      </clipPath>
    </defs>
    <rect width="600" height="1800" fill="#2456A6" mask="url(#cutout)" />

    <!-- Ribbons in header and footer rotated -6 deg -->
    <g clip-path="url(#canvasClip)">
      <!-- Header ribbon -->
      <g transform="translate(300, 90) rotate(-6)">
        <rect x="-400" y="-28" width="800" height="56" fill="#F2C230" />
        <text x="0" y="9" font-family="Inter" font-weight="800" font-size="26" letter-spacing="4" fill="#141414" text-anchor="middle">MOMEN KITA ★ MOMEN KITA ★</text>
      </g>
      <!-- Footer ribbon -->
      <g transform="translate(300, 1710) rotate(-6)">
        <rect x="-400" y="-28" width="800" height="56" fill="#F2C230" />
        <text x="0" y="9" font-family="Inter" font-weight="800" font-size="26" letter-spacing="4" fill="#141414" text-anchor="middle">MOMEN KITA ★ MOMEN KITA ★</text>
      </g>
    </g>

    <!-- Slot frames 5px white -->
    ${slots4x1.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="none" stroke="#FFFFFF" stroke-width="5" />`).join('\n')}
  </svg>`;

  await saveTemplate('pita-biru', {
    json: {
      id: "pita-biru",
      name: "Pita Biru",
      category: "warna",
      layouts: ["4x1"],
      canvas: { "4x1": [600, 1800] },
      slots: { "4x1": slots4x1 },
      bg: "#2456A6",
      footerText: "MOMEN KITA"
    },
    svg4x1: pitaBiru4x1,
    isHeart: false
  });

  // ==========================================
  // 7. Marun Script (Task 10)
  // ==========================================
  const marunScript4x1 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1800">
    <defs>
      ${maskCutout4x1(false)}
    </defs>
    <rect width="600" height="1800" fill="#5E2129" mask="url(#cutout)" />

    <!-- Header script -->
    <text x="300" y="105" font-family="Caveat" font-weight="700" font-size="84" fill="#F3D9CF" text-anchor="middle">kita</text>
    <line x1="200" y1="135" x2="400" y2="135" stroke="#C9A227" stroke-width="2" />

    <!-- Slot frames 3px -->
    ${slots4x1.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="none" stroke="#E8CFC0" stroke-width="3" />`).join('\n')}

    <!-- Footer brand -->
    <text x="300" y="1720" font-family="Inter" font-weight="800" font-size="26" letter-spacing="8" fill="#C9A227" text-anchor="middle">VIRTUALAN</text>
  </svg>`;

  await saveTemplate('marun-script', {
    json: {
      id: "marun-script",
      name: "Marun Script",
      category: "elegan",
      layouts: ["4x1"],
      canvas: { "4x1": [600, 1800] },
      slots: { "4x1": slots4x1 },
      bg: "#5E2129",
      footerText: "kita • VIRTUALAN"
    },
    svg4x1: marunScript4x1,
    isHeart: false
  });

  console.log('Templates 1 to 7 built.');
}

buildTemplates1To7().catch(console.error);
