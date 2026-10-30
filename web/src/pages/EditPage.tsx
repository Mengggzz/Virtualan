import React, { useState, useEffect } from 'react';
import { useT } from '../i18n';
import { type Catalog, type TemplateDetail, loadTemplateDetail } from '../services/catalog';
import { renderStrip, type StickerPlacement, type PhotoSlotItem } from '../services/renderer';
import { CtaButton, GhostButton } from '../components/Buttons';
import { Modal } from '../components/Modal';

interface EditPageProps {
  photos: PhotoSlotItem[];
  templateId: string;
  layout: string;
  catalog: Catalog;
  isHost?: boolean;
  onFinalize: (finalPngBlob: Blob) => void;
  onRetakeSlot?: (slotIndex: number) => void;
  onRetakeAll: () => void;
  // Shared edit sync
  sharedEditState?: {
    filterId: string;
    stickers: StickerPlacement[];
    photoOrder: number[];
  };
  onBroadcastEditState?: (state: any) => void;
}

export const EditPage: React.FC<EditPageProps> = ({
  photos: initialPhotos,
  templateId,
  layout,
  catalog,
  isHost = true,
  onFinalize,
  onRetakeAll,
  sharedEditState,
  onBroadcastEditState,
}) => {
  const { t } = useT();

  const [photos, setPhotos] = useState<PhotoSlotItem[]>(initialPhotos);
  const [templateDetail, setTemplateDetail] = useState<TemplateDetail | null>(null);

  // Tabs: 'filter' | 'stickers'
  const [activeTab, setActiveTab] = useState<'filter' | 'stickers'>('filter');
  const [activeFilterId, setActiveFilterId] = useState<string>('asli');
  const [stickers, setStickers] = useState<StickerPlacement[]>([]);
  const [activeStickerCategory, setActiveStickerCategory] = useState<string>('hewan-ekspresi');

  // Preview PNG blob
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(false);

  // Confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isFinalizing, setIsFinalizing] = useState<boolean>(false);

  // Load template detail
  useEffect(() => {
    loadTemplateDetail(templateId)
      .then(setTemplateDetail)
      .catch(console.error);
  }, [templateId]);

  // Sync with shared edit state if provided (Duo)
  useEffect(() => {
    if (sharedEditState) {
      setActiveFilterId(sharedEditState.filterId);
      setStickers(sharedEditState.stickers);
    }
  }, [sharedEditState]);

  // Re-render strip preview whenever photos, filter, or stickers change
  useEffect(() => {
    if (!templateDetail || photos.length === 0) return;

    let isMounted = true;
    setIsRendering(true);

    const filterObj = catalog.filters.find((f) => f.id === activeFilterId);
    const cssFilter = filterObj ? filterObj.cssFilter : 'none';

    renderStrip({
      photos,
      template: templateDetail,
      layout,
      filterCss: cssFilter,
      stickers,
    })
      .then((blob) => {
        if (!isMounted) return;
        const url = URL.createObjectURL(blob);
        setPreviewBlobUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        setIsRendering(false);
      })
      .catch((err) => {
        console.error('Preview render error:', err);
        if (isMounted) setIsRendering(false);
      });

    return () => {
      isMounted = false;
    };
  }, [photos, templateDetail, layout, activeFilterId, stickers, catalog.filters]);

  // Swap photo slots
  const handleSwapSlots = (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx || fromIdx < 0 || toIdx < 0 || fromIdx >= photos.length || toIdx >= photos.length) return;
    const newPhotos = [...photos];
    const temp = newPhotos[fromIdx];
    newPhotos[fromIdx] = newPhotos[toIdx];
    newPhotos[toIdx] = temp;
    setPhotos(newPhotos);
    broadcastEdit(activeFilterId, stickers);
  };

  const handleSelectFilter = (fId: string) => {
    setActiveFilterId(fId);
    broadcastEdit(fId, stickers);
  };

  // Add sticker at center of strip
  const handleAddSticker = (sId: string) => {
    const canvasDims = templateDetail?.canvas[layout] || [600, 1800];
    const newSticker: StickerPlacement = {
      id: `stk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      stickerId: sId,
      x: canvasDims[0] / 2,
      y: 120 + Math.random() * 200,
      scale: 0.35,
      rotation: Math.round((Math.random() - 0.5) * 20),
    };
    const nextStickers = [...stickers, newSticker];
    setStickers(nextStickers);
    broadcastEdit(activeFilterId, nextStickers);
  };

  const handleRemoveSticker = (idx: number) => {
    const nextStickers = stickers.filter((_, i) => i !== idx);
    setStickers(nextStickers);
    broadcastEdit(activeFilterId, nextStickers);
  };

  const broadcastEdit = (fId: string, stks: StickerPlacement[]) => {
    if (onBroadcastEditState) {
      onBroadcastEditState({
        filterId: fId,
        stickers: stks,
      });
    }
  };

  const handleConfirmFinalize = async () => {
    if (!templateDetail) return;
    setIsFinalizing(true);

    const filterObj = catalog.filters.find((f) => f.id === activeFilterId);
    const cssFilter = filterObj ? filterObj.cssFilter : 'none';

    try {
      const fullBlob = await renderStrip({
        photos,
        template: templateDetail,
        layout,
        filterCss: cssFilter,
        stickers,
      });
      setShowConfirmModal(false);
      onFinalize(fullBlob);
    } catch (err) {
      console.error('Final render failed:', err);
    } finally {
      setIsFinalizing(false);
    }
  };

  // Categories for stickers
  const stickerCategories = [
    { id: 'hewan-ekspresi', name: 'Hewan' },
    { id: 'dekorasi', name: 'Dekorasi' },
    { id: 'makanan', name: 'Makanan' },
    { id: 'teks-tempel', name: 'Teks' },
    { id: 'karakter', name: 'Karakter' },
  ];

  const filteredStickers = catalog.stickers.filter(
    (s) => s.category === activeStickerCategory
  );

  return (
    <div style={{ padding: '0 16px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Strip Preview Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '20px 10px',
        border: '1px solid #EFEDEA',
        boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
        position: 'relative',
        minHeight: '380px',
      }}>
        {previewBlobUrl ? (
          <img
            src={previewBlobUrl}
            alt="Strip Preview"
            style={{
              maxHeight: '360px',
              maxWidth: '90%',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
          />
        ) : (
          <div style={{ color: '#9CA3AF', fontSize: '14px', fontWeight: 600 }}>
            {t.common.loading}
          </div>
        )}

        {isRendering && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '9999px',
            backdropFilter: 'blur(4px)',
          }}>
            ⚡ Memperbarui pratinjau...
          </div>
        )}
      </div>

      {/* Slots Quick Actions: Swap & Retake */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        padding: '12px 16px',
        border: '1px solid #EFEDEA',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 800, color: '#374151' }}>
          {t.edit.dragHint}
        </span>
        <button
          onClick={onRetakeAll}
          style={{
            background: 'none',
            border: 'none',
            color: '#DC2626',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          ↺ {t.edit.retakeAll}
        </button>
      </div>

      {/* Photo Slot Pills for reorder & individual retake */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {photos.map((_, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '14px',
              padding: '8px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#111827' }}>
              #{idx + 1}
            </span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
              {idx > 0 && (
                <button
                  onClick={() => handleSwapSlots(idx, idx - 1)}
                  style={{ background: '#F3F4F6', border: 'none', borderRadius: '6px', padding: '3px 6px', fontSize: '11px', cursor: 'pointer' }}
                  title="Geser ke kiri"
                >
                  ◀
                </button>
              )}
              {idx < photos.length - 1 && (
                <button
                  onClick={() => handleSwapSlots(idx, idx + 1)}
                  style={{ background: '#F3F4F6', border: 'none', borderRadius: '6px', padding: '3px 6px', fontSize: '11px', cursor: 'pointer' }}
                  title="Geser ke kanan"
                >
                  ▶
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Tabs: Filter vs Stickers */}
      <div className="virtualan-card" style={{ padding: '16px' }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #EFEDEA',
          paddingBottom: '12px',
          marginBottom: '14px',
        }}>
          <button
            onClick={() => setActiveTab('filter')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '14px',
              fontWeight: 800,
              backgroundColor: activeTab === 'filter' ? '#0B0B12' : '#F3F4F6',
              color: activeTab === 'filter' ? '#FFFFFF' : '#6B7280',
              cursor: 'pointer',
            }}
          >
            🎨 {t.edit.tabFilter}
          </button>
          <button
            onClick={() => setActiveTab('stickers')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '14px',
              fontWeight: 800,
              backgroundColor: activeTab === 'stickers' ? '#0B0B12' : '#F3F4F6',
              color: activeTab === 'stickers' ? '#FFFFFF' : '#6B7280',
              cursor: 'pointer',
            }}
          >
            ✨ {t.edit.tabSticker} {stickers.length > 0 && `(${stickers.length})`}
          </button>
        </div>

        {/* Tab 1: Filters */}
        {activeTab === 'filter' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
          }}>
            {catalog.filters.map((flt) => {
              const isSelected = flt.id === activeFilterId;
              return (
                <button
                  key={flt.id}
                  onClick={() => handleSelectFilter(flt.id)}
                  style={{
                    backgroundColor: isSelected ? '#FDECEF' : '#FFFFFF',
                    border: isSelected ? '2px solid #F2789F' : '1px solid #EFEDEA',
                    borderRadius: '14px',
                    padding: '10px 4px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#E5E7EB',
                    margin: '0 auto 6px',
                    filter: flt.cssFilter,
                  }} />
                  <span style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: isSelected ? 800 : 600,
                    color: isSelected ? '#F2789F' : '#374151',
                  }}>
                    {flt.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab 2: Stickers */}
        {activeTab === 'stickers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Category pills */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px' }}>
              {stickerCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveStickerCategory(cat.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    backgroundColor: activeStickerCategory === cat.id ? '#F2789F' : '#F3F4F6',
                    color: activeStickerCategory === cat.id ? '#FFFFFF' : '#4B5563',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Sticker grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              maxHeight: '180px',
              overflowY: 'auto',
            }}>
              {filteredStickers.map((stk) => (
                <button
                  key={stk.id}
                  onClick={() => handleAddSticker(stk.id)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EFEDEA',
                    borderRadius: '14px',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title={stk.name}
                >
                  <img
                    src={`/assets/stickers/${stk.id}.png`}
                    alt={stk.name}
                    style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                    loading="lazy"
                  />
                  <span style={{ fontSize: '10px', fontWeight: 600, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                    {stk.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Active pasted stickers list */}
            {stickers.length > 0 && (
              <div style={{ borderTop: '1px solid #EFEDEA', paddingTop: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', marginBottom: '6px', display: 'block' }}>
                  Stiker Terpasang (Ketuk untuk hapus):
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {stickers.map((st, i) => (
                    <button
                      key={i}
                      onClick={() => handleRemoveSticker(i)}
                      style={{
                        backgroundColor: '#FDECEF',
                        border: '1px solid #F9A8D4',
                        borderRadius: '9999px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#BE185D',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{st.stickerId}</span>
                      <span>×</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Finalize Button */}
      <CtaButton
        onClick={() => setShowConfirmModal(true)}
        disabled={!isHost || isRendering}
      >
        {t.edit.makeStrip}
      </CtaButton>

      {/* Finalize Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={t.edit.confirmTitle}
      >
        <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.5, marginBottom: '20px' }}>
          {t.edit.confirmDesc}
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <GhostButton onClick={() => setShowConfirmModal(false)} style={{ flex: 1 }}>
            {t.edit.confirmNo}
          </GhostButton>
          <CtaButton onClick={handleConfirmFinalize} disabled={isFinalizing} style={{ flex: 1 }}>
            {isFinalizing ? t.edit.rendering : t.edit.confirmYes}
          </CtaButton>
        </div>
      </Modal>
    </div>
  );
};
