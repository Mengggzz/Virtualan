const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const sharp = require('sharp');

const ASSETS_DIR = path.resolve(__dirname, '../assets');
const FONTS_DIR = path.resolve(ASSETS_DIR, 'fonts');
const TEMPLATES_DIR = path.resolve(ASSETS_DIR, 'templates');
const GEOMETRY = JSON.parse(fs.readFileSync(path.resolve(ASSETS_DIR, 'geometry.json'), 'utf8'));

// Render SVG to PNG Buffer with custom fonts
function svgToPng(svgStr, opts = {}) {
  const resvg = new Resvg(svgStr, {
    font: {
      fontDirs: [FONTS_DIR],
      loadSystemFonts: false,
      defaultFontFamily: 'Inter',
    },
    ...opts
  });
  return resvg.render().asPng();
}

// Generate sample colored photos for thumbnail composite
async function createSampleComposite4x1(frameBuffer, isHeart = false) {
  const slots = GEOMETRY.layouts['4x1'].slots;
  const colors = ['#E29578', '#83C5BE', '#FFDDD2', '#006D77'];
  const photoOverlays = [];

  for (let i = 0; i < 4; i++) {
    const s = slots[i];
    let photoSvg;
    if (isHeart) {
      // heart clipped photo
      photoSvg = `
      <svg width="${s.w}" height="${s.h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="h">
            <path d="M 260 90 C 260 30 180 10 110 50 C 40 90 40 180 130 250 L 260 340 L 390 250 C 480 180 480 90 410 50 C 340 10 260 30 260 90 Z" />
          </clipPath>
        </defs>
        <rect width="${s.w}" height="${s.h}" fill="${colors[i]}" clip-path="url(#h)" />
        <circle cx="${s.w/2}" cy="${s.h/2 - 20}" r="60" fill="white" opacity="0.3" clip-path="url(#h)" />
        <circle cx="${s.w/2}" cy="${s.h + 20}" r="110" fill="white" opacity="0.3" clip-path="url(#h)" />
      </svg>`;
    } else {
      photoSvg = `
      <svg width="${s.w}" height="${s.h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${s.w}" height="${s.h}" fill="${colors[i]}" />
        <!-- Person silhouettes -->
        <circle cx="${s.w*0.3}" cy="${s.h*0.4}" r="50" fill="white" opacity="0.35"/>
        <path d="M ${s.w*0.1} ${s.h} C ${s.w*0.1} ${s.h*0.6} ${s.w*0.5} ${s.h*0.6} ${s.w*0.5} ${s.h} Z" fill="white" opacity="0.35"/>
        <circle cx="${s.w*0.7}" cy="${s.h*0.4}" r="50" fill="white" opacity="0.45"/>
        <path d="M ${s.w*0.5} ${s.h} C ${s.w*0.5} ${s.h*0.6} ${s.w*0.9} ${s.h*0.6} ${s.w*0.9} ${s.h} Z" fill="white" opacity="0.45"/>
      </svg>`;
    }
    const buf = svgToPng(photoSvg);
    photoOverlays.push({ input: buf, top: s.y, left: s.x });
  }

  // Base canvas behind frame
  const base = sharp({
    create: {
      width: 600,
      height: 1800,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  });

  // Layer photos then frame on top
  const full = await base
    .composite([
      ...photoOverlays,
      { input: frameBuffer, top: 0, left: 0 }
    ])
    .png()
    .toBuffer();

  // Resize to thumb 200x600
  return sharp(full).resize(200, 600).png().toBuffer();
}

async function createSampleComposite2x2(frameBuffer, isHeart = false) {
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
            <path d="M ${s.w/2} 140 C ${s.w/2} 40 ${s.w*0.3} 10 ${s.w*0.18} 70 C ${s.w*0.05} 130 ${s.w*0.05} 270 ${s.w*0.2} 370 L ${s.w/2} 530 L ${s.w*0.8} 370 C ${s.w*0.95} 270 ${s.w*0.95} 130 ${s.w*0.82} 70 C ${s.w*0.7} 10 ${s.w/2} 40 ${s.w/2} 140 Z" />
          </clipPath>
        </defs>
        <rect width="${s.w}" height="${s.h}" fill="${colors[i]}" clip-path="url(#h)" />
        <circle cx="${s.w/2}" cy="${s.h*0.4}" r="90" fill="white" opacity="0.3" clip-path="url(#h)" />
      </svg>`;
    } else {
      photoSvg = `
      <svg width="${s.w}" height="${s.h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${s.w}" height="${s.h}" fill="${colors[i]}" />
        <circle cx="${s.w*0.3}" cy="${s.h*0.4}" r="75" fill="white" opacity="0.35"/>
        <path d="M ${s.w*0.1} ${s.h} C ${s.w*0.1} ${s.h*0.6} ${s.w*0.5} ${s.h*0.6} ${s.w*0.5} ${s.h} Z" fill="white" opacity="0.35"/>
        <circle cx="${s.w*0.7}" cy="${s.h*0.4}" r="75" fill="white" opacity="0.45"/>
        <path d="M ${s.w*0.5} ${s.h} C ${s.w*0.5} ${s.h*0.6} ${s.w*0.9} ${s.h*0.6} ${s.w*0.9} ${s.h} Z" fill="white" opacity="0.45"/>
      </svg>`;
    }
    const buf = svgToPng(photoSvg);
    photoOverlays.push({ input: buf, top: s.y, left: s.x });
  }

  const base = sharp({
    create: {
      width: 1800,
      height: 1200,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  });

  const full = await base
    .composite([
      ...photoOverlays,
      { input: frameBuffer, top: 0, left: 0 }
    ])
    .png()
    .toBuffer();

  return sharp(full).resize(450, 300).png().toBuffer();
}

async function createSampleCompositeKoran(frameBuffer) {
  const slots = GEOMETRY.layouts['koran'].slots;
  const colors = ['#9A8C98', '#C9ADA7'];
  const photoOverlays = [];

  for (let i = 0; i < 2; i++) {
    const s = slots[i];
    const photoSvg = `
    <svg width="${s.w}" height="${s.h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${s.w}" height="${s.h}" fill="${colors[i]}" />
      <circle cx="${s.w*0.5}" cy="${s.h*0.4}" r="${s.h*0.25}" fill="white" opacity="0.4"/>
    </svg>`;
    const buf = svgToPng(photoSvg);
    photoOverlays.push({ input: buf, top: s.y, left: s.x });
  }

  const base = sharp({
    create: {
      width: 1200,
      height: 1600,
      channels: 4,
      background: { r: 247, g: 242, b: 231, alpha: 1 }
    }
  });

  const full = await base
    .composite([
      ...photoOverlays,
      { input: frameBuffer, top: 0, left: 0 }
    ])
    .png()
    .toBuffer();

  return sharp(full).resize(300, 400).png().toBuffer();
}

console.log('Template generator base helper loaded.');
