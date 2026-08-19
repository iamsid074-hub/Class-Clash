import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayerState } from '@class-clash/shared';
import { Html } from '@react-three/drei';

interface PlayerMeshProps {
  player: PlayerState;
  isLocal: boolean;
}

export const PlayerMesh: React.FC<PlayerMeshProps> = ({ player, isLocal }) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  const teamColor = player.teamId === 'team_1' || player.teamId === 't1' ? '#ff007f' : '#0284c7';

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const time = clock.getElapsedTime();
    const isMoving = Math.abs(player.velocity.x) > 0.1 || Math.abs(player.velocity.z) > 0.1;
    const isAirborne = !player.isGrounded;
    const speed = Math.sqrt(player.velocity.x ** 2 + player.velocity.z ** 2);

    // Procedural Animation Blending
    if (isAirborne) {
      // Airborne / Jump Pose
      if (leftArmRef.current) leftArmRef.current.rotation.x = -Math.PI * 0.7;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.PI * 0.7;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0.4;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -0.4;
    } else if (isMoving) {
      // Running Stride Motion
      const strideFreq = Math.min(18, speed * 2.2);
      const armAngle = Math.sin(time * strideFreq) * 0.65;
      const legAngle = Math.sin(time * strideFreq) * 0.75;

      if (leftArmRef.current) leftArmRef.current.rotation.x = armAngle;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -armAngle;
      if (leftLegRef.current) leftLegRef.current.rotation.x = -legAngle;
      if (rightLegRef.current) rightLegRef.current.rotation.x = legAngle;

      // Subtle body bounce & turn lean
      groupRef.current.position.y = player.position.y + Math.abs(Math.sin(time * strideFreq * 2)) * 0.08;
    } else {
      // Idle Breathing Motion
      const breathe = Math.sin(time * 3) * 0.04;
      if (leftArmRef.current) leftArmRef.current.rotation.x = breathe;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -breathe;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      groupRef.current.position.y = player.position.y + breathe * 0.5;
    }

    // Stumble Wobble Effect
    if (player.status === 'STUMBLING') {
      groupRef.current.rotation.z = Math.sin(time * 25) * 0.35;
    } else {
      groupRef.current.rotation.z = 0;
    }
  });

  return (
    <group ref={groupRef} position={[player.position.x, player.position.y, player.position.z]} rotation={[0, player.rotationY, 0]}>
      {/* ------------------------------------------------------------- */}
      {/* 1. STYLIZED HEAD WITH EYES, EYEBROWS & VISOR */}
      {/* ------------------------------------------------------------- */}
      <group ref={headRef} position={[0, 1.45, 0]}>
        {/* Rounded Head Geometry */}
        <mesh castShadow>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>

        {/* Visor / Helmet Cap */}
        <mesh position={[0, 0.12, -0.05]}>
          <sphereGeometry args={[0.39, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={teamColor} roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Expressive Eyes */}
        <mesh position={[-0.12, 0.05, 0.32]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} />
        </mesh>
        <mesh position={[0.12, 0.05, 0.32]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} />
        </mesh>

        {/* Eye Catchlight Highlights */}
        <mesh position={[-0.10, 0.07, 0.37]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.14, 0.07, 0.37]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* ------------------------------------------------------------- */}
      {/* 2. ATHLETIC HOODIE TORSO & TEAM ACCENTS */}
      {/* ------------------------------------------------------------- */}
      <group position={[0, 0.8, 0]}>
        {/* Main Athletic Torso */}
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.7, 0.35]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>

        {/* Front Team Chest Stripe */}
        <mesh position={[0, 0, 0.18]}>
          <planeGeometry args={[0.48, 0.25]} />
          <meshStandardMaterial color={teamColor} roughness={0.2} />
        </mesh>

        {/* Shoulder Team Badges */}
        <mesh position={[-0.29, 0.2, 0]}>
          <boxGeometry args={[0.06, 0.15, 0.2]} />
          <meshStandardMaterial color={teamColor} />
        </mesh>
        <mesh position={[0.29, 0.2, 0]}>
          <boxGeometry args={[0.06, 0.15, 0.2]} />
          <meshStandardMaterial color={teamColor} />
        </mesh>
      </group>

      {/* ------------------------------------------------------------- */}
      {/* 3. ARTICULATED ARMS WITH HANDS */}
      {/* ------------------------------------------------------------- */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.35, 1.05, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.45, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.48, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.35, 1.05, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.45, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.48, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
      </group>

      {/* ------------------------------------------------------------- */}
      {/* 4. ARTICULATED LEGS WITH SNEAKERS */}
      {/* ------------------------------------------------------------- */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.16, 0.45, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.11, 0.45, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        {/* Sneaker */}
        <mesh position={[0, -0.45, 0.06]} castShadow>
          <boxGeometry args={[0.16, 0.12, 0.28]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Sneaker Sole Team Trim */}
        <mesh position={[0, -0.5, 0.06]}>
          <boxGeometry args={[0.17, 0.04, 0.29]} />
          <meshStandardMaterial color={teamColor} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.16, 0.45, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.11, 0.45, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        {/* Sneaker */}
        <mesh position={[0, -0.45, 0.06]} castShadow>
          <boxGeometry args={[0.16, 0.12, 0.28]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Sneaker Sole Team Trim */}
        <mesh position={[0, -0.5, 0.06]}>
          <boxGeometry args={[0.17, 0.04, 0.29]} />
          <meshStandardMaterial color={teamColor} />
        </mesh>
      </group>

      {/* ------------------------------------------------------------- */}
      {/* 5. PLAYER NAME TAG & YOU INDICATOR HUD */}
      {/* ------------------------------------------------------------- */}
      <Html position={[0, 2.15, 0]} center distanceFactor={14}>
        <div style={{ background: isLocal ? teamColor : 'rgba(15, 23, 42, 0.88)', color: '#ffffff', padding: '3px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 900, whiteSpace: 'nowrap', border: `1.5px solid ${teamColor}`, boxShadow: `0 0 14px ${teamColor}` }}>
          {player.displayName} {isLocal ? ' (YOU)' : ''}
        </div>
      </Html>
    </group>
  );
};
