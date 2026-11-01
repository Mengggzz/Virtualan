const WebSocket = require('ws');

const WS_URL = 'ws://localhost:8787';

function waitMessage(ws, filter) {
  return new Promise((resolve) => {
    const handler = (data) => {
      const msg = JSON.parse(data.toString());
      if (!filter || filter(msg)) {
        ws.off('message', handler);
        resolve(msg);
      }
    };
    ws.on('message', handler);
  });
}

async function runTests() {
  console.log('--- Testing Signaling Server ---');

  // Test 1: Create room
  const host = new WebSocket(WS_URL);
  await new Promise(r => host.on('open', r));

  host.send(JSON.stringify({ type: 'create' }));
  const createdMsg = await waitMessage(host, m => m.type === 'created');
  console.log(`✓ Host created room: ${createdMsg.roomCode} (role: ${createdMsg.role})`);

  if (!createdMsg.roomCode || createdMsg.roomCode.length !== 6) {
    throw new Error('Invalid room code length');
  }

  // Test 2: Join room
  const guest = new WebSocket(WS_URL);
  await new Promise(r => guest.on('open', r));

  guest.send(JSON.stringify({ type: 'join', code: createdMsg.roomCode }));

  const [joinedGuest, guestJoinedHost] = await Promise.all([
    waitMessage(guest, m => m.type === 'joined'),
    waitMessage(host, m => m.type === 'guest-joined')
  ]);

  console.log(`✓ Guest successfully joined room: ${joinedGuest.roomCode}`);
  console.log(`✓ Host notified of guest joined (sessionEndsAt: ${guestJoinedHost.sessionEndsAt})`);

  // Test 3: Third client attempt -> ROOM_FULL
  const client3 = new WebSocket(WS_URL);
  await new Promise(r => client3.on('open', r));

  client3.send(JSON.stringify({ type: 'join', code: createdMsg.roomCode }));
  const fullMsg = await waitMessage(client3, m => m.type === 'error');
  console.log(`✓ 3rd client rejected: ${fullMsg.code} - "${fullMsg.message}"`);
  if (fullMsg.code !== 'ROOM_FULL') throw new Error('Expected ROOM_FULL error');
  client3.close();

  // Test 4: Invalid room code -> ROOM_NOT_FOUND
  const client4 = new WebSocket(WS_URL);
  await new Promise(r => client4.on('open', r));

  client4.send(JSON.stringify({ type: 'join', code: 'XXXXXX' }));
  const notFoundMsg = await waitMessage(client4, m => m.type === 'error');
  console.log(`✓ Invalid room rejected: ${notFoundMsg.code} - "${notFoundMsg.message}"`);
  if (notFoundMsg.code !== 'ROOM_NOT_FOUND') throw new Error('Expected ROOM_NOT_FOUND error');
  client4.close();

  // Test 5: Host template change relay
  host.send(JSON.stringify({ type: 'template-changed', templateId: 'senja', layout: '2x2' }));
  const tmplMsg = await waitMessage(guest, m => m.type === 'template-changed');
  console.log(`✓ Template change relayed to guest: ${tmplMsg.templateId} (${tmplMsg.layout})`);

  // Test 6: WebRTC offer relay
  const dummyOffer = { type: 'offer', sdp: 'dummy-sdp-data' };
  host.send(JSON.stringify({ type: 'offer', offer: dummyOffer }));
  const relayedOffer = await waitMessage(guest, m => m.type === 'offer');
  console.log(`✓ WebRTC offer relayed successfully.`);

  // Test 7: Synchronized capture trigger relay
  host.send(JSON.stringify({ type: 'relay', payload: { type: 'trigger-capture', slot: 0, at: Date.now() + 3000 } }));
  const relayedTrigger = await waitMessage(guest, m => m.type === 'relay' && m.payload?.type === 'trigger-capture');
  console.log(`✓ Synchronized capture trigger relayed to guest for slot: ${relayedTrigger.payload.slot}`);

  // Test 8: Photo frame relay
  guest.send(JSON.stringify({ type: 'relay', payload: { type: 'photo-data', slot: 0, base64: 'ZHVtbXktYmluYXJ5' } }));
  const relayedPhoto = await waitMessage(host, m => m.type === 'relay' && m.payload?.type === 'photo-data');
  console.log(`✓ Captured photo frame relayed to host for slot: ${relayedPhoto.payload.slot}`);

  // Test 9: Collaborative edit state relay
  guest.send(JSON.stringify({ type: 'relay', payload: { type: 'edit', state: { filterId: 'vintage', stickers: [] } } }));
  const relayedEdit = await waitMessage(host, m => m.type === 'relay' && m.payload?.type === 'edit');
  console.log(`✓ Collaborative edit state relayed: filter = ${relayedEdit.payload.state.filterId}`);

  // Test 10: Final strip PNG relay from host to guest
  host.send(JSON.stringify({ type: 'relay', payload: { type: 'final-strip-data', base64: 'ZmluYWwtcG5nLWRhdGE=' } }));
  const relayedFinal = await waitMessage(guest, m => m.type === 'relay' && m.payload?.type === 'final-strip-data');
  console.log(`✓ Final rendered strip PNG relayed to guest successfully.`);

  host.close();
  guest.close();

  console.log('\nAll signaling server tests PASSED (100%)!\n');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
