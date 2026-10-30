export type RoomRole = 'host' | 'guest';

export interface SignalingEvents {
  onCreated?: (roomCode: string, serverNow: number) => void;
  onJoined?: (data: { roomCode: string; templateId: string; layout: string; sessionEndsAt: number }) => void;
  onGuestJoined?: (data: { sessionEndsAt: number; serverNow: number }) => void;
  onRemoteStream?: (stream: MediaStream) => void;
  onTemplateChanged?: (templateId: string, layout: string) => void;
  onSyncCaptureTrigger?: (slot: number, at: number) => void;
  onPeerPhotoReceived?: (slot: number, blob: Blob) => void;
  onPeerEditReceived?: (state: any) => void;
  onFinalStripReceived?: (blob: Blob) => void;
  onRoomClosed?: (reason?: string) => void;
  onGuestDisconnected?: () => void;
  onError?: (code: string, message: string) => void;
}

export class SignalingClient {
  private ws: WebSocket | null = null;
  private pc: RTCPeerConnection | null = null;
  private captureChannel: RTCDataChannel | null = null;
  private editChannel: RTCDataChannel | null = null;
  private remoteStream: MediaStream | null = null;
  private localStream: MediaStream | null = null;

  private clockOffset = 0; // clientTime - serverTime
  private incomingChunks: Record<number, { size: number; chunks: Uint8Array[]; received: number }> = {};
  private finalStripChunks: { size: number; chunks: Uint8Array[]; received: number } | null = null;

  public role: RoomRole | null = null;
  public roomCode: string | null = null;
  private events: SignalingEvents = {};

  constructor(events: SignalingEvents) {
    this.events = events;
  }

  public connect(url?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const defaultHost = window.location.hostname || 'localhost';
      const wsUrl = url || (import.meta as any).env?.VITE_SIGNALING_URL || `ws://${defaultHost}:8787`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        resolve();
      };

