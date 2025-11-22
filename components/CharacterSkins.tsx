import React from 'react';
import * as THREE from 'three';
import { CharacterId } from '../types';
import { Steve } from './characters/Steve';

interface CharacterSkinProps {
  characterId: CharacterId;
  animRefs: {
    head: React.RefObject<THREE.Group>; // 新增头部引用
    leftArm: React.RefObject<THREE.Group>;
    rightArm: React.RefObject<THREE.Group>;
    leftLeg: React.RefObject<THREE.Group>;
    rightLeg: React.RefObject<THREE.Group>;
  };
}

export const CharacterSkins: React.FC<CharacterSkinProps> = ({ characterId, animRefs }) => {
  // Key prop 强制 React 在 ID 变化时重新挂载 Steve 组件，
  // 确保材质和几何体的清理与重新初始化。
  return <Steve key={characterId} characterId={characterId} animRefs={animRefs} />;
};