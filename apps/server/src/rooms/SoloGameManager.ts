import {
  SoloGameState,
  SoloGamePhase,
  PlayerState,
  ChallengeProposal,
  ChatMessage,
} from '@class-clash/shared';

export class SoloGameManager {
  public state: SoloGameState;
  public players: Record<string, PlayerState>;
  private timerInterval: NodeJS.Timeout | null = null;
  private broadcastCallback: (state: SoloGameState) => void;

  constructor(
    roomCode: string,
    players: Record<string, PlayerState>,
    broadcastCallback: (state: SoloGameState) => void
  ) {
    this.roomCode = roomCode;
    this.players = players;
    this.broadcastCallback = broadcastCallback;

    this.state = {
      roomCode,
      isLocked: false,
      currentRound: 1,
      totalRounds: 3,
      phase: 'LOBBY',
      phaseTimeRemaining: 180, // 180s (3 Minutes)
      selectedPlayerId: null,
      leaderPlayerId: null,
      proposals: [],
      winningProposal: null,
      chatMessages: [],
      championPlayerId: null,
    };
  }

  public set roomCode(val: string) {
    if (this.state) this.state.roomCode = val;
  }

  public startJoinWindow(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.state.phaseTimeRemaining > 0) {
        this.state.phaseTimeRemaining--;
        this.broadcastCallback(this.state);
      } else {
        if (this.state.phase === 'LOBBY') {
          this.lockRoomAndStartGame();
        } else {
          this.advancePhase();
        }
      }
    }, 1000);
  }

  public lockRoomAndStartGame(): void {
    this.state.isLocked = true;
    this.state.currentRound = 1;
    this.startPlayerSelectionPhase();
  }

  public startPlayerSelectionPhase(): void {
    this.state.phase = 'PLAYER_SELECTION';
    this.state.phaseTimeRemaining = 5; // 5s
    this.state.proposals = []; // Reset proposals for new round
    this.state.winningProposal = null;

    // Pick random player
    const playerIds = Object.keys(this.players);
    if (playerIds.length > 0) {
      const randomIdx = Math.floor(Math.random() * playerIds.length);
      this.state.selectedPlayerId = playerIds[randomIdx];
    }

    this.broadcastCallback(this.state);
  }

  public advancePhase(): void {
    switch (this.state.phase) {
      case 'PLAYER_SELECTION':
        this.state.phase = 'DISCUSSION_AND_VOTING';
        this.state.phaseTimeRemaining = 120; // 120s (2 Minutes)
        break;

      case 'DISCUSSION_AND_VOTING':
        // Calculate winning proposal with most votes
        if (this.state.proposals.length > 0) {
          const sorted = [...this.state.proposals].sort((a, b) => b.votesCount - a.votesCount);
          this.state.winningProposal = sorted[0];
        } else {
          this.state.winningProposal = {
            id: 'fallback_dare',
            proposerId: 'system',
            proposerName: 'SYSTEM',
            text: 'Do 10 Pushups or Sing a Song live on mic!',
            votesCount: 0,
            voterIds: [],
          };
        }

        // Select random leader from remaining players
        const eligibleLeaderIds = Object.keys(this.players).filter(
          (id) => id !== this.state.selectedPlayerId
        );
        const leaderPool = eligibleLeaderIds.length > 0 ? eligibleLeaderIds : Object.keys(this.players);
        if (leaderPool.length > 0) {
          const lIdx = Math.floor(Math.random() * leaderPool.length);
          this.state.leaderPlayerId = leaderPool[lIdx];
        }

        this.state.phase = 'LEADER_CONFIRMATION';
        this.state.phaseTimeRemaining = 12; // 12s
        break;

      case 'LEADER_CONFIRMATION':
        this.state.phase = 'CHALLENGE_EXECUTION';
        this.state.phaseTimeRemaining = 180; // 180s (3 Minutes)
        break;

      case 'CHALLENGE_EXECUTION':
        this.state.phase = 'ROUND_RESULT';
        this.state.phaseTimeRemaining = 8; // 8s

        // Award points if challenge completed
        if (this.state.selectedPlayerId && this.players[this.state.selectedPlayerId]) {
          this.players[this.state.selectedPlayerId].score += 300;
        }
        if (this.state.leaderPlayerId && this.players[this.state.leaderPlayerId]) {
          this.players[this.state.leaderPlayerId].score += 100;
        }
        break;

      case 'ROUND_RESULT':
        if (this.state.currentRound < this.state.totalRounds) {
          this.state.currentRound++;
          this.startPlayerSelectionPhase();
        } else {
          // Final Round Completed -> Crown Champion
          this.state.phase = 'GAME_OVER_CHAMPION';
          this.state.phaseTimeRemaining = 999;

          // Find player with highest score
          const sortedPlayers = Object.values(this.players).sort((a, b) => b.score - a.score);
          if (sortedPlayers.length > 0) {
            this.state.championPlayerId = sortedPlayers[0].id;
          }
        }
        break;
    }

    this.broadcastCallback(this.state);
  }

  public submitProposal(proposerId: string, proposerName: string, text: string): void {
    if (this.state.phase !== 'DISCUSSION_AND_VOTING') return;

    // Rule: Target player cannot propose dares against themselves
    if (proposerId === this.state.selectedPlayerId) return;

    // Rule: 1 proposal per player per round max
    const hasAlreadyProposed = this.state.proposals.some((p) => p.proposerId === proposerId);
    if (hasAlreadyProposed) return;

    // Rule: Min 4, Max 80 characters
    const cleanText = text.trim();
    if (cleanText.length < 4 || cleanText.length > 80) return;

    const newProp: ChallengeProposal = {
      id: `prop_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      proposerId,
      proposerName,
      text: cleanText,
      votesCount: 0,
      voterIds: [],
    };

    this.state.proposals.push(newProp);
    this.broadcastCallback(this.state);
  }

  public voteProposal(voterId: string, proposalId: string): void {
    if (this.state.phase !== 'DISCUSSION_AND_VOTING') return;

    const targetProp = this.state.proposals.find((p) => p.id === proposalId);
    if (!targetProp) return;

    // Rule: Cannot vote on own proposal
    if (targetProp.proposerId === voterId) return;

    const alreadyVotedTarget = targetProp.voterIds.includes(voterId);

    // Rule: Single vote limit per player per round - clear voterId from all proposals first
    for (const prop of this.state.proposals) {
      const idx = prop.voterIds.indexOf(voterId);
      if (idx !== -1) {
        prop.voterIds.splice(idx, 1);
        prop.votesCount = prop.voterIds.length;
      }
    }

    // If player wasn't voted on target, cast vote now; if already voted, action was toggle off
    if (!alreadyVotedTarget) {
      targetProp.voterIds.push(voterId);
      targetProp.votesCount = targetProp.voterIds.length;
    }

    this.broadcastCallback(this.state);
  }

  public addChatMessage(senderId: string, senderName: string, text: string): void {
    const msg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      senderId,
      senderName,
      text: text.trim(),
      timestamp: Date.now(),
    };

    this.state.chatMessages.push(msg);
    if (this.state.chatMessages.length > 50) {
      this.state.chatMessages.shift();
    }

    this.broadcastCallback(this.state);
  }

  public confirmChallenge(): void {
    if (this.state.phase === 'LEADER_CONFIRMATION') {
      this.state.phase = 'CHALLENGE_EXECUTION';
      this.state.phaseTimeRemaining = 10; // TEMPORARY: 10s for fast testing (Original: 180s)
      this.broadcastCallback(this.state);
    }
  }

  public destroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }
}
