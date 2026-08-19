import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SkyArenaEnvironment: React.FC = () => {
  const { scene } = useThree();
  const waterfallRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Explicitly set scene background to vibrant sky blue
    scene.background = new THREE.Color('#389bfe');
  }, [scene]);

  // Subtle animated waterfall motion
  useFrame(({ clock }) => {
    if (waterfallRef.current) {
      waterfallRef.current.position.y = -10 + Math.sin(clock.getElapsedTime() * 3.5) * 0.3;
    }
  });

  return (
    <group>
      {/* ------------------------------------------------------------- */}
      {/* 1. EXTREME BACKGROUND: GUARANTEED SKY DOME & FOG */}
      {/* ------------------------------------------------------------- */}
      <mesh position={[0, 0, 135]}>
        <sphereGeometry args={[750, 32, 32]} />
        <meshBasicMaterial color="#389bfe" side={THREE.BackSide} />
      </mesh>

      <fog attach="fog" args={['#6baeff', 110, 520]} />

      {/* Lighting */}
      <ambientLight intensity={0.9} color="#ffffff" />
      <hemisphereLight args={['#ffffff', '#b3d7ff', 0.85]} />
      <directionalLight
        position={[50, 90, 40]}
        intensity={1.6}
        color="#fff8f0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={340}
        shadow-camera-bottom={-30}
      />

      {/* ------------------------------------------------------------- */}
      {/* 2. QUALITY PASS: IRREGULAR LAYERED MOUNTAIN SILHOUETTES */}
      {/* ------------------------------------------------------------- */}
      <group position={[0, -45, 490]}>
        {/* Layer 1: Far Desaturated Mountain Range */}
        {[-240, -140, -40, 60, 160, 260].map((xPos, idx) => (
          <group key={idx} position={[xPos, (idx % 3) * 12, (idx % 2) * -30]}>
            <mesh scale={[35 + (idx % 4) * 8, 55 + (idx % 3) * 14, 30]}>
              <dodecahedronGeometry args={[1, 1]} />
              <meshStandardMaterial color="#548edb" roughness={0.95} />
            </mesh>
          </group>
        ))}

        {/* Layer 2: Mid Richer Mountain Peaks */}
        {[-180, -80, 20, 120, 220].map((xPos, idx) => (
          <group key={idx} position={[xPos, 15 + (idx % 2) * 18, 40]}>
            <mesh scale={[40 + (idx % 3) * 10, 65 + (idx % 4) * 12, 35]}>
              <dodecahedronGeometry args={[1, 1]} />
              <meshStandardMaterial color="#689ff2" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ------------------------------------------------------------- */}
      {/* 3. QUALITY PASS: CLUSTERED SOFT CLOUD FORMATIONS */}
      {/* ------------------------------------------------------------- */}
      <group position={[0, -32, 135]}>
        {[-210, -100, 0, 100, 210].map((xPos, idx) => (
          <group key={idx} position={[xPos, (idx % 2) * 5, (idx % 3) * 55 - 50]}>
            <mesh position={[0, 0, 0]} scale={[1.4, 0.8, 1.2]}>
              <dodecahedronGeometry args={[26, 1]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.92} roughness={0.95} />
            </mesh>
            <mesh position={[18, -4, 8]} scale={[1.1, 0.7, 1.0]}>
              <dodecahedronGeometry args={[20, 1]} />
              <meshStandardMaterial color="#f0f6ff" transparent opacity={0.9} roughness={0.95} />
            </mesh>
            <mesh position={[-18, -3, -8]} scale={[1.0, 0.6, 0.9]}>
              <dodecahedronGeometry args={[18, 1]} />
              <meshStandardMaterial color="#f0f6ff" transparent opacity={0.9} roughness={0.95} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ------------------------------------------------------------- */}
      {/* 4. QUALITY PASS: ASYMMETRICAL ORGANIC FLOATING ISLANDS */}
      {/* ------------------------------------------------------------- */}
      {[-1, 1].map((side) => (
        <group key={side}>
          {[25, 90, 160, 230, 290].map((zPos, idx) => {
            const xPos = side * (68 + (idx % 3) * 14);
            const yPos = -14 - (idx % 2) * 6;

            return (
              <group key={idx} position={[xPos, yPos, zPos]}>
                {/* Asymmetrical Rocky Base (Layered Dodecahedrons) */}
                <mesh position={[0, -6, 0]} scale={[14, 10, 16]} castShadow receiveShadow>
                  <dodecahedronGeometry args={[1, 1]} />
                  <meshStandardMaterial color="#4a5a6a" roughness={0.9} />
                </mesh>
                <mesh position={[side * 3, -10, 2]} scale={[10, 8, 12]}>
                  <dodecahedronGeometry args={[1, 1]} />
                  <meshStandardMaterial color="#3a4856" roughness={0.9} />
                </mesh>

                {/* Natural Uneven Grass Terrain Cap */}
                <mesh position={[0, 0.4, 0]} scale={[15, 1.4, 17]} castShadow receiveShadow>
                  <dodecahedronGeometry args={[1, 1]} />
                  <meshStandardMaterial color="#43a047" roughness={0.7} />
                </mesh>

                {/* Stylized Rocks on Island */}
                {[-5, 6].map((rX, rIdx) => (
                  <mesh key={rIdx} position={[rX, 1.6, (rIdx % 2) * 4 - 2]} scale={[1.8, 1.2, 1.6]} castShadow>
                    <dodecahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#78909c" roughness={0.8} />
                  </mesh>
                ))}

                {/* Stylized Low-Poly Pine Trees (Trunk + 2-Layer Foliage Cones) */}
                {[-6, 4, 7].map((treeX, tIdx) => (
                  <group key={tIdx} position={[treeX, 2.5, (tIdx % 2) * 6 - 3]}>
                    {/* Trunk */}
                    <mesh position={[0, 0.8, 0]}>
                      <cylinderGeometry args={[0.25, 0.35, 1.6, 8]} />
                      <meshStandardMaterial color="#5d4037" roughness={0.9} />
                    </mesh>
                    {/* Lower Foliage Cone */}
                    <mesh position={[0, 2.2, 0]} castShadow>
                      <coneGeometry args={[2.0, 3.2, 7]} />
                      <meshStandardMaterial color="#2e7d32" roughness={0.7} />
                    </mesh>
                    {/* Upper Foliage Cone */}
                    <mesh position={[0, 3.8, 0]} castShadow>
                      <coneGeometry args={[1.5, 2.8, 7]} />
                      <meshStandardMaterial color="#388e3c" roughness={0.7} />
                    </mesh>
                  </group>
                ))}

                {/* Subtle Waterfall Effect on Selected Islands */}
                {idx % 2 === 0 && (
                  <group ref={waterfallRef} position={[side * -4, -8, 10]}>
                    <mesh>
                      <cylinderGeometry args={[1.2, 1.8, 14, 12]} />
                      <meshStandardMaterial color="#80d8ff" transparent opacity={0.8} emissive="#40c4ff" emissiveIntensity={0.6} />
                    </mesh>
                  </group>
                )}
              </group>
            );
          })}
        </group>
      ))}

      {/* ------------------------------------------------------------- */}
      {/* 5. QUALITY PASS: STADIUM SPECTATOR STANDS & CROWD SILHOUETTES */}
      {/* ------------------------------------------------------------- */}
      <group position={[0, 0, 285]}>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 30, 4, -10]}>
            {/* Stadium Stand Architectural Beveled Structure */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[14, 10, 36]} />
              <meshStandardMaterial color="#f0f3f8" roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Pink LED Accent Band */}
            <mesh position={[0, 5.1, 0]}>
              <boxGeometry args={[14.2, 0.3, 36.2]} />
              <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={0.9} />
            </mesh>
            {/* Instanced Crowd Silhouettes */}
            {[...Array(24)].map((_, cIdx) => (
              <mesh
                key={cIdx}
                position={[
                  (cIdx % 3) * 3 - 3,
                  5.8 + Math.floor(cIdx / 6) * 1.2,
                  Math.floor(cIdx / 3) * 4 - 14,
                ]}
              >
                <capsuleGeometry args={[0.3, 0.6, 8, 8]} />
                <meshStandardMaterial
                  color={cIdx % 4 === 0 ? '#ff007f' : cIdx % 4 === 1 ? '#0088ff' : cIdx % 4 === 2 ? '#ffcc00' : '#ffffff'}
                  roughness={0.5}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
};
