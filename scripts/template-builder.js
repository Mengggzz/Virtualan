const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const sharp = require('sharp');

const ASSETS_DIR = path.resolve(__dirname, '../assets');
const FONTS_DIR = path.resolve(ASSETS_DIR, 'fonts');
const TEMPLATES_DIR = path.resolve(ASSETS_DIR, 'templates');
const GEOMETRY = JSON.parse(fs.readFileSync(path.resolve(ASSETS_DIR, 'geometry.json'), 'utf8'));

function svgToPng(svgStr) {
  const resvg = new Resvg(svgStr, {
    font: {
      fontDirs: [FONTS_DIR],
      loadSystemFonts: false,
      defaultFontFamily: 'Inter',
    }
  });
  return resvg.render().asPng();
}

// 4x1 standard slot cutouts mask
function maskCutout4x1(isHeart = false) {
  const slots = GEOMETRY.layouts['4x1'].slots;
  if (!isHeart) {
    const rects = slots.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="black" />`).join('\n');
    return `
    <mask id="cutout">
      <rect width="600" height="1800" fill="white" />
      ${rects}
    </mask>`;
  } else {
    // heart cutout
    const hearts = slots.map(s => `
      <g transform="translate(${s.x}, ${s.y})">
        <path d="M 260 85 C 260 25 180 5 110 45 C 30 90 25 185 120 260 L 260 345 L 400 260 C 495 185 490 90 410 45 C 340 5 260 25 260 85 Z" fill="black"/>
      </g>
    `).join('\n');
    return `
    <mask id="cutout">
      <rect width="600" height="1800" fill="white" />
      ${hearts}
    </mask>`;
  }
}

// 2x2 standard slot cutouts mask
function maskCutout2x2(isHeart = false) {
  const slots = GEOMETRY.layouts['2x2'].slots;
  if (!isHeart) {
    const rects = slots.map(s => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="black" />`).join('\n');
    return `
    <mask id="cutout">
      <rect width="1800" height="1200" fill="white" />
      ${rects}
    </mask>`;
  } else {
    const hearts = slots.map(s => `
      <g transform="translate(${s.x}, ${s.y})">
        <path d="M 414 135 C 414 40 286 8 175 72 C 48 143 40 295 191 414 L 414 550 L 637 414 C 788 295 780 143 653 72 C 542 8 414 40 414 135 Z" fill="black"/>
      </g>
    `).join('\n');
    return `
    <mask id="cutout">
      <rect width="1800" height="1200" fill="white" />
      ${hearts}
    </mask>`;
  }
}

// Perforations generator
function generatePerforations4x1(fillColor) {
  let perf = '';
  for (let y = 30; y < 1780; y += 44) {
    perf += `<rect x="8" y="${y}" width="18" height="26" rx="5" fill="${fillColor}"/>\n`;
    perf += `<rect x="574" y="${y}" width="18" height="26" rx="5" fill="${fillColor}"/>\n`;
  }
  return perf;
}

function generatePerforations2x2(fillColor) {
  let perf = '';
  for (let x = 30; x < 1780; x += 44) {
    perf += `<rect x="${x}" y="8" width="26" height="18" rx="5" fill="${fillColor}"/>\n`;
    perf += `<rect x="${x}" y="1174" width="26" height="18" rx="5" fill="${fillColor}"/>\n`;
  }
  return perf;
}

