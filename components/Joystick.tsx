import React, { useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../store';

interface JoystickProps {
  onMove: (x: number, y: number) => void;
}

export const Joystick: React.FC<JoystickProps> = ({ onMove }) => {
  const stickRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const setJoystickActive = useGameStore((state) => state.setJoystickActive);
  
  // 使用 Ref 存储核心数据，避免在全局监听器中出现 stale closure 问题
  const origin = useRef<{ x: number; y: number } | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  // Visual constants
  const MAX_RADIUS = 50; 

  const handleGlobalPointerMove = useCallback((e: PointerEvent) => {
    // 确保我们只处理我们关心的那个触摸点
    if (e.pointerId !== pointerIdRef.current || !origin.current || !stickRef.current) return;
    
    e.preventDefault();

    const dx = e.clientX - origin.current.x;
    const dy = e.clientY - origin.current.y;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const clampedDistance = Math.min(distance, MAX_RADIUS);
    
    const x = Math.cos(angle) * clampedDistance;
    const y = Math.sin(angle) * clampedDistance;

    stickRef.current.style.transform = `translate(${x}px, ${y}px)`;

    // 标准化输出
    onMoveRef.current(x / MAX_RADIUS, y / MAX_RADIUS);
  }, []);

  const handleGlobalPointerUp = useCallback((e: PointerEvent) => {
    if (e.pointerId !== pointerIdRef.current) return;

    e.preventDefault();

    // 清理全局监听器
    window.removeEventListener('pointermove', handleGlobalPointerMove);
    window.removeEventListener('pointerup', handleGlobalPointerUp);
    window.removeEventListener('pointercancel', handleGlobalPointerUp);

    // 重置状态
    setJoystickActive(false);
    if (stickRef.current) {
        stickRef.current.style.transition = 'transform 0.1s ease-out';
        stickRef.current.style.transform = 'translate(0px, 0px)';
    }
    onMoveRef.current(0, 0);
    
    // 清空引用
    origin.current = null;
    pointerIdRef.current = null;
  }, [setJoystickActive, handleGlobalPointerMove]);


  const handlePointerDown = (e: React.PointerEvent) => {
    // 阻止默认行为和事件冒泡，这是在 iOS 上成功的关键第一步
    e.preventDefault();
    e.stopPropagation();
    
    // 记录触摸点 ID 和起始位置
    pointerIdRef.current = e.pointerId;
    origin.current = { x: e.clientX, y: e.clientY };

    setJoystickActive(true);

    if (stickRef.current) {
      stickRef.current.style.transition = 'none'; // 拖动时移除动画
    }

    // 挂载全局监听器
    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: false });
    window.addEventListener('pointerup', handleGlobalPointerUp, { passive: false });
    window.addEventListener('pointercancel', handleGlobalPointerUp, { passive: false });
  };

  // 组件卸载时确保清理全局监听器
  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [handleGlobalPointerMove, handleGlobalPointerUp]);

  return (
    <div 
      className="absolute bottom-10 left-10 z-50 w-40 h-40 flex items-center justify-center"
      // iOS 修复: touchAction: 'none' 是最高优先级指令，禁止浏览器处理滚动等手势
      style={{ touchAction: 'none' }} 
    >
      {/* Base */}
      <div 
        ref={baseRef}
        className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
        onPointerDown={handlePointerDown}
      >
        {/* Stick */}
        <div 
          ref={stickRef}
          className="w-12 h-12 rounded-full bg-white/80 shadow-lg pointer-events-none"
        />
      </div>
    </div>
  );
};
