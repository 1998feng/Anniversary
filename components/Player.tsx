import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, RapierRigidBody, useRapier } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '../store';
import { CharacterSkins } from './CharacterSkins';

interface PlayerProps {
  joystickData: React.MutableRefObject<{ x: number; y: number }>;
  cameraRotation: React.MutableRefObject<{ yaw: number; pitch: number }>;
  viewMode: 'first' | 'third';
  isDraggingRef: React.MutableRefObject<boolean>;
  jumpRef: React.MutableRefObject<boolean>;
}

const MOVEMENT_SPEED = 5;
const ROTATION_SPEED = 4; // 身体转动速度
const HEAD_TURN_SPEED = 15; // 头部转动速度（更快，产生先行效果）
const JUMP_FORCE = 3;

const normalizeAngle = (angle: number) => {
  let a = angle % (2 * Math.PI);
  if (a < -Math.PI) a += 2 * Math.PI;
  if (a > Math.PI) a -= 2 * Math.PI;
  return a;
};

const shortestAngleDist = (from: number, to: number) => {
  const diff = normalizeAngle(to - from);
  return diff;
};

export const Player: React.FC<PlayerProps> = ({ joystickData, cameraRotation, viewMode, isDraggingRef, jumpRef }) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const characterRef = useRef<THREE.Group>(null);
  
  const { world, rapier } = useRapier();
  
  // 动画引用，增加头部引用
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  const focusedPhotoId = useGameStore((state) => state.focusedPhotoId);
  const selectedCharacter = useGameStore((state) => state.selectedCharacter);

  const smoothedCamera = useRef({ yaw: 0, pitch: 0.05 });
  const initialized = useRef(false);

  useFrame((state, delta) => {
    if (!rigidBodyRef.current || !characterRef.current) return;

    if (!initialized.current) {
        smoothedCamera.current.yaw = cameraRotation.current.yaw;
        smoothedCamera.current.pitch = cameraRotation.current.pitch;
        initialized.current = true;
    }

    if (focusedPhotoId) {
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    // --- 跳跃逻辑 ---
    if (jumpRef.current) {
      const { x, y, z } = rigidBodyRef.current.translation();
      const rayOrigin = { x, y: y + 0.1, z };
      const rayDir = { x: 0, y: -1, z: 0 };
      const ray = new rapier.Ray(rayOrigin, rayDir);
      const hit = world.castRay(ray, 0.5, true, rapier.QueryFilterFlags.EXCLUDE_DYNAMIC);

      if (hit && hit.timeOfImpact < 0.2) {
         rigidBodyRef.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
      }
      jumpRef.current = false;
    }

    // 1. 处理输入与物理移动
    const { x, y } = joystickData.current;
    const inputYaw = cameraRotation.current.yaw;
    
    let moveX = 0;
    let moveZ = 0;
    const isMoving = x !== 0 || y !== 0;

    if (isMoving) {
      const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), inputYaw);
      const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), inputYaw);

      const moveDir = new THREE.Vector3()
        .addScaledVector(forward, -y)
        .addScaledVector(right, x)
        .normalize();

      moveX = moveDir.x * MOVEMENT_SPEED;
      moveZ = moveDir.z * MOVEMENT_SPEED;

      const linvel = rigidBodyRef.current.linvel();
      rigidBodyRef.current.setLinvel({ x: moveX, y: linvel.y, z: moveZ }, true);

      // --- 身体与头部转动逻辑 ---
      const moveAngle = Math.atan2(moveDir.x, moveDir.z);
      
      // A. 身体转动 (Slerp, 稍慢)
      const targetRotation = new THREE.Quaternion();
      targetRotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), moveAngle);
      characterRef.current.quaternion.slerp(targetRotation, ROTATION_SPEED * delta);

      // B. 头部先行 (计算角度差)
      // 获取当前身体朝向的欧拉角
      const currentBodyEuler = new THREE.Euler().setFromQuaternion(characterRef.current.quaternion, 'YXZ');
      // 计算目标方向与当前身体朝向的差值
      let angleDiff = moveAngle - currentBodyEuler.y;
      // 归一化角度差到 -PI ~ PI
      angleDiff = normalizeAngle(angleDiff);

      // 限制头部转动范围 (比如左右最大转 60 度，约 1 弧度)
      const clampedDiff = Math.max(-1.0, Math.min(1.0, angleDiff));

      // 如果有头部引用，让头转向该差值（相对于身体）
      if (headRef.current) {
         headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, clampedDiff, delta * HEAD_TURN_SPEED);
      }

      // 摄像机跟随逻辑
      if (!isDraggingRef.current) {
          const targetFollowYaw = moveAngle + Math.PI;
          const autoFollowSpeed = 1.0 * delta; 
          const dist = shortestAngleDist(cameraRotation.current.yaw, targetFollowYaw);
          if (Math.abs(dist) > 0.01) {
             cameraRotation.current.yaw += dist * autoFollowSpeed;
          }
      }

    } else {
      // 停止移动
      const linvel = rigidBodyRef.current.linvel();
      rigidBodyRef.current.setLinvel({ x: 0, y: linvel.y, z: 0 }, true);
      
      // 头部复位 (回正)
      if (headRef.current) {
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, 0, delta * 5);
      }
    }

    // 2. 行走动画 (摆臂/摆腿)
    const time = state.clock.getElapsedTime();
    const walkSpeed = 10;
    const linvel = rigidBodyRef.current.linvel();
    const isGrounded = Math.abs(linvel.y) < 0.1;

    if (isMoving && isGrounded) {
      const angle = Math.sin(time * walkSpeed) * 0.8;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -angle;
      if (rightArmRef.current) rightArmRef.current.rotation.x = angle;
      if (leftLegRef.current) leftLegRef.current.rotation.x = angle;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -angle;
    } else {
      // 恢复站立姿态
      const resetSpeed = delta * 10;
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, resetSpeed);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, resetSpeed);
      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, resetSpeed);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, resetSpeed);
    }

    // 3. 摄像机逻辑
    const playerPos = rigidBodyRef.current.translation();
    const headHeight = 1.6; 

    const smoothFactor = 2.0 * delta; 
    smoothedCamera.current.yaw += shortestAngleDist(smoothedCamera.current.yaw, cameraRotation.current.yaw) * smoothFactor;
    smoothedCamera.current.pitch = THREE.MathUtils.lerp(smoothedCamera.current.pitch, cameraRotation.current.pitch, smoothFactor);
    
    const { yaw, pitch } = smoothedCamera.current;

    if (viewMode === 'first') {
      const idealCameraPos = new THREE.Vector3(playerPos.x, playerPos.y + headHeight, playerPos.z);
      const lookDir = new THREE.Vector3(0, 0, -1)
        .applyAxisAngle(new THREE.Vector3(1, 0, 0), pitch)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      const lookAtTarget = idealCameraPos.clone().add(lookDir);
      state.camera.position.copy(idealCameraPos);
      state.camera.lookAt(lookAtTarget);
    } else {
      const radius = 10;
      const clampedPitch = Math.min(Math.PI / 3, Math.max(-Math.PI / 3, pitch));
      let camY = Math.sin(clampedPitch) * radius + 2; 
      let horizontalRadius = Math.cos(clampedPitch) * radius;
      if (camY < 0.5) camY = 0.5;
      const camX = Math.sin(yaw) * horizontalRadius;
      const camZ = Math.cos(yaw) * horizontalRadius;
      const idealCameraPos = new THREE.Vector3(playerPos.x + camX, playerPos.y + camY, playerPos.z + camZ);
      const lookAtTarget = new THREE.Vector3(playerPos.x, playerPos.y + 1.5, playerPos.z);

      const direction = new THREE.Vector3().subVectors(idealCameraPos, lookAtTarget);
      const maxDistance = direction.length();
      direction.normalize();

      const rapierRay = new rapier.Ray(lookAtTarget, direction);
      const hit = world.castRay(rapierRay, maxDistance, true, rapier.QueryFilterFlags.EXCLUDE_DYNAMIC);

      let finalCameraPos = idealCameraPos;
      if (hit && hit.timeOfImpact < maxDistance) {
        const safeDistance = Math.max(0.5, hit.timeOfImpact - 0.5); 
        finalCameraPos = new THREE.Vector3().copy(lookAtTarget).addScaledVector(direction, safeDistance);
      }
      state.camera.position.copy(finalCameraPos);
      state.camera.lookAt(lookAtTarget);
    }
  });

  return (
    <RigidBody 
      ref={rigidBodyRef} 
      colliders={false} 
      enabledRotations={[false, false, false]} 
      position={[0, 3.0, 0]} 
      mass={1}
      friction={0}
    >
      <CapsuleCollider args={[0.6, 0.3]} position={[0, 0.9, 0]} />
      
      <group ref={characterRef} position={[0, 0.2, 0]} rotation={[0, Math.PI, 0]} visible={viewMode === 'third'}>
        <CharacterSkins 
          characterId={selectedCharacter} 
          animRefs={{ 
            head: headRef,
            leftArm: leftArmRef, 
            rightArm: rightArmRef, 
            leftLeg: leftLegRef, 
            rightLeg: rightLegRef 
          }} 
        />
      </group>
    </RigidBody>
  );
};