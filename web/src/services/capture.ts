/**
 * Capture single frame from video element with 3:4 portrait center-crop
 */
export async function captureFrame(videoEl: HTMLVideoElement): Promise<Blob> {
  const vWidth = videoEl.videoWidth || 1280;
  const vHeight = videoEl.videoHeight || 960;

  // Target aspect ratio 3:4 (width:height)
  const targetAspect = 3 / 4;
  let cropWidth = vWidth;
  let cropHeight = vWidth / targetAspect;

  if (cropHeight > vHeight) {
    cropHeight = vHeight;
    cropWidth = vHeight * targetAspect;
  }

  const cropX = (vWidth - cropWidth) / 2;
  const cropY = (vHeight - cropHeight) / 2;

  // Output resolution: up to 1080x1440
  const outWidth = Math.min(1080, Math.round(cropWidth));
  const outHeight = Math.min(1440, Math.round(cropHeight));

  const canvas = document.createElement('canvas');
  canvas.width = outWidth;
  canvas.height = outHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Failed to get 2d context for camera capture');

  // If video is mirrored (user facing camera), mirror the context
  ctx.save();
  ctx.drawImage(
    videoEl,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    outWidth,
    outHeight
  );
  ctx.restore();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob returned null'));
      },
      'image/jpeg',
      0.92
    );
  });
}
