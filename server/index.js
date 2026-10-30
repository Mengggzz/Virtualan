const http = require('http');
const { WebSocketServer, WebSocket } = require('ws');

const PORT = process.env.PORT || 8787;
const ROOM_CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

// Active rooms in memory
// roomCode -> { code, hostWs, guestWs, createdAt, sessionEndsAt, templateId, layout, guestDisconnected: boolean }
const rooms = new Map();

function generateRoomCode() {
  for (let attempt = 0; attempt < 100; attempt++) {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += ROOM_CODE_CHARS.charAt(Math.floor(Math.random() * ROOM_CODE_CHARS.length));
    }
    if (!rooms.has(code)) return code;
  }
  throw new Error('Failed to generate unique room code');
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', time: Date.now(), activeRooms: rooms.size }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

const wss = new WebSocketServer({ server });

function safeSend(ws, data) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

wss.on('connection', (ws) => {
  let currentRoomCode = null;
  let userRole = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      const now = Date.now();

      switch (data.type) {
        case 'create': {
          const roomCode = generateRoomCode();
          const room = {
            code: roomCode,
            hostWs: ws,
            guestWs: null,
            createdAt: now,
            sessionEndsAt: null,
            templateId: 'film-hitam',
            layout: '4x1',
            guestDisconnected: false,
          };
          rooms.set(roomCode, room);
          currentRoomCode = roomCode;
          userRole = 'host';

          safeSend(ws, {
            type: 'created',
            roomCode,
            role: 'host',
            serverNow: now,
          });
          break;
        }

        case 'join': {
          const code = (data.code || '').trim().toUpperCase();
          const room = rooms.get(code);

          if (!room) {
            safeSend(ws, { type: 'error', code: 'ROOM_NOT_FOUND', message: 'Ruangan tidak ditemukan.' });
            return;
          }

          // Check if waiting room expired (15 mins TTL)
          if (!room.sessionEndsAt && now - room.createdAt > 15 * 60 * 1000) {
            rooms.delete(code);
            safeSend(ws, { type: 'error', code: 'ROOM_EXPIRED', message: 'Ruangan sudah kedaluwarsa.' });
            return;
          }

          // Check if session ended
          if (room.sessionEndsAt && now > room.sessionEndsAt) {
            rooms.delete(code);
            safeSend(ws, { type: 'error', code: 'ROOM_EXPIRED', message: 'Sesi ruangan telah berakhir.' });
            return;
          }

          // Check if room is full
          const isReconnect = room.guestDisconnected || (room.guestWs && room.guestWs.readyState !== WebSocket.OPEN);
          if (room.guestWs && !isReconnect) {
            safeSend(ws, { type: 'error', code: 'ROOM_FULL', message: 'Ruangan sudah penuh.' });
            return;
          }

          // Register guest
          room.guestWs = ws;
          room.guestDisconnected = false;
          currentRoomCode = code;
          userRole = 'guest';

          // If sessionEndsAt not set yet, set 5 minutes duration
          if (!room.sessionEndsAt) {
            room.sessionEndsAt = now + 5 * 60 * 1000;
          }

          // Notify guest of join success
          safeSend(ws, {
            type: 'joined',
            roomCode: code,
            role: 'guest',
            templateId: room.templateId,
            layout: room.layout,
            sessionEndsAt: room.sessionEndsAt,
            serverNow: now,
          });

          // Broadcast guest-joined to host
          safeSend(room.hostWs, {
            type: 'guest-joined',
            sessionEndsAt: room.sessionEndsAt,
            serverNow: now,
          });
          break;
        }

        // Relay WebRTC signaling: offer, answer, ice-candidate
        case 'offer':
        case 'answer':
        case 'ice': {
          if (!currentRoomCode) return;
          const room = rooms.get(currentRoomCode);
          if (!room) return;

          const targetWs = (userRole === 'host') ? room.guestWs : room.hostWs;
          if (targetWs) {
            safeSend(targetWs, data);
          }
          break;
        }

        // Host updates template
        case 'template-changed': {
          if (!currentRoomCode || userRole !== 'host') return;
          const room = rooms.get(currentRoomCode);
          if (!room) return;

          room.templateId = data.templateId;
          room.layout = data.layout;
          if (room.guestWs) {
            safeSend(room.guestWs, {
              type: 'template-changed',
              templateId: data.templateId,
              layout: data.layout,
            });
          }
          break;
        }

        case 'room-closed': {
          if (!currentRoomCode) return;
          const room = rooms.get(currentRoomCode);
          if (room) {
            safeSend(room.hostWs, { type: 'room-closed' });
            safeSend(room.guestWs, { type: 'room-closed' });
            rooms.delete(currentRoomCode);
          }
          currentRoomCode = null;
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.error('WebSocket message handling error:', err);
    }
  });

  ws.on('close', () => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room) return;

    if (userRole === 'host') {
      // If host disconnects, close room
      safeSend(room.guestWs, { type: 'room-closed', reason: 'Host keluar.' });
      rooms.delete(currentRoomCode);
    } else if (userRole === 'guest') {
      // Guest disconnected; allow reconnection within active session
      room.guestDisconnected = true;
      safeSend(room.hostWs, { type: 'guest-disconnected' });
    }
  });
});

// Periodic cleanup of stale / expired rooms every 30 seconds
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms.entries()) {
    // Expired waiting room
    if (!room.sessionEndsAt && now - room.createdAt > 15 * 60 * 1000) {
      safeSend(room.hostWs, { type: 'room-closed', reason: 'Waktu tunggu habis.' });
      rooms.delete(code);
    }
    // Expired active session
    if (room.sessionEndsAt && now > room.sessionEndsAt) {
      safeSend(room.hostWs, { type: 'session-timeout' });
      safeSend(room.guestWs, { type: 'session-timeout' });
      rooms.delete(code);
    }
  }
}, 30000);

server.listen(PORT, () => {
  console.log(`Virtualan signaling server running on port ${PORT}`);
});
