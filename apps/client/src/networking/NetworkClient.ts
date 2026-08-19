import { NetworkMessage, PlayerInputPayload } from '@class-clash/shared';
import { useGameStore } from '../state/useGameStore';

export class NetworkClient {
  private static socket: WebSocket | null = null;
  private static reconnectTimer: NodeJS.Timeout | null = null;

  public static connect(serverUrl: string = 'ws://localhost:3001'): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.socket = new WebSocket(serverUrl);

    this.socket.onopen = () => {
      console.log('⚡ Connected to CLASHA Authoritative Game Server');
      useGameStore.getState().setIsConnected(true);

      // Send initial room join request if name exists
      const { roomCode, displayName } = useGameStore.getState();
      if (roomCode) {
        this.send({
          type: 'JOIN_ROOM',
          payload: { roomCode, displayName, avatar: 'avatar_1' },
        });
      }
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
