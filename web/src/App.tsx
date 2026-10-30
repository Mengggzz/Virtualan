import { useState, useEffect, useRef } from 'react';
import { I18nProvider } from './i18n';
import { loadCatalog, type Catalog } from './services/catalog';
import { countStrips, saveStrip } from './services/db';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { WaitingPage } from './pages/WaitingPage';
import { BoothPage } from './pages/BoothPage';
import { EditPage } from './pages/EditPage';
import { ResultPage } from './pages/ResultPage';
import { CollectionPage } from './pages/CollectionPage';
import { StaticPage } from './pages/StaticPages';
import { TipsModal } from './components/TipsModal';
import { SignalingClient } from './services/signaling';
import { createThumbnail, type PhotoSlotItem } from './services/renderer';

type AppView = 'home' | 'waiting' | 'booth' | 'edit' | 'result' | 'collection' | 'terms' | 'privacy';

function MainApp() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [catalog, setCatalog] = useState<Catalog>({ templates: [], stickers: [], filters: [] });
  const [collectionCount, setCollectionCount] = useState<number>(0);

  // Active strip setup
  const [activeTemplateId, setActiveTemplateId] = useState<string>('film-hitam');
  const [activeLayout, setActiveLayout] = useState<string>('4x1');

  // Session & Photos
  const [isDuo, setIsDuo] = useState(false);
  const [isHost, setIsHost] = useState(true);
  const [capturedPhotos, setCapturedPhotos] = useState<PhotoSlotItem[]>([]);
  const [finalPngBlob, setFinalPngBlob] = useState<Blob | null>(null);

  // Duo & WebRTC state
  const [roomCode, setRoomCode] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [sessionEndsAt, setSessionEndsAt] = useState<number | null>(null);

  // Tips Modal state
  const [tipsMoment, setTipsMoment] = useState<'waiting' | 'booth' | 'result' | null>(null);

  // Signaling client ref
  const signalingRef = useRef<SignalingClient | null>(null);

  // Load catalog & count strips on mount
  useEffect(() => {
    loadCatalog().then(setCatalog);
    refreshCollectionCount();
  }, []);

  const refreshCollectionCount = () => {
    countStrips()
      .then(setCollectionCount)
      .catch(console.error);
  };

  // Initialize signaling client
  const getSignalingClient = () => {
    if (!signalingRef.current) {
      signalingRef.current = new SignalingClient({
        onCreated: (code) => {
          setRoomCode(code);
          setIsHost(true);
          setIsDuo(true);
          setIsConnecting(false);
          setCurrentView('waiting');
          setTipsMoment('waiting');
        },
        onJoined: (data) => {
          setRoomCode(data.roomCode);
          setActiveTemplateId(data.templateId || 'film-hitam');
          setActiveLayout(data.layout || '4x1');
          setSessionEndsAt(data.sessionEndsAt);
          setIsHost(false);
          setIsDuo(true);
          setIsConnecting(false);
          setCurrentView('booth');
          setTipsMoment('booth');
        },
        onGuestJoined: (data) => {
          setSessionEndsAt(data.sessionEndsAt);
          setCurrentView('booth');
          setTipsMoment('booth');
        },
        onRemoteStream: (stream) => {
          setRemoteStream(stream);
        },
        onTemplateChanged: (templateId, layout) => {
          setActiveTemplateId(templateId);
          setActiveLayout(layout);
        },
        onRoomClosed: () => {
          alert('Ruangan ditutup.');
          resetToHome();
        },
        onError: (_code, message) => {
          setIsConnecting(false);
          setJoinError(message);
        },
      });
    }
    return signalingRef.current;
  };

  const resetToHome = () => {
    if (signalingRef.current) {
      signalingRef.current.cleanup();
      signalingRef.current = null;
    }
    setIsDuo(false);
    setIsHost(true);
    setRoomCode('');
    setCapturedPhotos([]);
    setFinalPngBlob(null);
    setRemoteStream(null);
    setSessionEndsAt(null);
    setJoinError(null);
    setCurrentView('home');
    refreshCollectionCount();
  };

  // 1. Solo Mode Start
  const handleStartSolo = () => {
    setIsDuo(false);
    setIsHost(true);
    setCurrentView('booth');
    setTipsMoment('booth');
  };

  // 2. Duo Create Room
  const handleCreateDuo = async () => {
    setIsConnecting(true);
    setJoinError(null);
    try {
      const client = getSignalingClient();
      await client.connect();
      client.createRoom();
    } catch {
      setIsConnecting(false);
      setJoinError('Gagal terhubung ke server bilik foto.');
    }
  };

  // 3. Duo Join Room
  const handleJoinDuo = async (code: string) => {
    setIsConnecting(true);
    setJoinError(null);
    try {
      const client = getSignalingClient();
      await client.connect();
      client.joinRoom(code);
    } catch {
      setIsConnecting(false);
      setJoinError('Gagal terhubung ke server.');
    }
  };

  const handleSelectTemplate = (templateId: string, layout: string) => {
    setActiveTemplateId(templateId);
    setActiveLayout(layout);
    if (isDuo && isHost && signalingRef.current) {
      signalingRef.current.changeTemplate(templateId, layout);
    }
  };

  // Session captures done -> Edit View
  const handleSessionComplete = (photos: PhotoSlotItem[]) => {
    setCapturedPhotos(photos);
    setCurrentView('edit');
  };

  // Finalize Strip -> Save to DB & go to Result
  const handleFinalize = async (pngBlob: Blob) => {
    setFinalPngBlob(pngBlob);
    try {
      const thumbBlob = await createThumbnail(pngBlob, 360);
      await saveStrip({
        pngBlob,
        thumbBlob,
        templateId: activeTemplateId,
        layout: activeLayout,
      });
      refreshCollectionCount();
    } catch (err) {
      console.error('Failed to save strip to IndexedDB:', err);
    }
    setCurrentView('result');
    setTipsMoment('result');
  };

  return (
    <div className="app-container">
      {/* Global Header */}
      <Header
        collectionCount={collectionCount}
        onOpenCollection={() => setCurrentView('collection')}
        onGoHome={resetToHome}
      />

      {/* View Switcher */}
      {currentView === 'home' && (
        <HomePage
          onStartSolo={handleStartSolo}
          onCreateDuo={handleCreateDuo}
          onJoinDuo={handleJoinDuo}
          onOpenTerms={() => setCurrentView('terms')}
          onOpenPrivacy={() => setCurrentView('privacy')}
          joinError={joinError}
          isConnecting={isConnecting}
        />
      )}

      {currentView === 'waiting' && (
        <WaitingPage
          roomCode={roomCode}
          onCancelRoom={() => {
            if (signalingRef.current) signalingRef.current.closeRoom();
            resetToHome();
          }}
        />
      )}

      {currentView === 'booth' && (
        <BoothPage
          isDuo={isDuo}
          isHost={isHost}
          catalog={catalog}
          activeTemplateId={activeTemplateId}
          activeLayout={activeLayout}
          onSelectTemplate={handleSelectTemplate}
          remoteStream={remoteStream}
          sessionEndsAt={sessionEndsAt}
          onSessionComplete={handleSessionComplete}
          onExitBooth={resetToHome}
        />
      )}

      {currentView === 'edit' && (
        <EditPage
          photos={capturedPhotos}
          templateId={activeTemplateId}
          layout={activeLayout}
          catalog={catalog}
          isHost={isHost}
          onFinalize={handleFinalize}
          onRetakeSlot={() => {
            setCurrentView('booth');
          }}
          onRetakeAll={() => {
            setCapturedPhotos([]);
            setCurrentView('booth');
          }}
        />
      )}

      {currentView === 'result' && finalPngBlob && (
        <ResultPage
          pngBlob={finalPngBlob}
          onMakeAnother={() => {
            setCapturedPhotos([]);
            setFinalPngBlob(null);
            setCurrentView('booth');
          }}
          onGoHome={resetToHome}
        />
      )}

      {currentView === 'collection' && (
        <CollectionPage
          onGoHome={resetToHome}
          onRefreshCount={refreshCollectionCount}
        />
      )}

      {(currentView === 'terms' || currentView === 'privacy') && (
        <StaticPage
          type={currentView}
          onBack={() => setCurrentView('home')}
        />
      )}

      {/* Tips Modal */}
      {tipsMoment && (
        <TipsModal
          moment={tipsMoment}
          isOpen={!!tipsMoment}
          onClose={() => setTipsMoment(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <MainApp />
    </I18nProvider>
  );
}
