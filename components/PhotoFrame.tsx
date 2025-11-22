
import React, { useState, useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { useGameStore } from '../store';
import { PhotoData } from '../types';
import * as THREE from 'three';

interface PhotoFrameProps {
  data: PhotoData;
}

export const PhotoFrame: React.FC<PhotoFrameProps> = ({ data }) => {
  const [hovered, setHovered] = useState(false);
  const setFocusedPhotoId = useGameStore((state) => state.setFocusedPhotoId);
  
  // 加载纹理以获取真实的图片尺寸
  const texture = useTexture(data.url);
  
  // 自动计算尺寸
  // 设定一个固定的高度，以保持画廊墙面的整洁性 (高度 = 3.5 单位)
  // 宽度根据图片原始比例自动缩放
  const { width, height } = useMemo(() => {
    const FIXED_HEIGHT = 3.5;
    if (texture && texture.image) {
      const ratio = texture.image.width / texture.image.height;
      return { width: FIXED_HEIGHT * ratio, height: FIXED_HEIGHT };
    }
    return { width: 3, height: 4 }; // 默认值（防抖动）
  }, [texture]);

  const handlePointerOver = (e: React.PointerEvent) => {
    e.stopPropagation();
    setHovered(true);
  };

  const handlePointerOut = (e: React.PointerEvent) => {
    e.stopPropagation();
    setHovered(false);
  };

  const handleClick = (e: React.PointerEvent) => {
    e.stopPropagation();
    setFocusedPhotoId(data.id);
  };

  // 相框参数
  const frameColor = hovered ? "#333333" : "#111111"; 
  const frameThickness = 0.1;
  const frameBorder = 0.05; 
  const mattingBorder = 0.2; // 稍微减小一点白边，让图片更突出

  return (
    <group 
      position={data.position} 
      rotation={data.rotation}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 外框结构 */}
      <mesh position={[0, 0, -frameThickness / 2]} castShadow receiveShadow>
        <boxGeometry args={[width + mattingBorder + frameBorder, height + mattingBorder + frameBorder, frameThickness]} />
        <meshStandardMaterial color={frameColor} roughness={0.5} metalness={0.2} />
      </mesh>

      {/* 卡纸 (纯白内衬) */}
      <mesh position={[0, 0, -frameThickness / 2 + 0.02]} receiveShadow>
        <boxGeometry args={[width + mattingBorder, height + mattingBorder, frameThickness]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>

      {/* 照片本身 - 直接使用加载好的纹理 */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
};