// Sample photo compositing for thumbs
async function makeThumb4x1(frameBuf, isHeart = false) {
  const slots = GEOMETRY.layouts['4x1'].slots;
  const colors = ['#E29578', '#83C5BE', '#FFDDD2', '#006D77'];
  const photoOverlays = [];

  for (let i = 0; i < 4; i++) {
    const s = slots[i];
    let photoSvg;
    if (isHeart) {
      photoSvg = `
      <svg width="${s.w}" height="${s.h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="h">
            <path d="M 260 85 C 260 25 180 5 110 45 C 30 90 25 185 120 260 L 260 345 L 400 260 C 495 185 490 90 410 45 C 340 5 260 25 260 85 Z" />
          </clipPath>
        </defs>
        <rect width="${s.w}" height="${s.h}" fill="${colors[i]}" clip-path="url(#h)" />
        <circle cx="260" cy="180" r="70" fill="white" opacity="0.4" clip-path="url(#h)" />
      </svg>`;
    } else {
      photoSvg = `
      <svg width="${s.w}" height="${s.h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${s.w}" height="${s.h}" fill="${colors[i]}" />
        <circle cx="160" cy="140" r="55" fill="white" opacity="0.35"/>
        <path d="M 50 347 C 50 220 270 220 270 347 Z" fill="white" opacity="0.35"/>
        <circle cx="360" cy="140" r="55" fill="white" opacity="0.45"/>
        <path d="M 250 347 C 250 220 470 220 470 347 Z" fill="white" opacity="0.45"/>
      </svg>`;
    }
    const buf = svgToPng(photoSvg);
    photoOverlays.push({ input: buf, top: s.y, left: s.x });
  }

  const base = sharp({
    create: { width: 600, height: 1800, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
  });

  const full = await base.composite([...photoOverlays, { input: frameBuf, top: 0, left: 0 }]).png().toBuffer();
  return sharp(full).resize(200, 600).png().toBuffer();
}

async function makeThumb2x2(frameBuf, isHeart = false) {
  const slots = GEOMETRY.layouts['2x2'].slots;
  const colors = ['#E29578', '#83C5BE', '#FFDDD2', '#006D77'];
  const photoOverlays = [];

  for (let i = 0; i < 4; i++) {
    const s = slots[i];
    let photoSvg;
    if (isHeart) {
      photoSvg = `
      <svg width="${s.w}" height="${s.h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="h">
            <path d="M 414 135 C 414 40 286 8 175 72 C 48 143 40 295 191 414 L 414 550 L 637 414 C 788 295 780 143 653 72 C 542 8 414 40 414 135 Z" />
          </clipPath>
        </defs>
        <rect width="${s.w}" height="${s.h}" fill="${colors[i]}" clip-path="url(#h)" />
        <circle cx="414" cy="270" r="110" fill="white" opacity="0.4" clip-path="url(#h)" />
      </svg>`;
    } else {
      photoSvg = `
      <svg width="${s.w}" height="${s.h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${s.w}" height="${s.h}" fill="${colors[i]}" />
        <circle cx="260" cy="220" r="85" fill="white" opacity="0.35"/>
        <path d="M 90 552 C 90 350 430 350 430 552 Z" fill="white" opacity="0.35"/>
        <circle cx="570" cy="220" r="85" fill="white" opacity="0.45"/>
        <path d="M 400 552 C 400 350 740 350 740 552 Z" fill="white" opacity="0.45"/>
      </svg>`;
    }
    const buf = svgToPng(photoSvg);
    photoOverlays.push({ input: buf, top: s.y, left: s.x });
  }

  const base = sharp({
    create: { width: 1800, height: 1200, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
  });

  const full = await base.composite([...photoOverlays, { input: frameBuf, top: 0, left: 0 }]).png().toBuffer();
  return sharp(full).resize(450, 300).png().toBuffer();
}

async function saveTemplate(id, data) {
  const dir = path.join(TEMPLATES_DIR, id);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Save template.json
  fs.writeFileSync(path.join(dir, 'template.json'), JSON.stringify(data.json, null, 2));

  // Render 4x1 or koran
  if (data.svg4x1) {
    const png4x1 = svgToPng(data.svg4x1);
    fs.writeFileSync(path.join(dir, 'frame-4x1.png'), png4x1);
    const thumb4x1 = await makeThumb4x1(png4x1, data.isHeart);
    fs.writeFileSync(path.join(dir, 'thumb-4x1.png'), thumb4x1);
  }

  // Render 2x2 if present
  if (data.svg2x2) {
    const png2x2 = svgToPng(data.svg2x2);
    fs.writeFileSync(path.join(dir, 'frame-2x2.png'), png2x2);
    const thumb2x2 = await makeThumb2x2(png2x2, data.isHeart);
    fs.writeFileSync(path.join(dir, 'thumb-2x2.png'), thumb2x2);
  }

  // Render koran if present
  if (data.svgKoran) {
    const pngKoran = svgToPng(data.svgKoran);
    fs.writeFileSync(path.join(dir, 'frame-koran.png'), pngKoran);

    // Make thumb-koran
    const slots = GEOMETRY.layouts['koran'].slots;
    const colors = ['#9A8C98', '#C9ADA7'];
    const photoOverlays = slots.map((s, idx) => {
      const pSvg = `<svg width="${s.w}" height="${s.h}" xmlns="http://www.w3.org/2000/svg"><rect width="${s.w}" height="${s.h}" fill="${colors[idx]}"/><circle cx="${s.w/2}" cy="${s.h/2}" r="60" fill="white" opacity="0.4"/></svg>`;
      return { input: svgToPng(pSvg), top: s.y, left: s.x };
    });
    const base = sharp({
      create: { width: 1200, height: 1600, channels: 4, background: { r: 247, g: 242, b: 231, alpha: 1 } }
    });
    const full = await base.composite([...photoOverlays, { input: pngKoran, top: 0, left: 0 }]).png().toBuffer();
    const thumbKoran = await sharp(full).resize(300, 400).png().toBuffer();
    fs.writeFileSync(path.join(dir, 'thumb-koran.png'), thumbKoran);
  }

  console.log(`✓ Template ${id} generated successfully.`);
}

module.exports = {
  saveTemplate,
  maskCutout4x1,
  maskCutout2x2,
  generatePerforations4x1,
  generatePerforations2x2,
  GEOMETRY,
};
