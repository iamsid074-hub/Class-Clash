import { NetworkMessage, PlayerInputPayload } from '@class-clash/shared';
import { useGameStore } from '../state/useGameStore';

export class NetworkClient {
  private static socket: WebSocket | null = null;
  private static reconnectTimer: NodeJS.Timeout | null = null;
  private static pendingJoinRoom: NetworkMessage | null = null;

  private static getWsUrl(): string {
    let customUrl = (import.meta as any).env?.VITE_WS_URL;
    if (customUrl && typeof customUrl === 'string') {
      customUrl = customUrl.trim();
      // Fix bad env var pointing to non-existent class-clash-server.onrender.com
      if (customUrl.includes('class-clash-server.onrender.com') || customUrl.includes('clasha-server.onrender.com')) {
        customUrl = 'wss://class-clash.onrender.com';
      }
      if (customUrl) return customUrl;
    }

    const host = window.location.hostname || 'localhost';
    if (host === 'localhost' || host === '127.0.0.1') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${host}:3001`;
    }

    // Production: connect to verified Render-hosted game server
    return 'wss://class-clash.onrender.com';
  }

  public static isConnected(): boolean {
    return !!(this.socket && this.socket.readyState === WebSocket.OPEN);
  }

  public static connect(): void {
    const serverUrl = this.getWsUrl();

    // Already open — nothing to do
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }

    // Already trying to connect — wait for it
    if (this.socket && this.socket.readyState === WebSocket.CONNECTING) {
      return;
    }

    // Clean up dead socket
    if (this.socket) {
      try { this.socket.close(); } catch (_) { /* ignore */ }
      this.socket = null;
    }

    try {
      console.log('[NetworkClient] Connecting to', serverUrl);
      this.socket = new WebSocket(serverUrl);

      this.socket.onopen = () => {
        console.log('[NetworkClient] ⚡ Connected to CLASHA Game Server');
        useGameStore.getState().setIsConnected(true);

        // If there's a pending JOIN_ROOM, flush it now
        if (this.pendingJoinRoom) {
          console.log('[NetworkClient] Flushing pending JOIN_ROOM');
          this.sendDirect(this.pendingJoinRoom);
          this.pendingJoinRoom = null;
        } else {
          // Auto-rejoin room on reconnect if we were in one
          const store = useGameStore.getState();
          if (store.roomCode && (store.screen === 'TEAM_CABIN' || store.screen === 'SOCIAL_LOBBY' || store.screen === 'CREATE_TEAM' || store.screen === 'JOIN_TEAM')) {
            console.log('[NetworkClient] Auto-rejoining room', store.roomCode);
            this.sendDirect({
              type: 'JOIN_ROOM',
              payload: {
                roomCode: store.roomCode,
                password: store.roomPassword || '',
                isHost: false,
                displayName: store.displayName || 'RACER',
                avatar: 'avatar_cyber',
              },
            });
          }
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const msg: NetworkMessage = JSON.parse(event.data);
          this.handleMessage(msg);
        } catch (err) {
          console.error('[NetworkClient] Error parsing message:', err);
        }
      };

      this.socket.onclose = (event) => {
        console.warn(`[NetworkClient] Disconnected from server. Code: ${event.code}, Reason: ${event.reason}, Clean: ${event.wasClean}`);
        useGameStore.getState().setIsConnected(false);
        this.socket = null;
        this.scheduleReconnect();
      };

      this.socket.onerror = (err) => {
        console.error('[NetworkClient] WebSocket error — server may be unreachable:', err);
      };
    } catch (e) {
      console.error('[NetworkClient] Failed to create WebSocket:', e);
      this.scheduleReconnect();
    }
  }

  private static scheduleReconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, 2500);
  }

  /**
   * Send a message directly on the open socket (no queueing).
   */
  private static sendDirect(message: NetworkMessage): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  /**
   * Send a message. If the socket isn't open, queue it for delivery on connect.
   */
  public static send(message: NetworkMessage): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('[NetworkClient] Socket not open. Queueing message:', message.type);
      // For JOIN_ROOM, use the dedicated pending slot so it's sent first on reconnect
      if (message.type === 'JOIN_ROOM') {
        this.pendingJoinRoom = message;
      }
      this.connect();
    }
  }

  /**
   * Join or create a room. Ensures connection is established first,
   * then sends the JOIN_ROOM message reliably.
   */
  /**
   * Legacy: Join or create a room (backward compat).
   */
  public static joinRoom(payload: {
    roomCode: string;
    password: string;
    isHost: boolean;
    displayName: string;
    avatar?: string;
  }): void {
    const joinMsg: NetworkMessage = {
      type: 'JOIN_ROOM',
      payload,
    };

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('[NetworkClient] Sending JOIN_ROOM immediately');
      this.sendDirect(joinMsg);
    } else {
      console.log('[NetworkClient] Socket not ready. Storing JOIN_ROOM as pending');
      this.pendingJoinRoom = joinMsg;
      this.connect();
    }
  }

  /**
   * Create a new cabin. ONLY this method can create cabins.
   */
  public static createCabin(payload: {
    cabinId: string;
    cabinName: string;
    password: string;
    displayName: string;
    avatar?: string;
  }): void {
    const msg: NetworkMessage = {
      type: 'CREATE_CABIN',
      payload,
    };

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('[NetworkClient] Sending CREATE_CABIN immediately');
      this.sendDirect(msg);
    } else {
      console.log('[NetworkClient] Socket not ready. Storing CREATE_CABIN as pending');
      this.pendingJoinRoom = msg;
      this.connect();
    }
  }

  /**
   * Join an EXISTING cabin. NEVER creates one.
   */
  public static joinCabin(payload: {
    cabinId: string;
    password: string;
    displayName: string;
    avatar?: string;
  }): void {
    const msg: NetworkMessage = {
      type: 'JOIN_CABIN',
      payload,
    };

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('[NetworkClient] Sending JOIN_CABIN immediately');
      this.sendDirect(msg);
    } else {
      console.log('[NetworkClient] Socket not ready. Storing JOIN_CABIN as pending');
      this.pendingJoinRoom = msg;
      this.connect();
    }
  }

  public static sendInput(input: PlayerInputPayload): void {
    this.send({ type: 'PLAYER_INPUT', payload: input });
  }

  public static submitProposal(text: string): void {
    this.send({ type: 'SUBMIT_PROPOSAL', payload: { text } });
  }

  public static voteProposal(proposalId: string): void {
    this.send({ type: 'VOTE_PROPOSAL', payload: { proposalId } });
  }

  public static confirmChallenge(): void {
    this.send({ type: 'CONFIRM_CHALLENGE', payload: {} });
  }

  public static skipPhase(): void {
    this.send({ type: 'SKIP_PHASE', payload: {} });
  }

  public static sendChat(text: string): void {
    this.send({ type: 'SEND_CHAT', payload: { text } });
  }

  private static handleMessage(msg: NetworkMessage): void {
    const store = useGameStore.getState();

    switch (msg.type) {
      case 'ROOM_STATE':
        console.log('[NetworkClient] Received ROOM_STATE', {
          roomCode: msg.payload?.roomCode,
          cabinName: msg.payload?.cabinName,
          playerId: msg.payload?.playerId,
          playerCount: msg.payload?.players ? Object.keys(msg.payload.players).length : 0,
        });
        store.updateRoomState(msg.payload);
        break;

      case 'CABIN_CREATED':
        console.log('[NetworkClient] Cabin created successfully:', msg.payload?.cabinId);
        // ROOM_STATE follows immediately from server, which handles navigation
        break;

      case 'CABIN_JOIN_ERROR':
        console.warn('[NetworkClient] Cabin join error:', msg.payload?.message);
        if (msg.payload?.message) {
          store.setErrorMessage(msg.payload.message);
          store.setIsJoiningCabin(false);
        }
        break;

      case 'ERROR_NOTIFICATION':
        console.warn('[NetworkClient] Server error:', msg.payload?.message);
        if (msg.payload?.message) {
          store.setErrorMessage(msg.payload.message);
          store.setIsJoiningCabin(false);
        }
        break;

      case 'SOLO_GAME_STATE':
        store.updateSoloGameState(msg.payload);
        break;

      case 'MATCH_START':
        store.setMatchStart(msg.payload);
        break;

      case 'MATCH_SNAPSHOT':
        store.setMatchSnapshot(msg.payload);
        break;

      case 'MATCH_RESULTS':
        store.setMatchResults(msg.payload);
        break;

      default:
        break;
    }
  }
}
