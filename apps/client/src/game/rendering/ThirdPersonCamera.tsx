import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Vector3D } from '@class-clash/shared';
import { InputController } from '../controllers/InputController';

interface ThirdPersonCameraProps {
  targetPosition?: Vector3D;
  targetRotationY?: number;
  isStumbling?: boolean;
}

export const ThirdPersonCamera: React.FC<ThirdPersonCameraProps> = ({
  targetPosition,
  isStumbling = false,
}) => {
  const { camera, scene } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 1.6, 0));
  const cameraYaw = useRef(0);
  const previousMouseX = useRef<number | null>(null);
  const raycaster = useRef(new THREE.Raycaster());

  useEffect(() => {
    // Smooth free mouse look (no mouse click required)
    const handleMouseMove = (e: MouseEvent) => {
      if (previousMouseX.current !== null) {
        const deltaX = e.clientX - previousMouseX.current;
        cameraYaw.current += deltaX * 0.003;
      }
      previousMouseX.current = e.clientX;
    };

    const handleMouseLeave = () => {
      previousMouseX.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useFrame(() => {
    if (!targetPosition) return;

    const yaw = cameraYaw.current;

    // Pass camera angle to InputController for camera-relative WASD movement
    InputController.setCameraAngle(yaw);

    const baseDistance = 8.2;
    const baseHeight = 4.2;

    const sin = Math.sin(yaw);
    const cos = Math.cos(yaw);

    // Target player focus point at chest height (+1.6m)
    const playerTarget = new THREE.Vector3(
      targetPosition.x,
      targetPosition.y + 1.6,
      targetPosition.z
    );

    let desiredCamX = targetPosition.x - sin * baseDistance;
    let desiredCamY = targetPosition.y + baseHeight;
    let desiredCamZ = targetPosition.z - cos * baseDistance;

    // Camera Stumble Shake
    if (isStumbling) {
      desiredCamX += (Math.random() - 0.5) * 0.25;
      desiredCamY += (Math.random() - 0.5) * 0.25;
    }

    const desiredCamPos = new THREE.Vector3(desiredCamX, desiredCamY, desiredCamZ);

    // Camera Collision Raycast Prevention (Ensures camera never clips inside track or platforms)
    const rayDir = new THREE.Vector3().subVectors(desiredCamPos, playerTarget).normalize();
    raycaster.current.set(playerTarget, rayDir);

    const intersects = raycaster.current.intersectObjects(scene.children, true);
    let safeDistance = baseDistance;

    for (const hit of intersects) {
      // Ignore player mesh itself and small items
      if (hit.distance < baseDistance && hit.object.type === 'Mesh' && !hit.object.name.includes('player')) {
        safeDistance = Math.max(2.5, hit.distance - 0.4);
        break;
      }
    }

    // Calculate safe camera position using safeDistance
    const safeCamX = targetPosition.x - sin * safeDistance;
    const safeCamY = targetPosition.y + (baseHeight * (safeDistance / baseDistance));
    const safeCamZ = targetPosition.z - cos * safeDistance;

    const finalCamPos = new THREE.Vector3(safeCamX, safeCamY, safeCamZ);
    camera.position.lerp(finalCamPos, 0.16);

    // Smooth forward look-ahead target
    const desiredLookAt = new THREE.Vector3(
      targetPosition.x + sin * 3.5,
      targetPosition.y + 1.8,
      targetPosition.z + cos * 3.5 + 3.5
    );
    currentLookAt.current.lerp(desiredLookAt, 0.18);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};
