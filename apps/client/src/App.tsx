import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameStore } from './state/useGameStore';
import { NetworkClient } from './networking/NetworkClient';
import { PlayerMesh } from './game/rendering/PlayerMesh';
import { SkyFactoryMapMesh } from './game/rendering/SkyFactoryMapMesh';
import { SkyArenaEnvironment } from './game/rendering/SkyArenaEnvironment';
import { ThirdPersonCamera } from './game/rendering/ThirdPersonCamera';
import { SocialLobbyScene } from './game/rendering/SocialLobbyScene';
import { MainMenuBackground } from './game/rendering/MainMenuBackground';

import { CinematicSplashOverlay } from './ui/screens/CinematicSplashOverlay';
import { MainMenuScreen } from './ui/screens/MainMenuScreen';
import { TeamCabinScreen } from './ui/screens/TeamCabinScreen';
import { MatchmakingShuffleScreen } from './ui/screens/MatchmakingShuffleScreen';
import { RacingHudScreen } from './ui/screens/RacingHudScreen';
import { ResultsScreen } from './ui/screens/ResultsScreen';
import { BracketScreen } from './ui/screens/BracketScreen';
import { ChampionScreen } from './ui/screens/ChampionScreen';
import { LeaderboardScreen } from './ui/screens/LeaderboardScreen';
import { ProfileScreen } from './ui/screens/ProfileScreen';
import { AuthScreen } from './ui/screens/AuthScreen';
import { CyberGateTransition } from './ui/components/CyberGateTransition';
import { SupabaseAuthService } from './networking/supabaseClient';

import { SoloPartyCabinScreen } from './ui/screens/SoloPartyCabinScreen';

export const App: React.FC = () => {
  const { screen, setScreen, setDisplayName, playerId, latestSnapshot, players, teams } = useGameStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    NetworkClient.connect();

    // Check for saved session from Supabase or localStorage
    SupabaseAuthService.getSavedSession().then((session) => {
      if (session && session.displayName) {
        setDisplayName(session.displayName);
        setScreen('MAIN_MENU');
      }
    });
  }, []);

  const localPlayer = latestSnapshot?.players[playerId] || players[playerId];
  const renderedPlayers = latestSnapshot ? Object.values(latestSnapshot.players) : Object.values(players);

  const isRacing = screen === 'RACING_HUD' || screen === 'MATCHMAKING_SHUFFLE';
  const isMainMenu = screen === 'MAIN_MENU';

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Cyber Gate Diagonal Shutter Transition */}
      <CyberGateTransition />

      {/* Cinematic Splash Intro Overlay */}
      {showSplash && <CinematicSplashOverlay onComplete={() => setShowSplash(false)} />}

      {/* 3D WebGL Canvas Layer */}
      <Canvas
        shadows
        camera={{ position: [0, 6, -12], fov: 68 }}
        onContextMenu={(e) => e.preventDefault()}
        style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1, pointerEvents: isRacing ? 'auto' : 'none' }}
      >
        {isRacing ? (
          <>
            <SkyArenaEnvironment />
            <SkyFactoryMapMesh />
            {renderedPlayers.map((p) => (
              <PlayerMesh
                key={p.id}
                player={p}
                isLocal={p.id === playerId}
              />
            ))}
            <ThirdPersonCamera
              targetPosition={localPlayer?.position}
              targetRotationY={localPlayer?.rotationY}
              isStumbling={localPlayer?.status === 'STUMBLING' || localPlayer?.status === 'STUNNED'}
            />
          </>
        ) : isMainMenu ? (
          <MainMenuBackground />
        ) : (
          <SocialLobbyScene />
        )}
      </Canvas>

      {/* HTML UI Screen Overlays */}
      {screen === 'AUTH' && <AuthScreen />}
      {screen === 'MAIN_MENU' && <MainMenuScreen />}
      {(screen === 'TEAM_CABIN' || screen === 'JOIN_TEAM' || screen === 'CREATE_TEAM' || screen === 'SOCIAL_LOBBY') && (
        <SoloPartyCabinScreen />
      )}
      {screen === 'MATCHMAKING_SHUFFLE' && <MatchmakingShuffleScreen />}
      {screen === 'RACING_HUD' && <RacingHudScreen />}
      {screen === 'RESULTS' && <ResultsScreen />}
      {screen === 'BRACKET' && <BracketScreen />}
      {screen === 'CHAMPION' && <ChampionScreen />}
      {screen === 'LEADERBOARD' && <LeaderboardScreen />}
      {screen === 'PROFILE' && <ProfileScreen />}
    </div>
  );
};
