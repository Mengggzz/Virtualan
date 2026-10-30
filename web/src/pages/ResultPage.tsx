import React, { useState } from 'react';
import { useT } from '../i18n';
import { CtaButton, GhostButton } from '../components/Buttons';
import { Toast } from '../components/Modal';

interface ResultPageProps {
  pngBlob: Blob;
  onMakeAnother: () => void;
  onGoHome: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  pngBlob,
  onMakeAnother,
  onGoHome,
}) => {
  const { t } = useT();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const imgUrl = URL.createObjectURL(pngBlob);

  const generateFilename = () => {
    const now = new Date();
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const ymd = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    const hms = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    return `virtualan-strip-${ymd}-${hms}.png`;
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = generateFilename();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setToastMsg(t.result.downloadSuccess);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleShare = async () => {
    const filename = generateFilename();
    const file = new File([pngBlob], filename, { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'Virtualan Strip',
          text: 'Lihat photobooth strip kita dari Virtualan!',
          files: [file],
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleDownload();
        }
      }
    } else {
      // Fallback: download automatically
      handleDownload();
    }
  };

  return (
    <div style={{ padding: '0 20px 32px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <Toast message={toastMsg} />

      {/* Saved badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: '#DCF5E5',
        color: '#15803D',
        fontSize: '13px',
        fontWeight: 800,
        padding: '6px 16px',
        borderRadius: '9999px',
        marginTop: '8px',
      }}>
        <span>✓</span>
        <span>{t.result.savedBadge}</span>
      </div>

      <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#111827', textAlign: 'center' }}>
        {t.result.title}
      </h1>

      {/* Strip Result Preview */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '16px',
        border: '1px solid #EFEDEA',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        maxWidth: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <img
          src={imgUrl}
          alt="Hasil Strip"
          style={{
            maxHeight: '440px',
            maxWidth: '100%',
            objectFit: 'contain',
            borderRadius: '12px',
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <CtaButton onClick={handleDownload}>
          📥 {t.result.downloadPng}
        </CtaButton>
        <GhostButton onClick={handleShare}>
          📤 {t.result.share}
        </GhostButton>
        <GhostButton onClick={onMakeAnother} style={{ border: 'none', color: '#4B5563', textDecoration: 'underline' }}>
          {t.result.createAnother}
        </GhostButton>
        <GhostButton onClick={onGoHome} style={{ border: 'none', color: '#9CA3AF' }}>
          {t.result.backHome}
        </GhostButton>
      </div>
    </div>
  );
};
