import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SKY_FACTORY_MAP } from '@class-clash/shared';

export const SkyFactoryMapMesh: React.FC = () => {
  const rotatingBarsRef = useRef<THREE.Group[]>([]);
  const movingPlatformsRef = useRef<THREE.Group[]>([]);
  const hammersRef = useRef<THREE.Group[]>([]);
  const cannonProjectilesRef = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Rotate sweepers
    rotatingBarsRef.current.forEach((bar, idx) => {
      if (bar) {
        bar.rotation.y = time * (idx % 2 === 0 ? 2.5 : -2.5);
      }
    });

    // Move platforms
    movingPlatformsRef.current.forEach((plat, idx) => {
      if (plat) {
        const offset = Math.sin(time * 2.2 + idx) * 5.8;
        plat.position.x = offset * (idx % 2 === 0 ? 1 : -1);
      }
    });

    // Swing hammers
    hammersRef.current.forEach((hammer, idx) => {
      if (hammer) {
        hammer.rotation.z = Math.sin(time * 3.0 + idx) * 1.1;
      }
    });

    // Animate Cannon Energy Projectiles (Travelling horizontally across track width)
    cannonProjectilesRef.current.forEach((proj, idx) => {
      if (proj) {
        const cycle = ((time * 7.5 + idx * 1.8) % 18) - 9.0;
        proj.position.x = cycle;
      }
    });
  });

  return (
    <group>
      {/* ------------------------------------------------------------- */}
      {/* 1. MOUNTAIN PEAK ELEVATION PILLARS & STRUCTURAL TRUSS BRIDGES */}
      {/* ------------------------------------------------------------- */}
      {[
        { z: -10, y: -12 },
        { z: 35, y: -8 },
        { z: 80, y: -4 },
        { z: 125, y: 0 },
        { z: 170, y: 5 },
        { z: 215, y: 12 },
        { z: 260, y: 20 },
        { z: 305, y: 28 },
      ].map((loc, idx) => (
        <group key={idx} position={[0, loc.y - 12, loc.z]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[3.0, 4.5, 28, 24]} />
            <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.2} />
          </mesh>
          <mesh position={[0, 12, 0]}>
            <boxGeometry args={[16, 1.8, 3.8]} />
            <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* ------------------------------------------------------------- */}
      {/* 2. SECTION 1: START ARENA (WIDE MOUNTAIN BASE PLATFORM) */}
      {/* ------------------------------------------------------------- */}
      <group position={[0, 0, -10]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[24, 1.2, 18]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.25} metalness={0.05} />
        </mesh>
        <mesh position={[0, -0.8, 0]}>
          <boxGeometry args={[22, 0.6, 16]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.61, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[23.8, 17.8]} />
          <meshStandardMaterial color="#ff007f" roughness={0.2} emissive="#ff007f" emissiveIntensity={0.15} />
        </mesh>

        <group position={[0, 5, -8.5]}>
          <mesh castShadow>
            <boxGeometry args={[22, 5.0, 0.8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} />
          </mesh>
          <Html position={[0, 0, 0.45]} center distanceFactor={18}>
            <div style={{ background: 'linear-gradient(135deg, #ff007f 0%, #ff66b3 100%)', color: '#ffffff', padding: '12px 42px', borderRadius: '32px', fontWeight: 900, fontSize: '28px', letterSpacing: '0.24em', fontStyle: 'italic', fontFamily: "'Kanit', sans-serif", boxShadow: '0 0 40px rgba(255, 0, 127, 0.8)' }}>
              CLASS CLASH
            </div>
          </Html>
        </group>
      </group>

      {/* ------------------------------------------------------------- */}
      {/* 3. VERTICAL CANNON CLIMB ELEVATION SECTIONS (0m to 52m UPWARD) */}
      {/* ------------------------------------------------------------- */}
      {/* Section 2: Initial Ascent Ramp (Y = 0m -> 8m) */}
      <mesh position={[0, 3.5, 12]} rotation={[-0.22, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[20, 1.2, 28]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.35} metalness={0.1} />
      </mesh>

      {/* Section 3: Cannon Hazard Deck (Y = 8m) */}
      <mesh position={[0, 7.0, 48]} receiveShadow castShadow>
        <boxGeometry args={[18, 1.2, 45]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.25} metalness={0.05} />
      </mesh>

      {/* Section 4 -> Section 5 Ascending Climb Ramp (Y = 8m -> 18m) */}
      <mesh position={[0, 12.5, 95]} rotation={[-0.24, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[18, 1.2, 48]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.35} metalness={0.1} />
      </mesh>

      {/* Section 6: High Elevated Precision Speedway (Y = 18m -> 28m) */}
      <mesh position={[0, 22.0, 155]} rotation={[-0.20, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[16, 1.2, 70]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.25} metalness={0.05} />
      </mesh>

      {/* Section 8 & 9: Final Vertical Mountain Climb (Y = 28m -> 48m) */}
      <mesh position={[0, 36.0, 240]} rotation={[-0.28, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[14, 1.2, 95]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.35} metalness={0.1} />
      </mesh>

      {/* ------------------------------------------------------------- */}
      {/* 4. CANNON HAZARD LAUNCHERS & ANIMATED ENERGY PROJECTILES */}
      {/* ------------------------------------------------------------- */}
      {[50, 65, 140, 155, 230, 245].map((zPos, idx) => (
        <group key={idx}>
          {/* Left Mechanical Cannon Tube */}
          <group position={[-9.5, 8.5, zPos]} rotation={[0, 0, Math.PI / 2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.7, 0.9, 2.2, 24]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 1.0, 0]}>
              <cylinderGeometry args={[0.75, 0.75, 0.4, 24]} />
              <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={0.8} />
            </mesh>
          </group>

          {/* Right Mechanical Cannon Tube */}
          <group position={[9.5, 8.5, zPos]} rotation={[0, 0, -Math.PI / 2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.7, 0.9, 2.2, 24]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 1.0, 0]}>
              <cylinderGeometry args={[0.75, 0.75, 0.4, 24]} />
              <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={0.8} />
            </mesh>
          </group>

          {/* Cannon Energy Projectile Ball */}
          <mesh
            ref={(el) => {
              if (el) cannonProjectilesRef.current[idx] = el;
            }}
            position={[0, 8.5, zPos]}
            castShadow
          >
            <sphereGeometry args={[0.7, 24, 24]} />
            <meshStandardMaterial color="#ffb703" emissive="#ff9100" emissiveIntensity={1.5} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* ------------------------------------------------------------- */}
      {/* 5. SAFETY BARRIERS ALONG RUNWAY (ROUNDED BLUE METALLIC RAILS) */}
      {/* ------------------------------------------------------------- */}
      {[-9.2, 9.2].map((xPos, idx) => (
        <group key={idx} position={[xPos, 20.0, 150]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 310, 16]} />
            <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* ------------------------------------------------------------- */}
      {/* 6. ROTATING SWEEPER ARMS */}
      {/* ------------------------------------------------------------- */}
      {SKY_FACTORY_MAP.obstacles
        .filter((o) => o.type === 'ROTATING_BAR')
        .map((o, idx) => (
          <group
            key={o.id}
            ref={(el) => {
              if (el) rotatingBarsRef.current[idx] = el;
            }}
            position={[o.position.x, o.position.y + 7.0, o.position.z]}
          >
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[1.4, 1.8, 1.2, 24]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.9, 0.9, 1.2, 24]} />
              <meshStandardMaterial color="#ffffff" metalness={0.9} />
            </mesh>
            <mesh castShadow position={[0, 1.2, 0]}>
              <boxGeometry args={[o.dimensions.x, 1.1, 1.1]} />
              <meshStandardMaterial color="#ffb703" roughness={0.2} emissive="#ff9100" emissiveIntensity={0.5} />
            </mesh>
          </group>
        ))}

      {/* ------------------------------------------------------------- */}
      {/* 7. PHYSICAL CHECKPOINT ARCHES */}
      {/* ------------------------------------------------------------- */}
      {SKY_FACTORY_MAP.checkpoints.map((cp) => (
        <group key={cp.id} position={[cp.position.x, cp.position.y + 7.5, cp.position.z]}>
          <mesh position={[-8.5, 0, 0]} castShadow>
            <cylinderGeometry args={[0.75, 0.75, 7.5, 24]} />
            <meshStandardMaterial color="#ffffff" emissive="#0284c7" emissiveIntensity={0.6} metalness={0.7} />
          </mesh>
          <mesh position={[8.5, 0, 0]} castShadow>
            <cylinderGeometry args={[0.75, 0.75, 7.5, 24]} />
            <meshStandardMaterial color="#ffffff" emissive="#0284c7" emissiveIntensity={0.6} metalness={0.7} />
          </mesh>
          <mesh position={[0, 3.4, 0]}>
            <boxGeometry args={[18, 1.4, 0.6]} />
            <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={0.8} />
          </mesh>
          <Html position={[0, 3.4, 0.35]} center distanceFactor={16}>
            <div style={{ background: '#0284c7', color: '#ffffff', padding: '6px 22px', borderRadius: '18px', fontWeight: 900, fontSize: '15px', letterSpacing: '0.16em', fontFamily: "'Outfit', sans-serif" }}>
              CHECKPOINT #{cp.order}
            </div>
          </Html>
        </group>
      ))}

      {/* ------------------------------------------------------------- */}
      {/* 8. GRAND MOUNTAIN PEAK FINISH ARENA & ARCH */}
      {/* ------------------------------------------------------------- */}
      <group position={[SKY_FACTORY_MAP.finishLine.position.x, 52.0, SKY_FACTORY_MAP.finishLine.position.z]}>
        <mesh position={[-9.5, 0, 0]} castShadow>
          <cylinderGeometry args={[1.0, 1.0, 11, 24]} />
          <meshStandardMaterial color="#ffffff" emissive="#ff007f" emissiveIntensity={0.9} metalness={0.8} />
        </mesh>
        <mesh position={[9.5, 0, 0]} castShadow>
          <cylinderGeometry args={[1.0, 1.0, 11, 24]} />
          <meshStandardMaterial color="#ffffff" emissive="#ff007f" emissiveIntensity={0.9} metalness={0.8} />
        </mesh>
        <mesh position={[0, 5.5, 0]} castShadow>
          <boxGeometry args={[21, 2.4, 0.8]} />
          <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={1.3} />
        </mesh>
        <Html position={[0, 5.5, 0.45]} center distanceFactor={18}>
          <div style={{ background: '#ffffff', color: '#ff007f', padding: '10px 38px', borderRadius: '36px', fontWeight: 900, fontSize: '22px', letterSpacing: '0.24em', fontStyle: 'italic', fontFamily: "'Kanit', sans-serif", boxShadow: '0 0 40px #ff007f' }}>
            FINISH LINE
          </div>
        </Html>
        <mesh position={[0, -4.9, 0]} receiveShadow>
          <boxGeometry args={[18, 0.2, 7]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
};
