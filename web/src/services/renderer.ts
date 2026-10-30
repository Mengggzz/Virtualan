import type { TemplateDetail } from './catalog';

export interface StickerPlacement {
  id?: string;
  stickerId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface PhotoSlotItem {
  personA: Blob;
  personB?: Blob;
}

export interface RenderStripOptions {
  photos: PhotoSlotItem[];
  template: TemplateDetail;
  layout: string;
  filterCss?: string;
  stickers?: StickerPlacement[];
}

function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

function urlToImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function drawCenterCrop(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  const imgAspect = img.width / img.height;
  const targetAspect = dw / dh;
  let sx = 0, sy = 0, sw = img.width, sh = img.height;

  if (imgAspect > targetAspect) {
    sw = img.height * targetAspect;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / targetAspect;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

function applyHeartClip(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, _h: number) {
  ctx.beginPath();
  if (w === 520) {
    // 4x1 heart geometry
    ctx.save();
    ctx.translate(x, y);
    // Path: M 260 85 C 260 25 180 5 110 45 C 30 90 25 185 120 260 L 260 345 L 400 260 C 495 185 490 90 410 45 C 340 5 260 25 260 85 Z
    ctx.moveTo(260, 85);
    ctx.bezierCurveTo(260, 25, 180, 5, 110, 45);
    ctx.bezierCurveTo(30, 90, 25, 185, 120, 260);
    ctx.lineTo(260, 345);
    ctx.lineTo(400, 260);
    ctx.bezierCurveTo(495, 185, 490, 90, 410, 45);
    ctx.bezierCurveTo(340, 5, 260, 25, 260, 85);
    ctx.closePath();
    ctx.clip();
  } else {
    // 2x2 heart geometry
    ctx.save();
    ctx.translate(x, y);
    ctx.moveTo(414, 135);
    ctx.bezierCurveTo(414, 40, 286, 8, 175, 72);
    ctx.bezierCurveTo(48, 143, 40, 295, 191, 414);
    ctx.lineTo(414, 550);
    ctx.lineTo(637, 414);
    ctx.bezierCurveTo(788, 295, 780, 143, 653, 72);
    ctx.bezierCurveTo(542, 8, 414, 40, 414, 135);
    ctx.closePath();
    ctx.clip();
  }
}

export async function renderStrip({
  photos,
  template,
  layout,
  filterCss = 'none',
  stickers = [],
}: RenderStripOptions): Promise<Blob> {
  const canvasDims = template.canvas[layout] || [600, 1800];
  const [cWidth, cHeight] = canvasDims;

  const canvas = document.createElement('canvas');
  canvas.width = cWidth;
  canvas.height = cHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2d context for renderStrip');

  // Fill default background if specified
  ctx.fillStyle = template.bg || '#FFFFFF';
  ctx.fillRect(0, 0, cWidth, cHeight);

  // 1. Draw photo slots
  const slots = template.slots[layout] || [];

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const photoItem = photos[i];
    if (!photoItem || !photoItem.personA) continue;

    const imgA = await blobToImage(photoItem.personA);
    const imgB = photoItem.personB ? await blobToImage(photoItem.personB) : null;

    ctx.save();

    // Apply CSS filter
    try {
      ctx.filter = filterCss;
    } catch {
      console.warn('ctx.filter is not supported in this environment');
    }

    const isHeart = slot.shape === 'heart' || template.id === 'hati';

    if (isHeart) {
      applyHeartClip(ctx, slot.x, slot.y, slot.w, slot.h);
    }

    if (!imgB) {
      // Solo mode: draw single person center cropped to slot
      const targetX = isHeart ? 0 : slot.x;
      const targetY = isHeart ? 0 : slot.y;
      drawCenterCrop(ctx, imgA, targetX, targetY, slot.w, slot.h);
    } else {
      // Duo mode: subslots person A & B
      if (layout === '4x1') {
        const subW = 256;
        const subGap = 8;
        const targetX = isHeart ? 0 : slot.x;
        const targetY = isHeart ? 0 : slot.y;
        // Person A (left)
        drawCenterCrop(ctx, imgA, targetX, targetY, subW, slot.h);
        // Person B (right)
        drawCenterCrop(ctx, imgB, targetX + subW + subGap, targetY, subW, slot.h);
      } else if (layout === '2x2') {
        const subW = 408;
        const subGap = 12;
        const targetX = isHeart ? 0 : slot.x;
        const targetY = isHeart ? 0 : slot.y;
        drawCenterCrop(ctx, imgA, targetX, targetY, subW, slot.h);
        drawCenterCrop(ctx, imgB, targetX + subW + subGap, targetY, subW, slot.h);
      } else {
        // Fallback or koran
        const targetX = isHeart ? 0 : slot.x;
        const targetY = isHeart ? 0 : slot.y;
        drawCenterCrop(ctx, imgA, targetX, targetY, slot.w, slot.h);
      }
    }

    ctx.restore();
  }

  // 2. Draw Frame Overlay
  const frameFileName = layout === 'koran' ? 'frame-koran.png' : `frame-${layout}.png`;
  const frameUrl = `/assets/templates/${template.id}/${frameFileName}`;

  try {
    const frameImg = await urlToImage(frameUrl);
    ctx.drawImage(frameImg, 0, 0, cWidth, cHeight);
  } catch (err) {
    console.error(`Failed to load overlay: ${frameUrl}`, err);
  }

  // 3. Draw Stickers
  for (const st of stickers) {
    const stickerUrl = `/assets/stickers/${st.stickerId}.png`;
    try {
      const stickerImg = await urlToImage(stickerUrl);
      ctx.save();
      ctx.translate(st.x, st.y);
      ctx.rotate((st.rotation * Math.PI) / 180);
      ctx.scale(st.scale, st.scale);

      const sWidth = stickerImg.width || 512;
      const sHeight = stickerImg.height || 512;
      ctx.drawImage(stickerImg, -sWidth / 2, -sHeight / 2, sWidth, sHeight);
      ctx.restore();
    } catch (err) {
      console.error(`Failed to load sticker: ${stickerUrl}`, err);
    }
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to generate PNG blob from canvas'));
      },
      'image/png',
      1.0
    );
  });
}

export async function createThumbnail(pngBlob: Blob, targetWidth = 360): Promise<Blob> {
  const img = await blobToImage(pngBlob);
  const targetHeight = Math.round((targetWidth / img.width) * img.height);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2d context for thumbnail');

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create thumbnail blob'));
      },
      'image/png',
      0.9
    );
  });
}
