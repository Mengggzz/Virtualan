import React, { useState, useEffect, useRef } from 'react';
import { useT } from '../i18n';
import { type Catalog } from '../services/catalog';
import { CtaButton } from '../components/Buttons';
import { captureFrame } from '../services/capture';

interface BoothPageProps {
  isDuo?: boolean;
  isHost?: boolean;
  catalog: Catalog;
  activeTemplateId: string;
  activeLayout: string;
  onSelectTemplate: (templateId: string, layout: string) => void;
  remoteStream?: MediaStream | null;
  onSessionComplete: (capturedPhotos: Array<{ personA: Blob; personB?: Blob }>) => void;
  onExitBooth: () => void;
  onStartDuoSession?: () => void;
  sessionEndsAt?: number | null;
  onLocalStreamReady?: (stream: MediaStream) => void;
  syncTrigger?: { slot: number; at: number } | null;
  onSendCapturedDuoFrame?: (slot: number, blob: Blob) => void;
  peerCapturedFrame?: { slot: number; blob: Blob } | null;
  onStartDuoNextSlot?: (slot: number) => void;
}

export const BoothPage: React.FC<BoothPageProps> = ({
  isDuo = false,
  isHost = true,
  catalog,
  activeTemplateId,
  activeLayout,
  onSelectTemplate,
  remoteStream,
  onSessionComplete,
  onExitBooth,
  onStartDuoSession,
  sessionEndsAt,
  onLocalStreamReady,
  syncTrigger,
  onSendCapturedDuoFrame,
  peerCapturedFrame,
  onStartDuoNextSlot,
}) => {
  const { t } = useT();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Camera stream state
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraError, setCameraError] = useState<'denied' | 'notfound' | 'inapp' | null>(null);

  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0); // 0 to 3
  const [localCountdown, setLocalCountdown] = useState<number | null>(null);
  const [capturedBlobs, setCapturedBlobs] = useState<Blob[]>([]);
  const [isPosingPause, setIsPosingPause] = useState(false);
  const [flash, setFlash] = useState(false);

  // Duo session state
  const [localDuoBlobs, setLocalDuoBlobs] = useState<Record<number, Blob>>({});
  const [peerDuoBlobs, setPeerDuoBlobs] = useState<Record<number, Blob>>({});
  const [completedDuoSlots, setCompletedDuoSlots] = useState<Record<number, { personA: Blob; personB: Blob }>>({});

  // Timer 5:00
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300);

  // Check camera support & in-app browser
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('inapp');
      return;
    }
    startCamera();

    return () => {
      // Cleanup streams
      if (localStream) {
        localStream.getTracks().forEach((trk) => trk.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: true,
      });
      setLocalStream(stream);
      onLocalStreamReady?.(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('notfound');
      } else {
        setCameraError('denied');
      }
    }
  };

  // Attach remote stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Duo sync: receive peer frame
  useEffect(() => {
    if (peerCapturedFrame) {
      setPeerDuoBlobs((prev) => ({ ...prev, [peerCapturedFrame.slot]: peerCapturedFrame.blob }));
    }
  }, [peerCapturedFrame]);

  // Duo sync: trigger synchronized capture
  useEffect(() => {
    if (!isDuo || !syncTrigger) return;
    const { slot, at } = syncTrigger;
    setIsSessionActive(true);
    setCurrentSlotIndex(slot);
    setIsPosingPause(false);

    const now = Date.now();
    const remainingMs = Math.max(0, at - now);

    setLocalCountdown(3);
    const t2 = setTimeout(() => setLocalCountdown(2), Math.max(100, remainingMs - 2000));
    const t1 = setTimeout(() => setLocalCountdown(1), Math.max(200, remainingMs - 1000));
    const tSnap = setTimeout(async () => {
      setLocalCountdown(null);
      triggerFlash();
      if (localVideoRef.current) {
        try {
          const blob = await captureFrame(localVideoRef.current);
          setLocalDuoBlobs((prev) => ({ ...prev, [slot]: blob }));
          onSendCapturedDuoFrame?.(slot, blob);
        } catch (e) {
          console.error('Capture frame error in duo', e);
        }
      }
    }, remainingMs);

    return () => {
      clearTimeout(t2);
      clearTimeout(t1);
      clearTimeout(tSnap);
    };
  }, [syncTrigger, isDuo, onSendCapturedDuoFrame]);

  // Duo sync: assemble completed pairs
  useEffect(() => {
    if (!isDuo) return;
    const slot = currentSlotIndex;
    const localBlob = localDuoBlobs[slot];
    const peerBlob = peerDuoBlobs[slot];

    if (localBlob && peerBlob && !completedDuoSlots[slot]) {
      const item = isHost
        ? { personA: localBlob, personB: peerBlob }
        : { personA: peerBlob, personB: localBlob };

      const nextCompleted = { ...completedDuoSlots, [slot]: item };
      setCompletedDuoSlots(nextCompleted);

      const count = Object.keys(nextCompleted).length;
      if (count >= 4) {
        const ordered = [nextCompleted[0], nextCompleted[1], nextCompleted[2], nextCompleted[3]];
        setTimeout(() => {
          onSessionComplete(ordered);
        }, 1000);
      } else if (isHost) {
        setIsPosingPause(true);
        setTimeout(() => {
          onStartDuoNextSlot?.(slot + 1);
        }, 2500);
      }
    }
  }, [localDuoBlobs, peerDuoBlobs, currentSlotIndex, isDuo, isHost, completedDuoSlots, onSessionComplete, onStartDuoNextSlot]);

  // Session 5:00 timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (sessionEndsAt) {
        const diff = Math.max(0, Math.floor((sessionEndsAt - Date.now()) / 1000));
        setSecondsRemaining(diff);
        if (diff === 0) {
          alert(t.booth.sessionTimeoutDesc);
          onExitBooth();
        }
      } else if (isSessionActive) {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            alert(t.booth.sessionTimeoutDesc);
            onExitBooth();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionEndsAt, isSessionActive, onExitBooth, t]);

  const toggleMic = () => {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicEnabled(audioTrack.enabled);
    }
  };

  // Solo photo capture sequence
  const startSoloSession = async () => {
    setIsSessionActive(true);
    setCapturedBlobs([]);
    setCurrentSlotIndex(0);
    runSlotSequence(0, []);
  };

  const triggerFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
  };

  const runSlotSequence = (slotIndex: number, currentBlobs: Blob[]) => {
    if (slotIndex >= 4) {
      // All 4 slots captured!
      const items = currentBlobs.map((blob) => ({ personA: blob }));
      onSessionComplete(items);
      return;
    }

    setCurrentSlotIndex(slotIndex);
    setIsPosingPause(false);

    // Countdown 3, 2, 1
    let count = 3;
    setLocalCountdown(count);

    const countInterval = setInterval(async () => {
      count -= 1;
      if (count > 0) {
        setLocalCountdown(count);
      } else {
        clearInterval(countInterval);
        setLocalCountdown(null);

        // SNAP!
        triggerFlash();
        if (localVideoRef.current) {
          try {
            const blob = await captureFrame(localVideoRef.current);
            const nextBlobs = [...currentBlobs, blob];
            setCapturedBlobs(nextBlobs);

            if (slotIndex < 3) {
              // 2.5s pose pause
              setIsPosingPause(true);
              setTimeout(() => {
                runSlotSequence(slotIndex + 1, nextBlobs);
              }, 2500);
            } else {
              // Final photo captured
              setTimeout(() => {
                const items = nextBlobs.map((b) => ({ personA: b }));
                onSessionComplete(items);
              }, 800);
            }
          } catch (err) {
            console.error('Capture frame failed:', err);
          }
        }
      }
    }, 1000);
  };

  // Format seconds to mm:ss
  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Filter templates matching current layout
  const matchingTemplates = catalog.templates.filter((tmpl) =>
    tmpl.layouts.includes(activeLayout)
  );

  return (
    <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Flash overlay */}
      {flash && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#FFFFFF',
          zIndex: 999,
          pointerEvents: 'none',
          animation: 'fadeOut 0.2s ease-out',
        }} />
      )}

      {/* Top Session Bar: Timer & Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        padding: '10px 16px',
        border: '1px solid #EFEDEA',
      }}>
        {/* Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>⏱️</span>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>
              {t.booth.timerRemaining}
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: 900,
              color: secondsRemaining < 60 ? '#DC2626' : '#111827',
              fontFamily: 'monospace',
            }}>
              {formatTimer(secondsRemaining)}
            </div>
          </div>
        </div>

        {/* Mic Toggle & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={toggleMic}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: micEnabled ? '#DCF5E5' : '#FEE2E2',
              color: micEnabled ? '#15803D' : '#B91C1C',
              border: 'none',
              borderRadius: '9999px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <span>{micEnabled ? '🎙️' : '🔇'}</span>
            <span>{micEnabled ? t.booth.micOn : t.booth.micOff}</span>
          </button>
        </div>
      </div>

      {/* Permission / In-App Error Banner */}
      {cameraError && (
        <div className="virtualan-card" style={{ backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#B91C1C', marginBottom: '6px' }}>
            {t.booth.permissionTitle}
          </h3>
          <p style={{ fontSize: '13px', color: '#7F1D1D', marginBottom: '14px', lineHeight: 1.4 }}>
            {cameraError === 'denied' && t.booth.permissionDenied}
            {cameraError === 'notfound' && t.booth.deviceNotFound}
            {cameraError === 'inapp' && t.booth.inAppBrowserWarning}
          </p>
          <CtaButton onClick={startCamera}>
            {t.common.retry}
          </CtaButton>
        </div>
      )}

      {/* Camera Viewports */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDuo ? '1fr 1fr' : '1fr',
        gap: '10px',
      }}>
        {/* Local Camera */}
        <div style={{
          position: 'relative',
          aspectRatio: '3/4',
          backgroundColor: '#111827',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
        }}>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)', // Mirror user camera
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: '#FFFFFF',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 800,
            backdropFilter: 'blur(4px)',
          }}>
            {t.booth.yourCamera}
          </div>

          {/* Countdown Overlay */}
          {localCountdown !== null && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                fontSize: '84px',
                fontWeight: 900,
                color: '#FFFFFF',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                animation: 'pulse 1s infinite',
              }}>
                {localCountdown}
              </span>
            </div>
          )}

          {/* Pose pause prompt */}
          {isPosingPause && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(242, 120, 159, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              textAlign: 'center',
            }}>
              <div style={{
                backgroundColor: '#FFFFFF',
                color: '#111827',
                padding: '12px 18px',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: 800,
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}>
                ✨ {t.booth.posePrompt}
              </div>
            </div>
          )}
        </div>

        {/* Remote Camera (Duo) */}
        {isDuo && (
          <div style={{
            position: 'relative',
            aspectRatio: '3/4',
            backgroundColor: '#1E293B',
            borderRadius: '20px',
            overflow: 'hidden',
          }}>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 800,
            }}>
              {t.booth.friendCamera}
            </div>
          </div>
        )}
      </div>

      {/* Progress & Start Controls */}
      <div className="virtualan-card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>
            {t.booth.photoIndex.replace('{current}', String(Math.min(currentSlotIndex + 1, 4))).replace('{total}', '4')}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = isDuo
                ? !!completedDuoSlots[idx]
                : idx < capturedBlobs.length;
              return (
                <div
                  key={idx}
                  style={{
                    width: '28px',
                    height: '8px',
                    borderRadius: '9999px',
                    backgroundColor: isFilled ? '#15803D' : (idx === currentSlotIndex && isSessionActive ? '#F2789F' : '#E5E7EB'),
                  }}
                />
              );
            })}
          </div>
        </div>

        {isDuo && isSessionActive && localDuoBlobs[currentSlotIndex] && !peerDuoBlobs[currentSlotIndex] && (
          <div style={{
            padding: '8px',
            backgroundColor: '#FEF3C7',
            borderRadius: '12px',
            color: '#B45309',
            fontSize: '12px',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '10px',
          }}>
            ⏳ Menunggu foto teman...
          </div>
        )}

        {!isSessionActive && (
          <CtaButton
            onClick={isDuo ? onStartDuoSession : startSoloSession}
            disabled={cameraError !== null || (isDuo && !isHost)}
          >
            {isDuo && !isHost ? t.booth.waitingHost : t.booth.startSession}
          </CtaButton>
        )}
      </div>

      {/* Template Selector (Before Session) */}
      {!isSessionActive && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#374151' }}>
              {t.booth.selectTemplate}
            </span>
            {/* Layout Toggles */}
            <div style={{ display: 'flex', gap: '4px', backgroundColor: '#EFEDEA', padding: '3px', borderRadius: '12px' }}>
              <button
                onClick={() => onSelectTemplate(activeTemplateId, '4x1')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  backgroundColor: activeLayout === '4x1' ? '#FFFFFF' : 'transparent',
                  color: activeLayout === '4x1' ? '#111827' : '#6B7280',
                  cursor: 'pointer',
                }}
              >
                4×1
              </button>
              <button
                onClick={() => onSelectTemplate(activeTemplateId, '2x2')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  backgroundColor: activeLayout === '2x2' ? '#FFFFFF' : 'transparent',
                  color: activeLayout === '2x2' ? '#111827' : '#6B7280',
                  cursor: 'pointer',
                }}
              >
                2×2
              </button>
              <button
                onClick={() => onSelectTemplate('koran-musik', 'koran')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  backgroundColor: activeLayout === 'koran' ? '#FFFFFF' : 'transparent',
                  color: activeLayout === 'koran' ? '#111827' : '#6B7280',
                  cursor: 'pointer',
                }}
              >
                Koran
              </button>
            </div>
          </div>

          {/* Template Thumbnails Scroll */}
          <div style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '8px',
          }}>
            {matchingTemplates.map((tmpl) => {
              const isSelected = tmpl.id === activeTemplateId;
              const thumbFile = activeLayout === 'koran' ? 'thumb-koran.png' : `thumb-${activeLayout}.png`;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => onSelectTemplate(tmpl.id, activeLayout)}
                  style={{
                    flexShrink: 0,
                    width: '90px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    borderRadius: '14px',
                    border: isSelected ? '3px solid #F2789F' : '1px solid #EFEDEA',
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF',
                    padding: '4px',
                    boxShadow: isSelected ? '0 4px 14px rgba(242, 120, 159, 0.3)' : 'none',
                  }}>
                    <img
                      src={`/assets/templates/${tmpl.id}/${thumbFile}`}
                      alt={tmpl.name}
                      style={{
                        width: '100%',
                        height: '110px',
                        objectFit: 'contain',
                        borderRadius: '10px',
                      }}
                      loading="lazy"
                    />
                  </div>
                  <span style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: isSelected ? 800 : 600,
                    color: isSelected ? '#111827' : '#6B7280',
                    marginTop: '4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {tmpl.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
