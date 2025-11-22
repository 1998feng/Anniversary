import React from 'react';
import * as THREE from 'three';
import { CharacterId } from '../../types';

interface SteveProps {
  characterId: CharacterId;
  animRefs: {
    head: React.RefObject<THREE.Group>; // 接收头部引用
    leftArm: React.RefObject<THREE.Group>;
    rightArm: React.RefObject<THREE.Group>;
    leftLeg: React.RefObject<THREE.Group>;
    rightLeg: React.RefObject<THREE.Group>;
  };
}

// --- 静态皮肤调色板定义 ---
const SKIN_PALETTES: Record<CharacterId, {
  skin: string;
  shirt: string;
  pants: string;
  hair: string;
  eye: string;
  shoe: string;
  isAlex: boolean;
}> = {
  steve: {
    skin: "#bca283",
    shirt: "#008080", // 深青色
    pants: "#2d2d44", // 海军蓝
    hair: "#2f1f0f",
    eye: "#4b3f8c",
    shoe: "#606060",
    isAlex: false,
  },
  tuxedo: {
    skin: "#bca283",
    shirt: "#1a1a1a",
    pants: "#1a1a1a",
    hair: "#2f1f0f",
    eye: "#4b3f8c",
    shoe: "#000000",
    isAlex: false,
  },
  alex: {
    skin: "#dcbfa7",
    shirt: "#576d2f",
    pants: "#4e3726",
    hair: "#c46317",
    eye: "#2b481a",
    shoe: "#3b281b",
    isAlex: true,
  },
  zombie: {
    skin: "#527a3a",
    shirt: "#008080",
    pants: "#2d2d44",
    hair: "#25381b",
    eye: "#000000",
    shoe: "#606060",
    isAlex: false,
  },
};