      this.ws.onerror = (err) => {
        reject(err);
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data));
      };

      this.ws.onclose = () => {
        // ws closed
      };
    });
  }

  public setLocalStream(stream: MediaStream) {
    this.localStream = stream;
    if (this.pc) {
      stream.getTracks().forEach((track) => {
        this.pc?.addTrack(track, stream);
      });
    }
  }

  private initPeerConnection() {
    let iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];
    const envIce = (import.meta as any).env?.VITE_ICE_SERVERS;
    if (envIce) {
      try {
        iceServers = JSON.parse(envIce);
      } catch {
        // use default
      }
    }

    this.pc = new RTCPeerConnection({ iceServers });

    // Remote stream setup
    this.remoteStream = new MediaStream();
    this.pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((trk) => {
        this.remoteStream?.addTrack(trk);
      });
      if (this.events.onRemoteStream && this.remoteStream) {
        this.events.onRemoteStream(this.remoteStream);
      }
    };

    this.pc.onicecandidate = (event) => {
      if (event.candidate && this.ws) {
        this.sendWs({ type: 'ice', candidate: event.candidate });
      }
    };

    // Attach local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((trk) => {
        this.pc?.addTrack(trk, this.localStream!);
      });
    }

    if (this.role === 'host') {
      // Host creates reliable data channels
      this.captureChannel = this.pc.createDataChannel('capture', { ordered: true });
      this.setupDataChannel(this.captureChannel);

      this.editChannel = this.pc.createDataChannel('edit', { ordered: true });
      this.setupEditChannel(this.editChannel);
    } else {
      // Guest listens for data channels
      this.pc.ondatachannel = (event) => {
        if (event.channel.label === 'capture') {
          this.captureChannel = event.channel;
          this.setupDataChannel(event.channel);
        } else if (event.channel.label === 'edit') {
          this.editChannel = event.channel;
          this.setupEditChannel(event.channel);
        }
      };
    }
  }

  private setupDataChannel(dc: RTCDataChannel) {
    dc.binaryType = 'arraybuffer';
    dc.onmessage = (event) => {
      if (typeof event.data === 'string') {
        const msg = JSON.parse(event.data);
        if (msg.type === 'trigger-capture') {
          this.events.onSyncCaptureTrigger?.(msg.slot, msg.at);
        } else if (msg.type === 'photo-start') {
          this.incomingChunks[msg.slot] = { size: msg.size, chunks: [], received: 0 };
        } else if (msg.type === 'photo-end') {
          const entry = this.incomingChunks[msg.slot];
          if (entry) {
            const blob = new Blob(entry.chunks as unknown as BlobPart[], { type: 'image/jpeg' });
            delete this.incomingChunks[msg.slot];
            this.events.onPeerPhotoReceived?.(msg.slot, blob);
          }
        } else if (msg.type === 'final-strip-start') {
          this.finalStripChunks = { size: msg.size, chunks: [], received: 0 };
        } else if (msg.type === 'final-strip-end') {
          if (this.finalStripChunks) {
            const blob = new Blob(this.finalStripChunks.chunks as unknown as BlobPart[], { type: 'image/png' });
            this.finalStripChunks = null;
            this.events.onFinalStripReceived?.(blob);
          }
        }
      } else if (event.data instanceof ArrayBuffer) {
        // Binary chunk: check whether it's final strip or photo slot
        const uint8 = new Uint8Array(event.data);
        if (this.finalStripChunks) {
          this.finalStripChunks.chunks.push(uint8);
          this.finalStripChunks.received += uint8.length;
        } else {
          // Find first open slot entry
          const slotKeys = Object.keys(this.incomingChunks);
          if (slotKeys.length > 0) {
            const sKey = Number(slotKeys[slotKeys.length - 1]);
            this.incomingChunks[sKey].chunks.push(uint8);
            this.incomingChunks[sKey].received += uint8.length;
          }
        }
      }
    };
  }

  private setupEditChannel(dc: RTCDataChannel) {
    dc.onmessage = (event) => {
      if (typeof event.data === 'string') {
        const msg = JSON.parse(event.data);
        if (msg.type === 'edit') {
          this.events.onPeerEditReceived?.(msg.state);
        }
      }
    };
  }

  private async handleMessage(msg: any) {
    switch (msg.type) {
      case 'created':
        this.role = 'host';
        this.roomCode = msg.roomCode;
        this.clockOffset = Date.now() - msg.serverNow;
        this.events.onCreated?.(msg.roomCode, msg.serverNow);
        break;

      case 'joined':
        this.role = 'guest';
        this.roomCode = msg.roomCode;
        this.clockOffset = Date.now() - msg.serverNow;
        this.initPeerConnection();
        this.events.onJoined?.({
          roomCode: msg.roomCode,
          templateId: msg.templateId,
          layout: msg.layout,
          sessionEndsAt: msg.sessionEndsAt,
        });
        break;

      case 'guest-joined':
        this.events.onGuestJoined?.({
          sessionEndsAt: msg.sessionEndsAt,
          serverNow: msg.serverNow,
        });
        // Host initiates WebRTC Offer
        this.initPeerConnection();
        if (this.pc) {
          const offer = await this.pc.createOffer();
          await this.pc.setLocalDescription(offer);
          this.sendWs({ type: 'offer', offer });
        }
        break;

      case 'offer':
        if (this.pc) {
          await this.pc.setRemoteDescription(new RTCSessionDescription(msg.offer));
          const answer = await this.pc.createAnswer();
          await this.pc.setLocalDescription(answer);
          this.sendWs({ type: 'answer', answer });
        }
        break;

      case 'answer':
        if (this.pc) {
          await this.pc.setRemoteDescription(new RTCSessionDescription(msg.answer));
        }
        break;

      case 'ice':
        if (this.pc && msg.candidate) {
          try {
            await this.pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
          } catch (e) {
            console.error('Error adding ice candidate', e);
          }
        }
        break;

      case 'template-changed':
        this.events.onTemplateChanged?.(msg.templateId, msg.layout);
        break;

      case 'room-closed':
        this.events.onRoomClosed?.(msg.reason);
        this.cleanup();
        break;

      case 'guest-disconnected':
        this.events.onGuestDisconnected?.();
        break;

      case 'error':
        this.events.onError?.(msg.code, msg.message);
        break;

      default:
        break;
    }
  }

  public createRoom() {
    this.sendWs({ type: 'create' });
  }

  public joinRoom(code: string) {
    this.sendWs({ type: 'join', code });
  }

  public changeTemplate(templateId: string, layout: string) {
    this.sendWs({ type: 'template-changed', templateId, layout });
  }

  // Synchronized photo capture: host triggers capture at target server timestamp
  public triggerSyncCapture(slot: number) {
    const targetAt = Date.now() - this.clockOffset + 3000;
    const msg = JSON.stringify({ type: 'trigger-capture', slot, at: targetAt });
    if (this.captureChannel && this.captureChannel.readyState === 'open') {
      this.captureChannel.send(msg);
    }
    // Also trigger locally on host
    this.events.onSyncCaptureTrigger?.(slot, targetAt);
  }

  // Send photo chunks (16 KB)
  public async sendPhotoBlob(slot: number, blob: Blob) {
    if (!this.captureChannel || this.captureChannel.readyState !== 'open') return;

    const buffer = await blob.arrayBuffer();
    this.captureChannel.send(JSON.stringify({ type: 'photo-start', slot, size: buffer.byteLength }));

    const chunkSize = 16384; // 16 KB chunks
    for (let offset = 0; offset < buffer.byteLength; offset += chunkSize) {
      const slice = buffer.slice(offset, offset + chunkSize);
      this.captureChannel.send(slice);
    }

    this.captureChannel.send(JSON.stringify({ type: 'photo-end', slot }));
  }

  // Send final rendered strip PNG from host to guest
  public async sendFinalStrip(blob: Blob) {
    if (!this.captureChannel || this.captureChannel.readyState !== 'open') return;

    const buffer = await blob.arrayBuffer();
    this.captureChannel.send(JSON.stringify({ type: 'final-strip-start', size: buffer.byteLength }));

    const chunkSize = 16384;
    for (let offset = 0; offset < buffer.byteLength; offset += chunkSize) {
      const slice = buffer.slice(offset, offset + chunkSize);
      this.captureChannel.send(slice);
    }

    this.captureChannel.send(JSON.stringify({ type: 'final-strip-end' }));
  }

  // Broadcast collaborative edit state
  public broadcastEdit(state: any) {
    if (this.editChannel && this.editChannel.readyState === 'open') {
      this.editChannel.send(JSON.stringify({ type: 'edit', state }));
    }
  }

  public closeRoom() {
    this.sendWs({ type: 'room-closed' });
    this.cleanup();
  }

  private sendWs(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  public cleanup() {
    if (this.captureChannel) this.captureChannel.close();
    if (this.editChannel) this.editChannel.close();
    if (this.pc) this.pc.close();
    if (this.ws) this.ws.close();
    this.pc = null;
    this.ws = null;
    this.captureChannel = null;
    this.editChannel = null;
  }
}
