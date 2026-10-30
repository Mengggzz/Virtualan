import React from 'react';
import { useT } from '../i18n';
import { GhostButton } from '../components/Buttons';

interface StaticPageProps {
  type: 'terms' | 'privacy';
  onBack: () => void;
}

export const StaticPage: React.FC<StaticPageProps> = ({ type, onBack }) => {
  const { t } = useT();

  return (
    <div style={{ padding: '0 20px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          ←
        </button>
        <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#111827' }}>
          {type === 'terms' ? t.static.termsTitle : t.static.privacyTitle}
        </h1>
      </div>

      <div className="virtualan-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', lineHeight: 1.6, fontSize: '14px', color: '#374151' }}>
        {type === 'privacy' ? (
          <>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#111827' }}>
              Prinsip Privasi Mutlak Virtualan
            </h2>
            <p>
              Virtualan dirancang dengan filosofi privasi penuh tanpa akun (guest-first) dan tanpa penyimpanan awan (zero cloud storage).
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Tanpa Akun:</strong> Tidak ada registrasi, login, email, nomor HP, atau data identitas yang diminta.</li>
              <li><strong>Video Tidak Direkam:</strong> Aliran video kamera Anda bersifat langsung (live peer-to-peer) dan tidak pernah direkam atau disimpan di server mana pun.</li>
              <li><strong>Koleksi Lokal:</strong> Hasil foto dan strip hanya tersimpan di IndexedDB browser perangkat Anda.</li>
              <li><strong>Server Sinyal Minimal:</strong> Server hanya berfungsi sebagai relay sinyal koneksi WebRTC (kode ruangan 6 digit) dan status bilik foto. Server tidak pernah menerima atau menyimpan berkas gambar Anda.</li>
              <li><strong>Penghapusan Data:</strong> Anda dapat menghapus strip foto kapan saja melalui tombol Hapus di halaman Koleksi atau dengan membersihkan data situs di browser.</li>
            </ul>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#111827' }}>
              Syarat & Ketentuan Penggunaan
            </h2>
            <p>
              Selamat datang di Virtualan. Dengan menggunakan layanan bilik foto virtual ini, Anda menyetujui ketentuan berikut:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Layanan Gratis:</strong> Semua fitur bilik foto, template, dan stiker disediakan secara gratis tanpa biaya atau watermark tersembunyi.</li>
              <li><strong>Penggunaan Wajar:</strong> Layanan ditujukan untuk hiburan foto pribadi, pasangan jarak jauh (LDR), teman, dan komunitas secara beretika.</li>
              <li><strong>Penyimpanan Perangkat:</strong> Karena seluruh data disimpan di peramban lokal, membersihkan cache/data browser dapat menghapus koleksi strip Anda. Unduh PNG strip untuk penyimpanan permanen.</li>
            </ul>
          </>
        )}
      </div>

      <GhostButton onClick={onBack} style={{ marginTop: '12px' }}>
        {t.common.back}
      </GhostButton>
    </div>
  );
};
