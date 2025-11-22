import React from 'react';
import { ArrowUp } from 'lucide-react';

interface JumpButtonProps {
  onJump: () => void;
}

export const JumpButton: React.FC<JumpButtonProps> = ({ onJump }) => {
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onJump();
  };

  const handleEvent = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="absolute bottom-12 right-10 z-50 w-20 h-20 flex items-center justify-center touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handleEvent}
      onPointerUp={handleEvent}
    >
      <button
        className="w-16 h-16 rounded-full 
                   bg-white/40 backdrop-blur-md border border-white/50 shadow-lg 
                   flex items-center justify-center 
                   active:bg-white/60 active:scale-95 transition-all duration-200
                   group"
        aria-label="Jump"
      >
        <ArrowUp className="w-8 h-8 text-gray-800 group-active:text-black" strokeWidth={2.5} />
      </button>
    </div>
  );
};