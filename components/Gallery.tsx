import React from 'react';
import { RigidBody, CuboidCollider, CylinderCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { PhotoFrame } from './PhotoFrame';
import { PHOTOS } from '../store';

export const Gallery: React.FC = () => {
  const HALL_RADIUS = 18;
  const WALL_HEIGHT = 9; 
  
  // --- 物理碰撞体 ---
  const WallColliders = () => {
    const segments = 32;
    const colliders = [];
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const radius = HALL_RADIUS + 0.5; 
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const segmentWidth = (Math.PI * 2 * radius) / segments;
      
      colliders.push(
        <CuboidCollider 
          key={`wall-col-${i}`}
          args={[segmentWidth / 2 + 0.2, WALL_HEIGHT / 2, 0.5]} 
          position={[x, WALL_HEIGHT / 2, z]}
          rotation={[0, angle, 0]}
        />
      );
    }
    return <>{colliders}</>;
  };

  return (
    <group>
      <RigidBody type="fixed" friction={1} colliders={false}>
        <CylinderCollider args={[0.1, HALL_RADIUS]} position={[0, -0.1, 0]} />
        <WallColliders />
        <CylinderCollider args={[0.5, HALL_RADIUS]} position={[0, WALL_HEIGHT + 0.5, 0]} />
        
        {/* 
          平台碰撞体
          视觉: 底部 (h=0.5, y=0.25) + 顶部 (h=0.1, y=0.55). 总高度 = 0.6.
          Collider args=[halfHeight, radius]. 
          args=[0.3, 2.5], position=[0, 0.3, 0] => 范围 Y: 0 到 0.6. 完美匹配.
        */}
        <CylinderCollider args={[0.3, 2.5]} position={[0, 0.3, 0]} />

        {/* --- 视觉效果 (已优化材质渲染) --- */}

        {/* 地板: 抛光浅灰色水磨石 */}
        <mesh position={[0, -0.1, 0]} receiveShadow rotation={[0, 0, 0]}>
          <cylinderGeometry args={[HALL_RADIUS + 1, HALL_RADIUS + 1, 0.2, 64]} />
          <meshStandardMaterial 
            color="#e5e7eb" 
            roughness={0.25} 
            metalness={0.1} 
          />
        </mesh>

        {/* 墙壁: 米白色/浅色微水泥 (哑光) */}
        <mesh position={[0, WALL_HEIGHT / 2, 0]} receiveShadow castShadow>
            <cylinderGeometry args={[HALL_RADIUS, HALL_RADIUS, WALL_HEIGHT, 64, 1, true]} />
            <meshStandardMaterial 
              color="#f4f4f5" 
              roughness={0.9} 
              side={THREE.BackSide} 
            />
        </mesh>

        {/* 踢脚线: 极简拉丝金属 */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
            <cylinderGeometry args={[HALL_RADIUS - 0.02, HALL_RADIUS - 0.02, 0.2, 64, 1, true]} />
            <meshStandardMaterial 
              color="#9ca3af" 
              roughness={0.4} 
              metalness={0.5} 
            />
        </mesh>

        {/* 天花板: 纯净白 */}
        <mesh position={[0, WALL_HEIGHT, 0]} receiveShadow>
            <cylinderGeometry args={[HALL_RADIUS, HALL_RADIUS, 0.2, 64]} />
            <meshStandardMaterial 
              color="#ffffff" 
              roughness={1.0} 
            />
        </mesh>
        
        {/* 天花板装饰条 */}
         <mesh position={[0, WALL_HEIGHT - 0.1, 0]} receiveShadow>
            <cylinderGeometry args={[HALL_RADIUS - 0.1, HALL_RADIUS - 0.1, 0.2, 64, 1, true]} />
            <meshStandardMaterial 
              color="#9ca3af" 
              roughness={0.4} 
              metalness={0.5} 
            />
        </mesh>

        {/* 中央平台 */}
        <group position={[0, 0, 0]}>
             {/* 石材基座 (高度 0.5, 中心 Y 0.25) */}
             <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[2.5, 2.5, 0.5, 64]} />
                <meshStandardMaterial color="#d4d4d4" roughness={0.8} />
             </mesh>
             {/* 深色顶部 (高度 0.1, 中心 Y 0.5 + 0.05 = 0.55) */}
             <mesh position={[0, 0.55, 0]} receiveShadow>
                <cylinderGeometry args={[2.4, 2.4, 0.1, 64]} />
                <meshStandardMaterial color="#404040" roughness={0.9} />
             </mesh>
        </group>

      </RigidBody>

      {PHOTOS.map((photo) => (
        <PhotoFrame key={photo.id} data={photo} />
      ))}
    </group>
  );
};