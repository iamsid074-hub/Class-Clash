import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { NetworkClient } from '../../networking/NetworkClient';
import { SupabaseAuthService } from '../../networking/supabaseClient';
import { Crown, MessageSquare, Send, Trophy, Users, CheckCircle, Zap, Shield, Play, Lock, Copy, Check, Sparkles, ArrowLeft } from 'lucide-react';
import { ChallengeProposal, ChatMessage } from '@class-clash/shared';
import { AudioManager } from '../../utils/AudioManager';
import { Cabin2RainEffect } from '../components/Cabin2RainEffect';

export const SoloPartyCabinScreen: React.FC = () => {
  const { playerId, displayName, soloGameState, roomCode, roomPassword, cabinName, cabinTemplate, players, isConnected, setScreen, triggerGateTransition } = useGameStore();
  const [proposalInput, setProposalInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [shufflingName, setShufflingName] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showStartVideo, setShowStartVideo] = useState(false);
  const [videoOpacity, setVideoOpacity] = useState(1);
  const isPlayingStartVideoRef = useRef(false);

  const triggerStartVideoSequence = (onCompleteSequence?: () => void) => {
    if (isPlayingStartVideoRef.current) return;
    isPlayingStartVideoRef.current = true;

    setShowStartVideo(true);
    setVideoOpacity(1);

    // At 2.0s: Smooth Fade-Out over LED screen
    setTimeout(() => {
      setVideoOpacity(0);
    }, 2000);

    // At 2.4s: Finish video sequence & proceed
    setTimeout(() => {
      setShowStartVideo(false);
      isPlayingStartVideoRef.current = false;
      if (onCompleteSequence) onCompleteSequence();
    }, 2400);
  };

  // Check if active user is Admin (iamsid073@gmail.com) or Room Leader/Host
  const isAdmin = useMemo(() => {
    if (typeof window === 'undefined') return true;
    const name = (displayName || '').trim().toLowerCase();
    const savedEmail = (localStorage.getItem('clasha_user_email') || '').trim().toLowerCase();
    
    // Always grant admin access for iamsid073@gmail.com, VIRAT, or room leader
    if (
      name === 'iamsid073@gmail.com' ||
      name === 'iamsid073' ||
      name.includes('iamsid073') ||
      name === 'virat' ||
      savedEmail === 'iamsid073@gmail.com' ||
      savedEmail.includes('iamsid073') ||
      localStorage.getItem('clasha_is_admin') === 'true' ||
      new URLSearchParams(window.location.search).get('admin') !== 'false'
    ) {
      return true;
    }
    return true; // Default true so Cabin Host can start match anytime
  }, [displayName]);

  // Dynamic Cabin Template Background Visual Renderer
  const activeCabinTemplate = cabinTemplate || soloGameState?.cabinTemplate || 'cabin_1';
  const isCabin2 = activeCabinTemplate === 'cabin_2' || activeCabinTemplate === 'neon_arena_2';
  const cabinBgImage = isCabin2 ? '/cabin2.jpeg' : '/cabin1.png';

  // Cabin 2 Ambient Audio Trigger with Smooth Fade In/Out
  useEffect(() => {
    if (isCabin2) {
      AudioManager.playCabin2Sound();
      return () => {
        AudioManager.stopCabin2Sound();
      };
    }
  }, [isCabin2]);

  const allPlayersList = Object.values(players);
  const localPlayer = players[playerId];

  const state = soloGameState || {
    roomCode: roomCode || 'ROOM1',
    isLocked: false,
    currentRound: 1,
    totalRounds: 3,
    phase: 'LOBBY',
    phaseTimeRemaining: 10, // TEMPORARY: 10s for fast testing (Original: 180s)
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

  const sortedPodiumPlayers = useMemo(() => {
    return [...allPlayersList].sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [allPlayersList]);

  const isMatchFinished =
    state.phase === 'GAME_OVER_CHAMPION' ||
    (state.phase === 'ROUND_RESULT' && state.currentRound >= state.totalRounds);

  const hasSavedResultRef = useRef(false);

  useEffect(() => {
    if (isMatchFinished) {
      if (!hasSavedResultRef.current) {
        hasSavedResultRef.current = true;
        const myPlayer = players[playerId];
        const pts = myPlayer ? (myPlayer.score || 100) : 100;
        SupabaseAuthService.addMatchResult(pts);
      }
    }
  }, [isMatchFinished, playerId, players]);

  const [isTvGateClosed, setIsTvGateClosed] = useState(state.phase === 'ROUND_RESULT');

  // Seamless shutter sequence: Shutters start CLOSED on phase entry, hold card, then slide OPEN smoothly!
  useEffect(() => {
    if (state.phase === 'ROUND_RESULT') {
      setIsTvGateClosed(true);
      const timer = setTimeout(() => {
        setIsTvGateClosed(false);
      }, 1400);
      return () => clearTimeout(timer);
    } else {
      setIsTvGateClosed(false);
    }
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

  // Local fallback timer decrement & auto-phase progression (works seamlessly online & offline/Vercel)
  useEffect(() => {
    const interval = setInterval(() => {
      const isConnected = useGameStore.getState().isConnected;
      const storeState = useGameStore.getState().soloGameState || state;

      if (storeState) {
        if (!isConnected) {
          // If offline / disconnected on Vercel, decrement timer locally
          if (storeState.phaseTimeRemaining > 0) {
            useGameStore.getState().updateSoloGameState({
              ...storeState,
              phaseTimeRemaining: storeState.phaseTimeRemaining - 1,
            });
          } else {
            // Auto advance phases locally if time expires offline
            if (storeState.phase === 'LOBBY') {
              useGameStore.getState().updateSoloGameState({
                ...storeState,
                isLocked: true,
                phase: 'PLAYER_SELECTION',
                phaseTimeRemaining: 10, // TEMPORARY: 10s (Original: 5s)
                selectedPlayerId: playerId,
              });
            } else if (storeState.phase === 'PLAYER_SELECTION') {
              useGameStore.getState().updateSoloGameState({
                ...storeState,
                phase: 'DISCUSSION_AND_VOTING',
                phaseTimeRemaining: 10, // TEMPORARY: 10s (Original: 120s)
              });
            } else if (storeState.phase === 'DISCUSSION_AND_VOTING') {
              const winningProp = (storeState.proposals && storeState.proposals.length > 0)
                ? [...storeState.proposals].sort((a, b) => b.votesCount - a.votesCount)[0]
                : {
                    id: 'fallback_dare',
                    proposerId: 'system',
                    proposerName: 'SYSTEM',
                    text: 'Do 10 Pushups or Sing a Song live on mic!',
                    votesCount: 0,
                    voterIds: [],
                  };
              useGameStore.getState().updateSoloGameState({
                ...storeState,
                winningProposal: winningProp,
                leaderPlayerId: playerId,
                phase: 'LEADER_CONFIRMATION',
                phaseTimeRemaining: 10, // TEMPORARY: 10s (Original: 12s)
              });
            } else if (storeState.phase === 'LEADER_CONFIRMATION') {
              useGameStore.getState().updateSoloGameState({
                ...storeState,
                phase: 'CHALLENGE_EXECUTION',
                phaseTimeRemaining: 10, // TEMPORARY: 10s (Original: 180s)
              });
            } else if (storeState.phase === 'CHALLENGE_EXECUTION') {
              useGameStore.getState().updateSoloGameState({
                ...storeState,
                phase: 'ROUND_RESULT',
                phaseTimeRemaining: 10, // TEMPORARY: 10s (Original: 8s)
              });
            } else if (storeState.phase === 'ROUND_RESULT') {
              if ((storeState.currentRound || 1) < (storeState.totalRounds || 3)) {
                useGameStore.getState().updateSoloGameState({
                  ...storeState,
                  currentRound: (storeState.currentRound || 1) + 1,
                  phase: 'PLAYER_SELECTION',
                  phaseTimeRemaining: 10, // TEMPORARY: 10s (Original: 5s)
                  selectedPlayerId: playerId,
                });
              } else {
                useGameStore.getState().updateSoloGameState({
                  ...storeState,
                  phase: 'GAME_OVER_CHAMPION',
                  phaseTimeRemaining: 999,
                  championPlayerId: playerId,
                });
              }
            }
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [playerId]);

  // Auto-play 2-second start video on LED screen when 3-min join window timer reaches 0
  useEffect(() => {
    if (state.phase === 'LOBBY' && state.phaseTimeRemaining === 0 && !isPlayingStartVideoRef.current) {
      triggerStartVideoSequence(() => {
        if (NetworkClient.isConnected()) {
          NetworkClient.send({ type: 'START_SOLO_GAME', payload: {} });
        }
        const current = useGameStore.getState().soloGameState || state;
        useGameStore.getState().updateSoloGameState({
          ...current,
          isLocked: true,
          phase: 'PLAYER_SELECTION',
          phaseTimeRemaining: 10, // TEMPORARY: 10s (Original: 5s)
          selectedPlayerId: playerId,
        });
      });
    }
  }, [state.phase, state.phaseTimeRemaining, playerId]);

  const handleStartMatch = () => {
    triggerStartVideoSequence(() => {
      if (NetworkClient.isConnected()) {
        NetworkClient.send({ type: 'START_SOLO_GAME', payload: {} });
      }
      // Always advance state locally as well so UI starts immediately
      const current = useGameStore.getState().soloGameState || state;
      useGameStore.getState().updateSoloGameState({
        ...current,
        isLocked: true,
        phase: 'PLAYER_SELECTION',
        phaseTimeRemaining: 10, // TEMPORARY: 10s (Original: 5s)
        selectedPlayerId: playerId,
      });
    });
  };

  const handlePhaseAction = () => {
    const current = useGameStore.getState().soloGameState || state;

    if (current.phase === 'LOBBY') {
      handleStartMatch();
    } else if (current.phase === 'PLAYER_SELECTION') {
      useGameStore.getState().updateSoloGameState({
        ...current,
        phase: 'DISCUSSION_AND_VOTING',
        phaseTimeRemaining: 10, // TEMPORARY: 10s (Original: 120s)
      });
    } else if (current.phase === 'DISCUSSION_AND_VOTING') {
      const winningProp = (current.proposals && current.proposals.length > 0)
        ? [...current.proposals].sort((a, b) => b.votesCount - a.votesCount)[0]
        : {
            id: 'fallback_dare',
            proposerId: 'system',
            proposerName: 'SYSTEM',
            text: 'Do 10 Pushups or Sing a Song live on mic!',
            votesCount: 0,
            voterIds: [],
          };
      useGameStore.getState().updateSoloGameState({
        ...current,
        winningProposal: winningProp,
        leaderPlayerId: playerId,
        phase: 'LEADER_CONFIRMATION',
        phaseTimeRemaining: 10, // TEMPORARY: 10s (Original: 12s)
      });
    } else if (current.phase === 'LEADER_CONFIRMATION') {
      useGameStore.getState().updateSoloGameState({
        ...current,
        phase: 'CHALLENGE_EXECUTION',
        phaseTimeRemaining: 10, // TEMPORARY: 10s (Original: 180s)
      });
    } else if (current.phase === 'CHALLENGE_EXECUTION') {
      useGameStore.getState().updateSoloGameState({
        ...current,
        phase: 'ROUND_RESULT',
        phaseTimeRemaining: 10, // TEMPORARY: 10s (Original: 8s)
      });
    } else if (current.phase === 'ROUND_RESULT') {
      if ((current.currentRound || 1) < (current.totalRounds || 3)) {
        useGameStore.getState().updateSoloGameState({
          ...current,
          currentRound: (current.currentRound || 1) + 1,
          phase: 'PLAYER_SELECTION',
          phaseTimeRemaining: 10, // TEMPORARY: 10s (Original: 5s)
          selectedPlayerId: playerId,
        });
      } else {
        useGameStore.getState().updateSoloGameState({
          ...current,
          phase: 'GAME_OVER_CHAMPION',
          phaseTimeRemaining: 999,
          championPlayerId: playerId,
        });
      }
    }
  };

  const getPhaseButtonContent = () => {
    switch (state.phase) {
      case 'LOBBY':
        return (
          <>
            <Play size={22} color="#000000" fill="#000000" /> START MATCH
          </>
        );
      case 'PLAYER_SELECTION':
        return (
          <>
            <Zap size={22} color="#000000" fill="#000000" /> START SELECTION NOW
          </>
        );
      case 'DISCUSSION_AND_VOTING':
        return (
          <>
            <CheckCircle size={22} color="#000000" /> CONFIRM & START DARE
          </>
        );
      case 'LEADER_CONFIRMATION':
        return (
          <>
            <Play size={22} color="#000000" fill="#000000" /> START DARE TIMER NOW
          </>
        );
      case 'CHALLENGE_EXECUTION':
        return (
          <>
            <CheckCircle size={22} color="#000000" /> COMPLETE CHALLENGE NOW
          </>
        );
      case 'ROUND_RESULT':
        return (
          <>
            <Sparkles size={22} color="#000000" /> START NEXT ROUND
          </>
        );
      default:
        return (
          <>
            <Play size={22} color="#000000" fill="#000000" /> ADVANCE PHASE
          </>
        );
    }
  };

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
        backgroundImage: `url('${cabinBgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}
    >
      {/* 0. DYNAMIC CABIN 2 REAL ANIMATED RAIN & SLIDING GLASS DROPLETS LAYER */}
      {isCabin2 && <Cabin2RainEffect />}

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
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.08em', fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif" }}>
                {state.roomCode || roomCode || 'ROOM1'}
              </div>
            </div>

            <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.18)', paddingLeft: '16px' }}>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 700, letterSpacing: '0.08em' }}>PASS</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ff3b30', letterSpacing: '0.08em', fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif" }}>
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
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif" }}>
              {Math.floor(state.phaseTimeRemaining / 60)}:{(state.phaseTimeRemaining % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. REAL TV SCREEN WITH SMOOTH PHASE ANIMATIONS & TV SCANLINES */}
      {/* ------------------------------------------------------------- */}
      <div
        style={
          isCabin2
            ? {
                position: 'absolute',
                top: '12.5%',
                left: '38.0%',
                width: '31.0%',
                height: '27.5%',
                zIndex: 12,
                background: 'radial-gradient(circle at 50% 30%, #090c15 0%, #030408 100%)',
                border: '6px solid #0a0a0d',
                borderRadius: '6px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.9), inset 0 0 35px rgba(0, 0, 0, 0.95)',
                boxSizing: 'border-box',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }
            : {
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
              }
        }
      >
        {/* Authentic Digital OLED/CRT TV Monitor Scanlines Overlay */}
        <div className="tv-scanlines-overlay" />

        {/* 🎬 START VIDEO OVERLAY ON LED SCREEN (PLAYS FOR 2 SECONDS WITH SMOOTH FADE OUT) */}
        {showStartVideo && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 50,
              background: '#000000',
              opacity: videoOpacity,
              transition: 'opacity 0.4s ease-out',
              overflow: 'hidden',
              borderRadius: 'inherit',
            }}
          >
            <video
              src="/videos/start.mp4"
              autoPlay
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        )}

        {/* Phase: LOBBY / CABIN FREE ROAM - Joined Players Roster (Scrollable) */}
        {state.phase === 'LOBBY' && (
          <div
            key="LOBBY"
            className="tv-phase-animated"
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
                <Users size={14} color="#ffffff" /> {cabinName ? cabinName.toUpperCase() : 'CABIN PLAYERS ROSTER'}
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffffff' }}>
                {allPlayersList.length} / 8 JOINED {!isConnected && '⚠️ OFFLINE'}
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
                    transition: 'all 0.2s ease',
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
          <div key="PLAYER_SELECTION" className="tv-phase-animated" style={{ textAlign: 'center', padding: '16px', width: '100%' }}>
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
                fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif",
                textShadow: '0 0 15px rgba(0, 240, 255, 0.5)',
                transition: 'all 0.15s ease',
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
          <div key="DISCUSSION_AND_VOTING" className="tv-phase-animated" style={{ width: '100%', height: '100%', position: 'relative', padding: '16px 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* Top Bar: Target Player Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.1em' }}>
                  TARGET PLAYER
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, fontStyle: 'italic', color: '#ff2a5f', fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif", letterSpacing: '0.04em', marginTop: '2px' }}>
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
                  fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif",
                  letterSpacing: '0.05em',
                  lineHeight: 1,
                  textShadow: 'none',
                }}
              >
                {Math.floor(state.phaseTimeRemaining / 60)} : {(state.phaseTimeRemaining % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        )}

        {/* Phase: LEADER CONFIRMATION */}
        {state.phase === 'LEADER_CONFIRMATION' && (
          <div key="LEADER_CONFIRMATION" className="tv-phase-animated" style={{ width: '100%', height: '100%', padding: '16px 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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
                className="hud-interactive btn-press-effect"
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
                  transition: 'all 0.15s ease',
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
          <div key="CHALLENGE_EXECUTION" className="tv-phase-animated" style={{ width: '100%', height: '100%', padding: '14px 18px', boxSizing: 'border-box', display: 'flex', gap: '14px', alignItems: 'center' }}>
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
                <div style={{ fontSize: '1.25rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', lineHeight: 1.3, fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif" }}>
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
                  fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif",
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

        {/* Phase: ROUND RESULT (INTERMEDIATE ROUNDS 1-2 ONLY) */}
        {state.phase === 'ROUND_RESULT' && state.currentRound < state.totalRounds && (
          <div key="ROUND_RESULT" className="tv-phase-animated" style={{ position: 'relative', width: '100%', height: '100%', padding: '16px 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', overflow: 'hidden' }}>
            {/* TV Screen Top-Left Diagonal Shutter Panel */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: '#09040e',
                clipPath: isTvGateClosed ? 'polygon(0 0, 100% 0, 0 100%)' : 'polygon(0 0, 0 0, 0 0)',
                transition: 'clip-path 0.45s cubic-bezier(0.77, 0, 0.175, 1)',
                zIndex: 10,
              }}
            />

            {/* TV Screen Bottom-Right Diagonal Shutter Panel */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: '#09040e',
                clipPath: isTvGateClosed ? 'polygon(100% 0, 100% 100%, 0 100%)' : 'polygon(100% 100%, 100% 100%, 100% 100%)',
                transition: 'clip-path 0.45s cubic-bezier(0.77, 0, 0.175, 1)',
                zIndex: 10,
              }}
            />

            {/* Diagonal White Seam Line on TV Screen */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 12,
                opacity: isTvGateClosed ? 1 : 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
              }}
            >
              <svg width="100%" height="100%">
                <line x1="100%" y1="0" x2="0" y2="100%" stroke="#ffffff" strokeWidth="3" />
              </svg>
            </div>

            {/* TV Screen Center Floating NEXT ROUND Card */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: isTvGateClosed ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.7)',
                opacity: isTvGateClosed ? 1 : 0,
                zIndex: 15,
                transition: 'all 0.35s cubic-bezier(0.77, 0, 0.175, 1)',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  padding: '8px 18px',
                  background: '#0a0412',
                  border: '2px solid #ffffff',
                  borderRadius: '14px',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
                  whiteSpace: 'nowrap',
                }}
              >
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', fontStyle: 'italic', fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif", letterSpacing: '0.06em' }}>
                  NEXT ROUND
                </div>
              </div>
            </div>

            {/* TV Content behind shutters */}
            <div style={{ padding: '4px 14px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.12em', marginBottom: '10px' }}>
              ✓ DARE TIMER EXPIRED
            </div>

            <div style={{ fontSize: '3.2rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff', fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif", letterSpacing: '0.06em', margin: '4px 0', lineHeight: 1 }}>
              NEXT ROUND
            </div>

            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.8)', letterSpacing: '0.04em', marginTop: '8px' }}>
              STARTING IN <span style={{ fontSize: '1.4rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff' }}>{state.phaseTimeRemaining}</span> SECONDS...
            </div>
          </div>
        )}

        {/* Phase: GAME OVER CHAMPION or ROUND 3 FINISH - WINNER VIDEO */}
        {(state.phase === 'GAME_OVER_CHAMPION' || (state.phase === 'ROUND_RESULT' && state.currentRound >= state.totalRounds)) && (
          <div
            key="MATCH_FINISHED_PODIUM"
            className="tv-phase-animated"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              background: '#000000',
              overflow: 'hidden',
              borderRadius: 'inherit',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <video
              src="/videos/winner.mp4"
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
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
      {/* 4. BOTTOM START / ADVANCE PHASE ACTION BUTTON (AVAILABLE ACROSS ALL TIMED PHASES FOR ADMIN/HOST) */}
      {/* ------------------------------------------------------------- */}
      {isAdmin && (
        <div style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'auto', zIndex: 30 }}>
          <button
            className="cyber-button glow btn-press-effect"
            onClick={handlePhaseAction}
            style={{
              padding: '14px 36px',
              fontSize: '1.15rem',
              fontWeight: 900,
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#ffffff',
              boxShadow: '0 8px 30px rgba(255, 255, 255, 0.4)',
              border: '2px solid #ffffff',
              borderRadius: '16px',
              cursor: 'pointer',
              color: '#000000',
            }}
          >
            {getPhaseButtonContent()}
          </button>
        </div>
      )}

      {/* BOTTOM LEFT CORNER EXIT ARROW / BACK TO MAIN MENU BUTTON */}
      {isMatchFinished ? (
        <button
          className="hud-interactive btn-press-effect"
          onClick={() => setShowExitConfirm(true)}
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            padding: '12px 26px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ff0066 0%, #ff3385 100%)',
            border: '2px solid #ffffff',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: '1rem',
            fontStyle: 'italic',
            fontFamily: "'Vandria', 'Bebas Neue', 'Anton', 'Misery', 'QUARTZO', 'Kanit', sans-serif",
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(255, 0, 102, 0.55)',
            zIndex: 40,
            pointerEvents: 'auto',
            transition: 'all 0.2s ease',
          }}
        >
          <ArrowLeft size={20} color="#ffffff" strokeWidth={2.5} />
          <span>BACK TO MAIN MENU</span>
        </button>
      ) : (
        <button
          className="hud-interactive btn-press-effect"
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
      )}

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
