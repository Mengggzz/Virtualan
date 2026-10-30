import React, { useState } from 'react';
import { useT } from '../i18n';
import { StatusPill } from '../components/StatusPill';
import { GhostButton } from '../components/Buttons';
import { Toast } from '../components/Modal';

interface WaitingPageProps {
  roomCode: string;
  isConnecting?: boolean;
  onCancelRoom: () => void;
}

export const WaitingPage: React.FC<WaitingPageProps> = ({
  roomCode,
  isConnecting = false,
  onCancelRoom,
}) => {
  const { t } = useT();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setToastMsg(t.waiting.copied);
      setTimeout(() => setToastMsg(null), 2500);
    } catch {
      // Fallback
      setToastMsg(roomCode);
      setTimeout(() => setToastMsg(null), 2500);
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
      <Toast message={toastMsg} />

      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <StatusPill
          type={isConnecting ? 'yellow' : 'green'}
          text={isConnecting ? t.waiting.statusConnecting : t.waiting.statusWaiting}
        />
        <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#111827', marginTop: '16px', marginBottom: '8px' }}>
          {t.waiting.title}
        </h1>
        <p style={{ fontSize: '14px', color: '#6B7280', maxWidth: '320px', margin: '0 auto' }}>
          {t.waiting.instruction}
        </p>
      </div>

      {/* Big Code Card */}
      <div
        className="virtualan-card"
        onClick={handleCopyCode}
        style={{
          cursor: 'pointer',
          textAlign: 'center',
          backgroundColor: '#FFFFFF',
          border: '2px dashed #D1D5DB',
          padding: '36px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          transition: 'transform 0.1s ease',
        }}
        title={t.waiting.tapToCopy}
      >
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {t.waiting.tapToCopy}
        </span>
        <div style={{
          fontSize: '44px',
          fontWeight: 900,
          letterSpacing: '8px',
          color: '#0B0B12',
          fontFamily: 'monospace',
          margin: '6px 0',
        }}>
          {roomCode}
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          fontWeight: 700,
          color: '#F2789F',
        }}>
          <span>📋</span>
          <span>{t.waiting.tapToCopy}</span>
        </div>
      </div>

      {/* Helpful Waiting Notice */}
      <div style={{
        backgroundColor: '#FDECEF',
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}>
        <span style={{ fontSize: '20px' }}>💡</span>
        <p style={{ fontSize: '13px', color: '#9D174D', lineHeight: 1.45, fontWeight: 500 }}>
          {t.tips.waitingTips}
        </p>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
        <GhostButton onClick={onCancelRoom} style={{ width: '100%', color: '#DC2626', borderColor: '#FCA5A5' }}>
          {t.waiting.cancelRoom}
        </GhostButton>
      </div>
    </div>
  );
};
