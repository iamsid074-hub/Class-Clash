import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { NetworkClient } from '../../networking/NetworkClient';
import { Crown, MessageSquare, Send, Trophy, Users, CheckCircle, Zap, Shield, Play, Lock, Copy, Check, Sparkles, ArrowLeft } from 'lucide-react';
import { ChallengeProposal, ChatMessage } from '@class-clash/shared';

export const SoloPartyCabinScreen: React.FC = () => {
  const { playerId, soloGameState, roomCode, roomPassword, players, setScreen, triggerGateTransition } = useGameStore();
  const [proposalInput, setProposalInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [shufflingName, setShufflingName] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const allPlayersList = Object.values(players);
  const localPlayer = players[playerId];

  const state = soloGameState || {
    roomCode: roomCode || 'ROOM1',
    isLocked: false,
    currentRound: 1,
    totalRounds: 3,
    phase: 'LOBBY',
    phaseTimeRemaining: 180,
    selectedPlayerId: null,
    leaderPlayerId: null,
    proposals: [],
    winningProposal: null,
    chatMessages: [],
    championPlayerId: null,
  };

  const selectedPlayer = state.selectedPlayerId ? players[state.selectedPlayerId] : null;
  const leaderPlayer = state.leaderPlayerId ? players[state.leaderPlayerId] : null;
  const championPlayer = state.championPlayerId ? players[state.championPlayerId] : null;

  const [isTvGateClosed, setIsTvGateClosed] = useState(false);
  const prevPhaseRef = useRef(state.phase);

  // Trigger GPU-accelerated 60fps diagonal shutter animation INSIDE THE MOUNTED LED TV SCREEN when dare timer finishes!
  useEffect(() => {
    if (state.phase === 'ROUND_RESULT') {
      // Step 1: Ensure shutters start open initially
      setIsTvGateClosed(false);

      // Step 2: On next animation frame, trigger smooth 60fps closing animation!
      const animFrame = requestAnimationFrame(() => {
        setIsTvGateClosed(true);
      });

      // Step 3: Hold closed for 2.0s so user sees full closing + NEXT ROUND badge + opening!
      const timer = setTimeout(() => {
        setIsTvGateClosed(false);
      }, 2000);

      return () => {
        cancelAnimationFrame(animFrame);
        clearTimeout(timer);
      };
    }
    prevPhaseRef.current = state.phase;
  }, [state.phase]);

  // -------------------------------------------------------------
  // 5-SECOND SMOOTH SHUFFLING SLOT ANIMATION
  // -------------------------------------------------------------
  useEffect(() => {
    if (state.phase === 'PLAYER_SELECTION' && allPlayersList.length > 0) {
      const interval = setInterval(() => {
        const randomIdx = Math.floor(Math.random() * allPlayersList.length);
        setShufflingName(allPlayersList[randomIdx].displayName);
      }, 70);

      return () => clearInterval(interval);
    }
  }, [state.phase, allPlayersList.length]);

  const handleCopyRoomCode = () => {
    const code = state.roomCode || roomCode || 'ROOM1';
    const pass = roomPassword || '1234';
    navigator.clipboard.writeText(`ROOM ID: ${code} | PASS: ${pass}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isTargetPlayer = playerId === state.selectedPlayerId;
  const hasAlreadyProposed = (state.proposals || []).some((p: ChallengeProposal) => p.proposerId === playerId);

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isTargetPlayer || hasAlreadyProposed) return;
    const text = proposalInput.trim();
    if (text.length < 4 || text.length > 80) return;

    NetworkClient.submitProposal(text);

    // Optimistic store sync for instant UI responsiveness
    if (soloGameState && soloGameState.phase === 'DISCUSSION_AND_VOTING') {
      const newProp: ChallengeProposal = {
        id: `prop_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        proposerId: playerId,
        proposerName: localPlayer?.displayName || 'YOU',
        text,
        votesCount: 0,
        voterIds: [],
      };
      const updatedProposals = [...(soloGameState.proposals || []), newProp];
      useGameStore.getState().updateSoloGameState({ ...soloGameState, proposals: updatedProposals });
    }

    setProposalInput('');
  };

  const handleVoteProposal = (proposalId: string) => {
    const targetProp = (soloGameState?.proposals || []).find((p: ChallengeProposal) => p.id === proposalId);
    if (!targetProp || targetProp.proposerId === playerId) return;

    NetworkClient.voteProposal(proposalId);

    // Optimistic store sync for instant UI responsiveness
    if (soloGameState) {
      const alreadyVotedTarget = targetProp.voterIds.includes(playerId);
      const updatedProposals = (soloGameState.proposals || []).map((prop: ChallengeProposal) => {
        // Single vote rule: clear player's vote from all proposals first
        const voterIds = prop.voterIds.filter((id: string) => id !== playerId);
        
        // If not already voted on target, cast vote now
        if (prop.id === proposalId && !alreadyVotedTarget) {
          voterIds.push(playerId);
        }

        return {
          ...prop,
          voterIds,
          votesCount: voterIds.length,
        };
      });
      useGameStore.getState().updateSoloGameState({ ...soloGameState, proposals: updatedProposals });
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    NetworkClient.sendChat(text);

    // Optimistic store sync for instant UI responsiveness
    if (soloGameState) {
      const newMsg: ChatMessage = {
        id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        senderId: playerId,
        senderName: localPlayer?.displayName || 'YOU',
        text,
        timestamp: Date.now(),
      };
      const updatedMessages = [...(soloGameState.chatMessages || []), newMsg];
      useGameStore.getState().updateSoloGameState({ ...soloGameState, chatMessages: updatedMessages });
    }

    setChatInput('');
  };

  const isChatPanelOpen =
    state.phase === 'DISCUSSION_AND_VOTING' ||
    state.phase === 'LEADER_CONFIRMATION' ||
    state.phase === 'CHALLENGE_EXECUTION' ||
    state.phase === 'ROUND_RESULT';

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'auto',
        zIndex: 10,
        boxSizing: 'border-box',
        backgroundImage: "url('/cabin1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP CORNER ROOM ID, PASS & TIMER BADGES (LOBBY ONLY) */}
      {/* ------------------------------------------------------------- */}
      {state.phase === 'LOBBY' && (
        <div style={{ position: 'absolute', top: '24px', left: '24px', pointerEvents: 'auto' }}>
          <div
            onClick={handleCopyRoomCode}
            style={{
              padding: '10px 20px',
              background: 'rgba(28, 28, 30, 0.88)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              userSelect: 'none',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            }}
            title="Click to copy Room ID & Password"
          >
            <div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 700, letterSpacing: '0.08em' }}>ROOM ID</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.08em', fontFamily: "'Kanit', sans-serif" }}>
                {state.roomCode || roomCode || 'ROOM1'}
              </div>
            </div>

            <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.18)', paddingLeft: '16px' }}>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 700, letterSpacing: '0.08em' }}>PASS</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ff3b30', letterSpacing: '0.08em', fontFamily: "'Kanit', sans-serif" }}>
                {roomPassword || '1234'}
              </div>
            </div>

            <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.18)', paddingLeft: '12px' }}>
              {copied ? <Check size={18} color="#34c759" /> : <Copy size={18} color="rgba(255, 255, 255, 0.8)" />}
            </div>
          </div>
        </div>
      )}

      {state.phase === 'LOBBY' && (
        <div style={{ position: 'absolute', top: '24px', right: '24px', pointerEvents: 'auto' }}>
          <div
            style={{
              padding: '10px 24px',
              background: 'rgba(28, 28, 30, 0.88)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.65)', letterSpacing: '0.1em' }}>
              JOIN WINDOW
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', fontFamily: "'Kanit', sans-serif" }}>
              {Math.floor(state.phaseTimeRemaining / 60)}:{(state.phaseTimeRemaining % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. REAL TV SCREEN WITH PURE WHITE TEXT (NO GLOW) */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          position: 'absolute',
          top: '23.0%',
          left: '33.0%',
          width: '41.0%',
          height: '32.5%',
          background: 'radial-gradient(circle at 50% 30%, #0d1527 0%, #050811 100%)',
          border: '4px solid #1e293b',
          borderRadius: '12px',
          boxShadow: '0 0 35px rgba(0, 240, 255, 0.15), inset 0 0 40px rgba(0, 0, 0, 0.95)',
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Phase: LOBBY / CABIN FREE ROAM - Joined Players Roster (Scrollable) */}
        {state.phase === 'LOBBY' && (
          <div
            style={{
              width: '100%',
              height: '100%',
              padding: '12px 16px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* LED Roster Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '6px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '8px',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} color="#ffffff" /> CABIN PLAYERS ROSTER
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffffff' }}>
                {allPlayersList.length} / 8 JOINED
              </div>
            </div>

            {/* Scrollable Player List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                paddingRight: '4px',
              }}
            >
              {allPlayersList.map((p, idx) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 12px',
                    background: p.id === playerId ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#ffffff', width: '22px' }}>
                      #{idx + 1}
                    </span>
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#ffffff',
                      }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>
                      {p.displayName} {p.id === playerId ? '(YOU)' : ''}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 900,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    READY
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Phase: PLAYER SELECTION - 5-SECOND SMOOTH SHUFFLING ANIMATION */}
        {state.phase === 'PLAYER_SELECTION' && (
          <div style={{ textAlign: 'center', padding: '16px', width: '100%' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#00f0ff', letterSpacing: '0.2em' }}>
              SHUFFLING PLAYERS...
            </div>
            
            <div
              style={{
                fontSize: '2.4rem',
                fontWeight: 900,
                color: '#ffffff',
                margin: '12px 0',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '12px 24px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                letterSpacing: '0.08em',
                fontFamily: "'Kanit', sans-serif",
                textShadow: '0 0 15px rgba(0, 240, 255, 0.5)',
              }}
            >
              {state.phaseTimeRemaining > 2
                ? shufflingName.toUpperCase() || 'SHUFFLING...'
                : (selectedPlayer ? selectedPlayer.displayName.toUpperCase() : 'SELECTED!')}
            </div>

            <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 800 }}>
              {state.phaseTimeRemaining > 2 ? 'SELECTING TARGET PLAYER FOR ROUND 1...' : 'TARGET PLAYER SELECTED!'}
            </div>
          </div>
        )}

        {/* Phase: DISCUSSION AND VOTING */}
        {state.phase === 'DISCUSSION_AND_VOTING' && (
          <div style={{ width: '100%', height: '100%', position: 'relative', padding: '16px 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* Top Bar: Target Player Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.1em' }}>
                  TARGET PLAYER
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, fontStyle: 'italic', color: '#ff2a5f', fontFamily: "'Kanit', sans-serif", letterSpacing: '0.04em', marginTop: '2px' }}>
                  {selectedPlayer ? selectedPlayer.displayName.toUpperCase() : 'PLAYER'}
                </div>
              </div>
              <div style={{ padding: '4px 12px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.08em' }}>
                ROUND {state.currentRound} / {state.totalRounds}
              </div>
            </div>

            {/* Center Crisp Pure White Italic Bold Timer */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.12em', marginBottom: '6px' }}>
                CHOOSE A DARE IN :
              </div>
              <div
                style={{
                  fontSize: '3.6rem',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  color: '#ffffff',
                  fontFamily: "'Kanit', sans-serif",
                  letterSpacing: '0.05em',
                  lineHeight: 1,
                  textShadow: 'none',
                }}
              >
                {Math.floor(state.phaseTimeRemaining / 60)} : {(state.phaseTimeRemaining % 60).toString().padStart(2, '0')}
              </div>
            </div>

            {/* Bottom testing skip trigger */}
            <div style={{ textAlign: 'center', paddingBottom: '2px' }}>
              <button
                type="button"
                onClick={() => NetworkClient.skipPhase()}
                style={{
                  padding: '4px 14px',
                  borderRadius: '50px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                }}
              >
                SKIP TIMER (TESTING)
              </button>
            </div>
          </div>
        )}

        {/* Phase: LEADER CONFIRMATION */}
        {state.phase === 'LEADER_CONFIRMATION' && (
          <div style={{ width: '100%', height: '100%', padding: '16px 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.12em', marginBottom: '6px' }}>
              WINNING DARE FOR <span style={{ color: '#ff2a5f', fontWeight: 900, fontStyle: 'italic' }}>{selectedPlayer ? selectedPlayer.displayName.toUpperCase() : 'PLAYER'}</span>
            </div>

            <div
              style={{
                width: '94%',
                padding: '14px 20px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '16px',
                textAlign: 'center',
                marginBottom: '12px',
              }}
            >
              <div style={{ fontSize: '1.25rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', lineHeight: 1.3 }}>
                "{state.winningProposal ? state.winningProposal.text : 'Do 10 pushups live on stream!'}"
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800, marginTop: '6px' }}>
                Votes Received: {state.winningProposal ? state.winningProposal.votesCount : 0}
              </div>
            </div>

            {playerId === state.leaderPlayerId ? (
              <button
                type="button"
                onClick={() => NetworkClient.confirmChallenge()}
                style={{
                  padding: '10px 28px',
                  fontSize: '0.85rem',
                  background: '#ffffff',
                  color: '#000000',
                  fontWeight: 900,
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                }}
              >
                CONFIRM & START 3-MIN TIMER
              </button>
            ) : (
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.6)' }}>
                Waiting for Leader ({leaderPlayer?.displayName || 'Leader'}) to start... ({state.phaseTimeRemaining}s)
              </div>
            )}
          </div>
        )}

        {/* Phase: CHALLENGE EXECUTION (2-ZONE SPLIT: LEFT TASK CARD & RIGHT CRISP ITALIC TIMER) */}
        {state.phase === 'CHALLENGE_EXECUTION' && (
          <div style={{ width: '100%', height: '100%', padding: '14px 18px', boxSizing: 'border-box', display: 'flex', gap: '14px', alignItems: 'center' }}>
            {/* Left 54%: Rich Target Task Glass Card */}
            <div
              style={{
                flex: 1,
                height: '100%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: '14px',
                padding: '14px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                textAlign: 'left',
              }}
            >
              {/* Bold Top Statement with Player Highlight */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '6px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.08em' }}>
                  TARGET TASK : <span style={{ color: '#ff2a5f', fontStyle: 'italic', fontSize: '0.95rem' }}>{selectedPlayer ? selectedPlayer.displayName.toUpperCase() : 'PLAYER'}</span>
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 900, color: '#10b981', padding: '2px 8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '4px' }}>
                  IN PROGRESS
                </div>
              </div>

              {/* Center Dare Text Box */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '8px 0' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', lineHeight: 1.3, fontFamily: "'Kanit', sans-serif" }}>
                  "{state.winningProposal ? state.winningProposal.text : 'Complete Challenge'}"
                </div>
              </div>

              {/* Bottom Proposer & Vote Stats Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '6px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.7)' }}>
                  By {state.winningProposal ? state.winningProposal.proposerName : 'System'}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#00f0ff' }}>
                  {state.winningProposal ? state.winningProposal.votesCount : 0} Vote(s)
                </div>
              </div>
            </div>

            {/* Right 48%: Crisp Pure White Italic Bold Digital Timer Hub */}
            <div
              style={{
                width: '46%',
                height: '100%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '14px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.12em', marginBottom: '4px' }}>
                EXECUTION TIME :
              </div>

              <div
                style={{
                  fontSize: '3.4rem',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  color: '#ffffff',
                  fontFamily: "'Kanit', sans-serif",
                  letterSpacing: '0.05em',
                  lineHeight: 1,
                  textShadow: 'none',
                }}
              >
                {Math.floor(state.phaseTimeRemaining / 60)} : {(state.phaseTimeRemaining % 60).toString().padStart(2, '0')}
              </div>

              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.6)', marginTop: '6px', letterSpacing: '0.04em' }}>
                EXECUTE BEFORE TIMER EXPIRES
              </div>
            </div>
          </div>
        )}

        {/* Phase: ROUND RESULT (ROUND FINISHED & NEXT ROUND STARTING IN X SECONDS WITH 60FPS GPU DIAGONAL SKEW SHUTTERS) */}
        {state.phase === 'ROUND_RESULT' && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              padding: '16px 20px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              overflow: 'hidden',
            }}
          >
            {/* TV Screen Left Diagonal Skutter Door (GPU SkewX) */}
            <div
              style={{
                position: 'absolute',
                top: '-30%',
                left: '-30%',
                width: '90%',
                height: '160%',
                background: 'linear-gradient(135deg, #09040e 0%, #170924 100%)',
                borderRight: '3px solid #ff0066',
                boxShadow: '8px 0 25px rgba(255, 0, 102, 0.7)',
                transform: `skewX(-28deg) translate3d(${isTvGateClosed ? '0%' : '-115%'}, 0, 0)`,
                transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            />

            {/* TV Screen Right Diagonal Skutter Door (GPU SkewX) */}
            <div
              style={{
                position: 'absolute',
                top: '-30%',
                right: '-30%',
                width: '90%',
                height: '160%',
                background: 'linear-gradient(135deg, #170924 0%, #09040e 100%)',
                borderLeft: '3px solid #ff0066',
                boxShadow: '-8px 0 25px rgba(255, 0, 102, 0.7)',
                transform: `skewX(-28deg) translate3d(${isTvGateClosed ? '0%' : '115%'}, 0, 0)`,
                transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            />

            {/* TV Screen Center Floating NEXT ROUND Card */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: isTvGateClosed ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.5)',
                opacity: isTvGateClosed ? 1 : 0,
                zIndex: 15,
                transition: 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.35s ease',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  padding: '10px 24px',
                  background: 'rgba(15, 6, 20, 0.95)',
                  border: '2px solid #ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 0 30px rgba(255, 0, 102, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3)',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', fontStyle: 'italic', fontFamily: "'Kanit', sans-serif", letterSpacing: '0.08em' }}>
                  NEXT ROUND
                </div>
              </div>
            </div>

            {/* TV Content behind shutters */}
            <div style={{ padding: '4px 14px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.12em', marginBottom: '10px' }}>
              ✓ DARE TIMER EXPIRED
            </div>

            <div style={{ fontSize: '3.2rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Kanit', sans-serif", letterSpacing: '0.06em', margin: '4px 0', lineHeight: 1 }}>
              NEXT ROUND
            </div>

            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.8)', letterSpacing: '0.04em', marginTop: '8px' }}>
              STARTING IN <span style={{ fontSize: '1.4rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff' }}>{state.phaseTimeRemaining}</span> SECONDS...
            </div>
          </div>
        )}

        {/* Phase: GAME OVER CHAMPION */}
        {state.phase === 'GAME_OVER_CHAMPION' && (
          <div style={{ textAlign: 'center', padding: '14px' }}>
            <Trophy size={36} color="#ffffff" style={{ margin: '0 auto 4px' }} />
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', fontStyle: 'italic', margin: '4px 0', textShadow: 'none' }}>
              {championPlayer ? championPlayer.displayName.toUpperCase() : 'ONE CHAMPION'}
            </h1>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. RIGHT SIDE SLIDING CHAT & CHALLENGE PANEL (1:1 APPLE UI) */}
      {/* ------------------------------------------------------------- */}
      {isChatPanelOpen && (
        <div
          className="panel-slide-in"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '360px',
            height: 'calc(100vh - 40px)',
            background: 'rgba(9, 13, 22, 0.96)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '28px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            padding: '18px',
            boxSizing: 'border-box',
            pointerEvents: 'auto',
            zIndex: 20,
          }}
        >
          {/* Top Left Header Pill Badge (Matching Mockup) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ padding: '6px 12px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={14} color="#ffffff" /> LIVE CHAT & DARES
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 900, color: 'rgba(255, 255, 255, 0.6)', letterSpacing: '0.08em' }}>
              ROUND {state.currentRound}
            </div>
          </div>

          {/* Apple UI Section 1: PROPOSE A DARE - */}
          {state.phase === 'DISCUSSION_AND_VOTING' && (
            <>
              <div
                style={{
                  marginBottom: '14px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '22px',
                  padding: '14px 16px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxSizing: 'border-box',
                  width: '100%',
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#ffffff', marginBottom: '10px', letterSpacing: '0.06em' }}>
                  PROPOSE A DARE -
                </div>
                <form onSubmit={handleProposalSubmit} style={{ display: 'flex', gap: '8px', width: '100%', boxSizing: 'border-box', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={proposalInput}
                    disabled={isTargetPlayer || hasAlreadyProposed}
                    onChange={(e) => setProposalInput(e.target.value)}
                    placeholder={
                      isTargetPlayer
                        ? 'Target Player cannot submit dares'
                        : hasAlreadyProposed
                        ? '✓ 1 Dare submitted for this round'
                        : 'Suggest a dare...'
                    }
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: '10px 14px',
                      borderRadius: '50px',
                      background: (isTargetPlayer || hasAlreadyProposed) ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      color: (isTargetPlayer || hasAlreadyProposed) ? 'rgba(255, 255, 255, 0.4)' : '#ffffff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      outline: 'none',
                      cursor: (isTargetPlayer || hasAlreadyProposed) ? 'not-allowed' : 'text',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isTargetPlayer || hasAlreadyProposed || proposalInput.trim().length < 4 || proposalInput.trim().length > 80}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '50px',
                      background: (isTargetPlayer || hasAlreadyProposed || proposalInput.trim().length < 4) ? 'rgba(255, 255, 255, 0.15)' : '#0088ff',
                      color: (isTargetPlayer || hasAlreadyProposed || proposalInput.trim().length < 4) ? 'rgba(255, 255, 255, 0.4)' : '#ffffff',
                      fontWeight: 900,
                      border: 'none',
                      fontSize: '0.78rem',
                      cursor: (isTargetPlayer || hasAlreadyProposed || proposalInput.trim().length < 4) ? 'not-allowed' : 'pointer',
                      boxShadow: (isTargetPlayer || hasAlreadyProposed || proposalInput.trim().length < 4) ? 'none' : '0 4px 12px rgba(0, 136, 255, 0.4)',
                      flexShrink: 0,
                    }}
                  >
                    SUBMIT
                  </button>
                </form>
              </div>

              {/* Apple UI Section 2: VOTE FOR THE BEST DARE - */}
              <div
                style={{
                  marginBottom: '14px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#ffffff', marginBottom: '12px', letterSpacing: '0.06em' }}>
                  VOTE FOR THE BEST DARE -
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '280px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingRight: '2px' }}>
                  {state.proposals.map((prop: ChallengeProposal) => {
                    const isOwnProposal = prop.proposerId === playerId;
                    const hasVoted = prop.voterIds.includes(playerId);

                    return (
                      <div
                        key={prop.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          padding: '14px 16px',
                          background: isOwnProposal ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.12)',
                          border: isOwnProposal ? '1px dashed rgba(255, 255, 255, 0.25)' : '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '20px',
                        }}
                      >
                        <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.88rem', lineHeight: 1.3 }}>
                          {prop.text}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>By {prop.proposerName} {isOwnProposal ? '(YOU)' : ''}</span>
                          {isOwnProposal && (
                            <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(255, 0, 127, 0.15)', border: '1px solid rgba(255, 0, 127, 0.3)', borderRadius: '4px', color: '#ff66b3', fontWeight: 800 }}>YOUR PROPOSAL</span>
                          )}
                        </div>
                        <button
                          type="button"
                          disabled={isOwnProposal}
                          onClick={() => handleVoteProposal(prop.id)}
                          style={{
                            width: '100%',
                            padding: '10px 0',
                            borderRadius: '50px',
                            background: isOwnProposal
                              ? 'rgba(255, 255, 255, 0.08)'
                              : hasVoted
                              ? '#10b981'
                              : '#0088ff',
                            color: isOwnProposal ? 'rgba(255, 255, 255, 0.35)' : '#ffffff',
                            border: 'none',
                            fontSize: '0.82rem',
                            fontWeight: 900,
                            cursor: isOwnProposal ? 'not-allowed' : 'pointer',
                            textAlign: 'center',
                            boxShadow: isOwnProposal
                              ? 'none'
                              : hasVoted
                              ? '0 4px 12px rgba(16, 185, 129, 0.4)'
                              : '0 4px 12px rgba(0, 136, 255, 0.4)',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {isOwnProposal
                            ? `CANNOT VOTE OWN (${prop.votesCount})`
                            : hasVoted
                            ? `✓ VOTED (${prop.votesCount})`
                            : `VOTE (${prop.votesCount})`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Apple UI Section 3: LIVE CHAT MESSAGES & BOTTOM INPUT BAR */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '160px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#ffffff', marginBottom: '8px', letterSpacing: '0.06em' }}>
              CHATS -
            </div>
            <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px', marginBottom: '12px' }}>
              {state.chatMessages.map((msg: ChatMessage) => (
                <div
                  key={msg.id}
                  style={{
                    fontSize: '0.82rem',
                    lineHeight: 1.4,
                    background: 'rgba(255, 255, 255, 0.07)',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span style={{ fontWeight: 900, color: '#ffffff' }}>{msg.senderName}: </span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{msg.text}</span>
                </div>
              ))}
            </div>

            {/* Pill Chat Input Bar & Circular Send Button */}
            <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a chat message..."
                style={{
                  flex: 1,
                  padding: '10px 18px',
                  borderRadius: '50px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Send size={16} color="#000000" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. BOTTOM QUICK START & SKIP BUTTONS (FOR IMMEDIATE TESTING) */}
      {/* ------------------------------------------------------------- */}
      {state.phase === 'LOBBY' && (
        <div style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'auto', zIndex: 30 }}>
          <button
            className="cyber-button glow"
            onClick={() => NetworkClient.send({ type: 'START_SOLO_GAME', payload: {} })}
            style={{
              padding: '14px 36px',
              fontSize: '1.2rem',
              fontWeight: 900,
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#ffffff',
              boxShadow: 'none',
              border: '2px solid #ffffff',
              borderRadius: '16px',
              cursor: 'pointer',
              color: '#000000',
            }}
          >
            <Play size={22} color="#000000" /> START MATCH NOW (TESTING)
          </button>
        </div>
      )}

      {state.phase !== 'LOBBY' && state.phase !== 'GAME_OVER_CHAMPION' && (
        <div style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'auto', zIndex: 30 }}>
          <button
            type="button"
            onClick={() => NetworkClient.skipPhase()}
            style={{
              padding: '12px 28px',
              fontSize: '0.95rem',
              fontWeight: 900,
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ff007f',
              boxShadow: '0 0 20px rgba(255, 0, 127, 0.6)',
              border: '2px solid #ffffff',
              borderRadius: '16px',
              cursor: 'pointer',
              color: '#ffffff',
            }}
          >
          </button>
        </div>
      )}

      {/* BOTTOM LEFT CORNER EXIT ARROW BUTTON - CLEAN iOS UI */}
      <button
        className="hud-interactive"
        onClick={() => setShowExitConfirm(true)}
        title="Exit Cabin Room"
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'rgba(28, 28, 30, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          zIndex: 40,
          pointerEvents: 'auto',
          transition: 'transform 0.15s ease',
        }}
      >
        <ArrowLeft size={22} color="#ffffff" strokeWidth={2.2} />
      </button>

      {/* EXIT CONFIRMATION MODAL OVERLAY - PURE iOS UI */}
      {showExitConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              width: '360px',
              background: 'rgba(28, 28, 30, 0.94)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '22px',
              padding: '24px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowLeft size={24} color="#ffffff" strokeWidth={2.2} />
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
                  color: '#ffffff',
                  letterSpacing: '-0.01em',
                }}
              >
                Exit Cabin Room?
              </div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)', marginTop: '6px', fontWeight: 500, lineHeight: 1.45 }}>
                Are you sure you want to leave this room lobby and return to the main menu?
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button
                className="hud-interactive"
                onClick={() => setShowExitConfirm(false)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                }}
              >
                Cancel
              </button>

              <button
                className="hud-interactive"
                onClick={() => {
                  setShowExitConfirm(false);
                  NetworkClient.send({ type: 'LEAVE_ROOM', payload: {} });
                  triggerGateTransition(() => {
                    setScreen('MAIN_MENU');
                  }, 'MAIN MENU', 'CLASHA');
                }}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#ff3b30',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                }}
              >
                Exit Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