export const Steve: React.FC<SteveProps> = ({ characterId, animRefs }) => {
  const { head, leftArm, rightArm, leftLeg, rightLeg } = animRefs;

  // 安全获取调色板
  const palette = SKIN_PALETTES[characterId] || SKIN_PALETTES.steve;

  // 固定颜色常量
  const COLORS = {
    white: "#ffffff",
    mouth: "#6e4633",
    red: "#cc0000"
  };

  // --- 尺寸定义 (按比例缩放) ---
  const S = 0.05; // 缩放单位
  
  const headS = 8 * S; 
  const bodyW = 8 * S; 
  const bodyH = 12 * S; 
  const bodyD = 4 * S; 
  
  const armW = (palette.isAlex ? 3 : 4) * S; 
  const armH = 12 * S; 
  const armD = 4 * S; 
  
  const legW = 4 * S; 
  const legH = 12 * S; 
  const legD = 4 * S; 

  // "帽子/头发"层的缩放，稍微大一点以避免 Z-fighting（重叠闪烁）
  const HAT_SCALE = 1.05; 

  return (
    <group position={[0, -0.1, 0]}>
      
      {/* --- 头部 --- */}
      {/* 绑定 headRef，允许 Player.tsx 控制其旋转 */}
      <group ref={head} position={[0, legH + bodyH + headS/2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[headS, headS, headS]} />
          <meshStandardMaterial color={palette.skin} />
        </mesh>
        
        {/* 头发/帽子 - 稍微放大包裹头部 */}
        <group scale={[HAT_SCALE, HAT_SCALE, HAT_SCALE]}>
            {/* 顶部 */}
            <mesh position={[0, headS/2, 0]}>
                <boxGeometry args={[headS, 0.02, headS]} />
                <meshStandardMaterial color={palette.hair} />
            </mesh>
            {/* 后部 */}
            <mesh position={[0, 0, -headS/2]}>
                <boxGeometry args={[headS, headS, 0.02]} />
                <meshStandardMaterial color={palette.hair} />
            </mesh>
            {/* 右侧 */}
            <mesh position={[headS/2, 0, 0]}>
                <boxGeometry args={[0.02, headS, headS]} />
                <meshStandardMaterial color={palette.hair} />
            </mesh>
            {/* 左侧 */}
            <mesh position={[-headS/2, 0, 0]}>
                <boxGeometry args={[0.02, headS, headS]} />
                <meshStandardMaterial color={palette.hair} />
            </mesh>
        </group>

        {/* 面部特征 - 稍微靠前放置 */}
        <group position={[0, -0.05, headS/2 + 0.005]}>
           {/* 眼白 */}
           <mesh position={[0.08, 0.06, 0]}>
             <planeGeometry args={[0.06, 0.06]} />
             <meshStandardMaterial color={COLORS.white} />
           </mesh>
           <mesh position={[-0.08, 0.06, 0]}>
             <planeGeometry args={[0.06, 0.06]} />
             <meshStandardMaterial color={COLORS.white} />
           </mesh>
           {/* 瞳孔 */}
           <mesh position={[0.1, 0.06, 0.002]}>
             <planeGeometry args={[0.03, 0.03]} />
             <meshStandardMaterial color={palette.eye} />
           </mesh>
           <mesh position={[-0.06, 0.06, 0.002]}>
             <planeGeometry args={[0.03, 0.03]} />
             <meshStandardMaterial color={palette.eye} />
           </mesh>
           {/* 嘴巴 */}
           <mesh position={[0, -0.02, 0]}>
             <planeGeometry args={[0.08, 0.04]} />
             <meshStandardMaterial color={COLORS.mouth} />
           </mesh>
        </group>
      </group>

      {/* --- 身体 --- */}
      <group position={[0, legH + bodyH/2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[bodyW, bodyH, bodyD]} />
          <meshStandardMaterial color={palette.shirt} />
        </mesh>
        {/* 西装细节 (仅西装皮肤) */}
        {characterId === 'tuxedo' && (
           <group position={[0, 0, bodyD/2 + 0.005]}>
              <mesh position={[0, 0.1, 0]}>
                <planeGeometry args={[0.15, 0.4]} />
                <meshStandardMaterial color={COLORS.white} />
              </mesh>
              <mesh position={[0, 0.2, 0.005]}>
                <planeGeometry args={[0.05, 0.05]} />
                <meshStandardMaterial color={COLORS.red} />
              </mesh>
           </group>
        )}
      </group>

      {/* --- 手臂 (堆叠几何体 - 无重叠) --- */}
      
      {/* 左臂 */}
      <group ref={leftArm} position={[-bodyW/2 - armW/2, legH + bodyH - 0.1, 0]}>
         <group position={[0, -armH/2 + 0.1, 0]}> 
            {/* 上臂 (袖子) - 顶部 1/3 */}
            <mesh position={[0, armH/3, 0]} castShadow>
               <boxGeometry args={[armW, armH/3, armD]} />
               <meshStandardMaterial color={palette.shirt} />
            </mesh>
            {/* 下臂 (皮肤) - 底部 2/3 */}
            <mesh position={[0, -armH/6, 0]} castShadow>
               <boxGeometry args={[armW, armH*2/3, armD]} />
               <meshStandardMaterial color={palette.skin} />
            </mesh>
         </group>
      </group>

      {/* 右臂 */}
      <group ref={rightArm} position={[bodyW/2 + armW/2, legH + bodyH - 0.1, 0]}>
         <group position={[0, -armH/2 + 0.1, 0]}>
            {/* 上臂 (袖子) */}
            <mesh position={[0, armH/3, 0]} castShadow>
               <boxGeometry args={[armW, armH/3, armD]} />
               <meshStandardMaterial color={palette.shirt} />
            </mesh>
            {/* 下臂 (皮肤) */}
            <mesh position={[0, -armH/6, 0]} castShadow>
               <boxGeometry args={[armW, armH*2/3, armD]} />
               <meshStandardMaterial color={palette.skin} />
            </mesh>
         </group>
      </group>

      {/* --- 腿部 (堆叠几何体) --- */}
      
      {/* 左腿 */}
      <group ref={leftLeg} position={[-legW/2, legH, 0]}>
         <group position={[0, -legH/2, 0]}>
            {/* 上腿 (裤子) - 顶部 3/4 */}
            <mesh position={[0, legH/8, 0]} castShadow>
               <boxGeometry args={[legW, legH*3/4, legD]} />
               <meshStandardMaterial color={palette.pants} />
            </mesh>
            {/* 下腿 (鞋子) - 底部 1/4 */}
            <mesh position={[0, -legH*3/8, 0]} castShadow>
               <boxGeometry args={[legW, legH/4, legD]} />
               <meshStandardMaterial color={palette.shoe} />
            </mesh>
         </group>
      </group>

      {/* 右腿 */}
      <group ref={rightLeg} position={[legW/2, legH, 0]}>
         <group position={[0, -legH/2, 0]}>
            {/* 上腿 (裤子) */}
            <mesh position={[0, legH/8, 0]} castShadow>
               <boxGeometry args={[legW, legH*3/4, legD]} />
               <meshStandardMaterial color={palette.pants} />
            </mesh>
            {/* 下腿 (鞋子) */}
            <mesh position={[0, -legH*3/8, 0]} castShadow>
               <boxGeometry args={[legW, legH/4, legD]} />
               <meshStandardMaterial color={palette.shoe} />
            </mesh>
         </group>
      </group>

    </group>
  );
};