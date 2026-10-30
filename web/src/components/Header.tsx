import React from 'react';
import { useT } from '../i18n';

interface HeaderProps {
  collectionCount?: number;
  onOpenCollection?: () => void;
  onGoHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  collectionCount = 0,
  onOpenCollection,
  onGoHome,
}) => {
  const { lang, toggleLang } = useT();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      backgroundColor: 'transparent',
      zIndex: 10,
    }}>
      {/* Brand logo + text */}
      <button
        onClick={onGoHome}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
        title="Virtualan Home"
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          backgroundColor: '#0B0B12',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 900,
          fontSize: '18px',
          letterSpacing: '-1px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        }}>
          V.
        </div>
        <span style={{
          fontSize: '20px',
          fontWeight: 900,
          color: '#111827',
          letterSpacing: '-0.5px',
        }}>
          Virtualan.
        </span>
      </button>

      {/* Right actions: Collection badge + EN/ID toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Collection button */}
        <button
          onClick={onOpenCollection}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #EFEDEA',
            borderRadius: '9999px',
            padding: '8px 14px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#111827',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            transition: 'all 0.15s ease',
          }}
          title="Lihat Koleksi"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          {collectionCount > 0 && (
            <span style={{
              backgroundColor: '#F2789F',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '2px 7px',
              fontSize: '11px',
              fontWeight: 800,
              minWidth: '18px',
              textAlign: 'center',
            }}>
              {collectionCount}
            </span>
          )}
        </button>

        {/* EN / ID toggle */}
        <button
          onClick={toggleLang}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #EFEDEA',
            borderRadius: '9999px',
            padding: '8px 12px',
            fontSize: '13px',
            fontWeight: 800,
            color: '#4B5563',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            minWidth: '40px',
            textAlign: 'center',
          }}
          title="Ganti Bahasa (Switch Language)"
        >
          {lang === 'id' ? 'EN' : 'ID'}
        </button>
      </div>
    </header>
  );
};
