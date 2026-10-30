import React, { useState } from 'react';
import { useT } from '../i18n';
import { CtaButton, GhostButton } from '../components/Buttons';

interface HomePageProps {
  onStartSolo: () => void;
  onCreateDuo: () => void;
  onJoinDuo: (code: string) => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  joinError?: string | null;
  isConnecting?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartSolo,
  onCreateDuo,
  onJoinDuo,
  onOpenTerms,
  onOpenPrivacy,
  joinError,
  isConnecting = false,
}) => {
  const { t } = useT();
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    const cleaned = code.trim().toUpperCase();

    if (!cleaned) {
      setLocalError(t.home.codeEmpty);
      return;
    }
    if (cleaned.length !== 6) {
      setLocalError(t.home.codeInvalidLength);
      return;
    }

    onJoinDuo(cleaned);
  };

  const displayError = localError || joinError;

  return (
    <div style={{ padding: '0 20px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero Headline */}
      <div style={{ textAlign: 'center', marginTop: '12px' }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: '#FDECEF',
          color: '#F2789F',
          fontWeight: 800,
          fontSize: '12px',
          padding: '6px 14px',
          borderRadius: '9999px',
          marginBottom: '12px',
          letterSpacing: '0.5px',
        }}>
          {t.home.badge}
        </div>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 900,
          lineHeight: 1.15,
          color: '#111827',
          letterSpacing: '-1px',
          marginBottom: '10px',
        }}>
          {t.home.headline}
        </h1>
        <p style={{
          fontSize: '15px',
          lineHeight: 1.5,
          color: '#6B7280',
          maxWidth: '340px',
          margin: '0 auto',
        }}>
          {t.home.subheadline}
        </p>
      </div>

      {/* Mode Selection Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Solo Card */}
        <div className="virtualan-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              backgroundColor: '#F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}>
              👤
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>{t.home.soloTitle}</h2>
              <p style={{ fontSize: '13px', color: '#6B7280' }}>{t.home.soloDesc}</p>
            </div>
          </div>
          <CtaButton onClick={onStartSolo}>
            {t.home.soloAction}
          </CtaButton>
        </div>

        {/* Duo Card */}
        <div className="virtualan-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              backgroundColor: '#DCF5E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}>
              👥
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>{t.home.duoTitle}</h2>
              <p style={{ fontSize: '13px', color: '#6B7280' }}>{t.home.duoDesc}</p>
            </div>
          </div>

          <CtaButton onClick={onCreateDuo} disabled={isConnecting}>
            {isConnecting ? t.home.connecting : t.home.duoAction}
          </CtaButton>

          {/* Join Room Form */}
          <div style={{ borderTop: '1px solid #EFEDEA', paddingTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>
              {t.home.codeLabel}
            </label>
            <form onSubmit={handleJoin} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setLocalError(null);
                }}
                placeholder={t.home.codePlaceholder}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  borderRadius: '16px',
                  border: displayError ? '2px solid #EF4444' : '1px solid #D1D5DB',
                  fontSize: '16px',
                  fontWeight: 800,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  outline: 'none',
                  backgroundColor: '#FBFAF7',
                }}
              />
              <GhostButton type="submit" disabled={isConnecting} style={{ minWidth: '84px', fontWeight: 800 }}>
                {t.home.joinAction}
              </GhostButton>
            </form>

            {displayError && (
              <div style={{
                marginTop: '8px',
                fontSize: '13px',
                color: '#DC2626',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span>⚠️</span>
                <span>{displayError}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid #EFEDEA',
      }}>
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
          {t.home.footerTagline}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12px', color: '#6B7280' }}>
          <button onClick={onOpenTerms} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', textDecoration: 'underline' }}>
            {t.home.termsLink}
          </button>
          <span>•</span>
          <button onClick={onOpenPrivacy} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', textDecoration: 'underline' }}>
            {t.home.privacyLink}
          </button>
        </div>
      </footer>
    </div>
  );
};
