import React, { useState, useEffect } from 'react';
import { useT } from '../i18n';
import { type SavedStrip, listStrips, deleteStrip } from '../services/db';
import { CtaButton, GhostButton } from '../components/Buttons';
import { Modal, Toast } from '../components/Modal';

interface CollectionPageProps {
  onGoHome: () => void;
  onRefreshCount: () => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  onGoHome,
  onRefreshCount,
}) => {
  const { t } = useT();
  const [strips, setStrips] = useState<SavedStrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStrip, setSelectedStrip] = useState<SavedStrip | null>(null);
  const [stripToDelete, setStripToDelete] = useState<SavedStrip | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const items = await listStrips();
      setStrips(items);
      onRefreshCount();
    } catch (err) {
      console.error('Failed to load strips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDownload = (strip: SavedStrip) => {
    const url = URL.createObjectURL(strip.pngBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `virtualan-strip-${strip.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConfirmDelete = async () => {
    if (!stripToDelete) return;
    try {
      await deleteStrip(stripToDelete.id);
      setStripToDelete(null);
      setSelectedStrip(null);
      setToastMsg(t.collection.deletedSuccess);
      setTimeout(() => setToastMsg(null), 2000);
      loadData();
    } catch (err) {
      console.error('Failed to delete strip:', err);
    }
  };

  return (
    <div style={{ padding: '0 20px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Toast message={toastMsg} />

      {/* Header Info */}
      <div>
        <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#111827', marginBottom: '8px' }}>
          {t.collection.title}
        </h1>
        <div style={{
          backgroundColor: '#F3F4F6',
          borderRadius: '16px',
          padding: '12px 16px',
          fontSize: '12px',
          color: '#4B5563',
          lineHeight: 1.5,
        }}>
          💡 {t.collection.disclaimer}
        </div>
      </div>

      {/* Strips Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF' }}>
          {t.common.loading}
        </div>
      ) : strips.length === 0 ? (
        <div className="virtualan-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '42px', marginBottom: '12px' }}>🎞️</div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>
            {t.collection.emptyTitle}
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
            {t.collection.emptyDesc}
          </p>
          <CtaButton onClick={onGoHome}>
            {t.collection.createFirst}
          </CtaButton>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14px',
        }}>
          {strips.map((s) => {
            const thumbUrl = URL.createObjectURL(s.thumbBlob);
            const dateStr = new Date(s.createdAt).toLocaleDateString();
            return (
              <div
                key={s.id}
                onClick={() => setSelectedStrip(s)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #EFEDEA',
                  borderRadius: '18px',
                  padding: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <img
                  src={thumbUrl}
                  alt={`Strip ${s.id}`}
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'contain',
                    borderRadius: '10px',
                    backgroundColor: '#F9FAFB',
                  }}
                  loading="lazy"
                />
                <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 700, color: '#6B7280' }}>
                  {dateStr}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Strip Detail Modal */}
      {selectedStrip && (
        <Modal
          isOpen={!!selectedStrip}
          onClose={() => setSelectedStrip(null)}
          title={selectedStrip.templateId}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <img
              src={URL.createObjectURL(selectedStrip.pngBlob)}
              alt="Strip Detail"
              style={{
                maxHeight: '380px',
                maxWidth: '100%',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }}
            />
            <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
              <CtaButton onClick={() => handleDownload(selectedStrip)} style={{ flex: 1 }}>
                📥 {t.collection.downloadBtn}
              </CtaButton>
              <GhostButton
                onClick={() => setStripToDelete(selectedStrip)}
                style={{ flex: 1, color: '#DC2626', borderColor: '#FCA5A5' }}
              >
                🗑️ {t.collection.deleteBtn}
              </GhostButton>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {stripToDelete && (
        <Modal
          isOpen={!!stripToDelete}
          onClose={() => setStripToDelete(null)}
          title={t.collection.deleteConfirmTitle}
        >
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '20px' }}>
            {t.collection.deleteConfirmDesc}
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <GhostButton onClick={() => setStripToDelete(null)} style={{ flex: 1 }}>
              {t.common.cancel}
            </GhostButton>
            <CtaButton
              onClick={handleConfirmDelete}
              style={{ flex: 1, backgroundColor: '#DC2626' }}
            >
              {t.collection.deleteBtn}
            </CtaButton>
          </div>
        </Modal>
      )}
    </div>
  );
};
