import { NetworkMessage, PlayerInputPayload } from '@class-clash/shared';
import { useGameStore } from '../state/useGameStore';

export class NetworkClient {
  private static socket: WebSocket | null = null;
  private static reconnectTimer: NodeJS.Timeout | null = null;
  private static messageQueue: NetworkMessage[] = [];

  private static getWsUrl(): string {
    const customUrl = (import.meta as any).env?.VITE_WS_URL;
    if (customUrl) return customUrl;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname || 'localhost';
    if (host === 'localhost' || host === '127.0.0.1') {
      return `${protocol}//${host}:3001`;
    }
    return `${protocol}//${window.location.host}`;
  }

  public static connect(onConnected?: () => void): void {
    const serverUrl = this.getWsUrl();

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      if (onConnected) onConnected();
      this.flushQueue();
      return;
    }

    if (this.socket && this.socket.readyState === WebSocket.CONNECTING) {
      if (onConnected) {
        const currentSock = this.socket;
        const prevOnOpen = currentSock.onopen;
        currentSock.onopen = (e) => {
          if (prevOnOpen) prevOnOpen.call(currentSock, e);
          onConnected();
          this.flushQueue();
        };
      }
      return;
    }

    try {
      this.socket = new WebSocket(serverUrl);

      this.socket.onopen = () => {
        console.log('⚡ Connected to CLASHA Authoritative Game Server');
        useGameStore.getState().setIsConnected(true);
        if (onConnected) onConnected();
        this.flushQueue();
      };

      this.socket.onmessage = (event) => {
        try {
          const msg: NetworkMessage = JSON.parse(event.data);
          this.handleMessage(msg);
        } catch (err) {
          console.error('Error parsing network message:', err);
        }
      };

      this.socket.onclose = () => {
        console.warn('Disconnected from server. Attempting reconnect...');
        useGameStore.getState().setIsConnected(false);
        this.scheduleReconnect();
      };

      this.socket.onerror = (err) => {
        console.error('WebSocket error:', err);
      };
    } catch (e) {
      console.error('Failed to create WebSocket instance:', e);
      this.scheduleReconnect();
    }
  }

  private static flushQueue(): void {
    while (this.messageQueue.length > 0 && this.socket && this.socket.readyState === WebSocket.OPEN) {
      const msg = this.messageQueue.shift();
      if (msg) {
        try {
          this.socket.send(JSON.stringify(msg));
        } catch (e) {
          console.error('Failed to send queued message:', e);
        }
      }
    }
  }

  private static scheduleReconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, 2500);
  }

  public static send(message: NetworkMessage): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
      this.connect();
    }
  }

  public static sendInput(input: PlayerInputPayload): void {
    this.send({
      type: 'PLAYER_INPUT',
      payload: input,
    });
  }

  public static submitProposal(text: string): void {
    this.send({
      type: 'SUBMIT_PROPOSAL',
      payload: { text },
    });
  }

  public static voteProposal(proposalId: string): void {
    this.send({
      type: 'VOTE_PROPOSAL',
      payload: { proposalId },
    });
  }

  public static confirmChallenge(): void {
    this.send({
      type: 'CONFIRM_CHALLENGE',
      payload: {},
    });
  }

  public static skipPhase(): void {
    this.send({
      type: 'SKIP_PHASE',
      payload: {},
    });
  }

  public static sendChat(text: string): void {
    this.send({
      type: 'SEND_CHAT',
      payload: { text },
    });
  }

  private static handleMessage(msg: NetworkMessage): void {
    const store = useGameStore.getState();

    switch (msg.type) {
      case 'ROOM_STATE':
        store.updateRoomState(msg.payload);
        break;

      case 'ERROR_NOTIFICATION':
        if (msg.payload?.message) {
          store.setErrorMessage(msg.payload.message);
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
