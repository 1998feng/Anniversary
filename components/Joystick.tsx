import React, { useRef, useEffect, useState } from 'react';
import { useGameStore } from '../store';

interface JoystickProps {
  onMove: (x: number, y: number) => void;
}

export const Joystick: React.FC<JoystickProps> = ({ onMove }) => {
  const stickRef = useRef<HTMLDivElement>(null);
  const setJoystickActive = useGameStore((state) => state.setJoystickActive);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const pointerIdRef = useRef<number | null>(null);

  // Visual constants
  const MAX_RADIUS = 50; 

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation(); // Critical: Prevent App.tsx from detecting this as a camera drag
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerIdRef.current = e.pointerId;
    
    setOrigin({ x: e.clientX, y: e.clientY });
    setJoystickActive(true);
    setPosition({ x: 0, y: 0 });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (!origin || e.pointerId !== pointerIdRef.current) return;

    const dx = e.clientX - origin.x;
    const dy = e.clientY - origin.y;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const clampedDistance = Math.min(distance, MAX_RADIUS);
    
    const x = Math.cos(angle) * clampedDistance;
    const y = Math.sin(angle) * clampedDistance;

    setPosition({ x, y });

    // Normalize output between -1 and 1
    onMove(x / MAX_RADIUS, y / MAX_RADIUS);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (e.pointerId === pointerIdRef.current) {
      setOrigin(null);
      setJoystickActive(false);
      setPosition({ x: 0, y: 0 });
      onMove(0, 0);
      pointerIdRef.current = null;
    }
  };

  return (
    <div 
      className="absolute bottom-10 left-10 z-50 w-40 h-40 flex items-center justify-center touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Base */}
      <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-opacity duration-300">
        {/* Stick */}
        <div 
          ref={stickRef}
          className="w-12 h-12 rounded-full bg-white/80 shadow-lg transform transition-transform duration-75 ease-linear"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`
          }}
        />
      </div>
    </div>
  );
};