import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Environment } from '@react-three/drei';
import { Joystick } from './components/Joystick';
import { JumpButton } from './components/JumpButton';
import { Player } from './components/Player';
import { Gallery } from './components/Gallery';
import { Overlay } from './components/Overlay';
import { BackgroundMusic } from './components/BackgroundMusic';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { CharacterSelector } from './components/CharacterSelector';
import { JoystickOutput } from './types';
import { useGameStore } from './store';
import { Eye, User, Shirt } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Scene: React.FC<{ 
  joystickRef: React.MutableRefObject<JoystickOutput>,
  cameraRotationRef: React.MutableRefObject<{ yaw: number, pitch: number }>,
  viewMode: 'first' | 'third',
  isDraggingRef: React.MutableRefObject<boolean>,
  jumpRef: React.MutableRefObject<boolean>
}> = ({ joystickRef, cameraRotationRef, viewMode, isDraggingRef, jumpRef }) => {
  return (
    <>
      {/* Performance Optimized Light Grey Theme - Fog removed for clarity */}
      <color attach="background" args={['#e6e6e6']} />

      {/* Lighting: Simplified for Performance */}
      <ambientLight intensity={0.9} color="#ffffff" /> 
      
      <directionalLight 
        position={[15, 30, 15]} 
        intensity={1.2} 
        color="#fffbf5"
        castShadow 
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      >
        <orthographicCamera attach="shadow-camera" args={[-30, 30, 30, -30, 1, 60]} />
      </directionalLight>

      <Physics gravity={[0, -9.81, 0]}>
        <Player 
          joystickData={joystickRef} 
          cameraRotation={cameraRotationRef} 
          viewMode={viewMode}
          isDraggingRef={isDraggingRef}
          jumpRef={jumpRef}
        />
        <Gallery />
      </Physics>
      
      <Environment preset="city" environmentIntensity={0.6} />
    </>
  );
};

const App: React.FC = () => {
  const joystickData = useRef<JoystickOutput>({ x: 0, y: 0 });
  const cameraRotation = useRef<{ yaw: number, pitch: number }>({ yaw: 0, pitch: 0.05 });
  const jumpRef = useRef<boolean>(false);
  
  const prevPointer = useRef<{ x: number, y: number } | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const focusedPhotoId = useGameStore(state => state.focusedPhotoId);
  const isJoystickActive = useGameStore(state => state.isJoystickActive);
  
  const [viewMode, setViewMode] = useState<'first' | 'third'>('third');
  const [hasEntered, setHasEntered] = useState(false);
  const [isCharSelectorOpen, setIsCharSelectorOpen] = useState(false);

  const handleJoystickMove = (x: number, y: number) => {
    joystickData.current = { x, y };
  };

  const handleJump = () => {
    jumpRef.current = true;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!hasEntered) return;
    if (!isJoystickActive && !focusedPhotoId && !isCharSelectorOpen) {
        prevPointer.current = { x: e.clientX, y: e.clientY };
        isDraggingRef.current = true;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!hasEntered) return;
    if (prevPointer.current && !isJoystickActive && !focusedPhotoId && !isCharSelectorOpen) {
      const dx = e.clientX - prevPointer.current.x;
      const dy = e.clientY - prevPointer.current.y;
      
      prevPointer.current = { x: e.clientX, y: e.clientY };

      cameraRotation.current.yaw -= dx * 0.004;
      cameraRotation.current.pitch -= dy * 0.004;

      const MAX_PITCH = Math.PI / 2 - 0.1;
      const MIN_PITCH = -Math.PI / 2 + 0.1; 
      
      cameraRotation.current.pitch = Math.max(MIN_PITCH, Math.min(MAX_PITCH, cameraRotation.current.pitch));
    }
  };

  const handlePointerUp = () => {
    prevPointer.current = null;
    isDraggingRef.current = false;
  };

  return (
    <div 
        className="w-full h-full relative bg-[#e6e6e6]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
    >
      <AnimatePresence mode="wait">
        {!hasEntered && (
          <motion.div
            key="welcome"
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-[200]"
          >
            <WelcomeScreen onEnter={() => setHasEntered(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {hasEntered && (
        <motion.div 
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
        >
            <LoadingScreen />

            <Canvas dpr={[1, 2]} shadows camera={{ position: [0, 2, 13], fov: 55, near: 0.1 }}>
                <Suspense fallback={null}>
                <Scene 
                    joystickRef={joystickData} 
                    cameraRotationRef={cameraRotation} 
                    viewMode={viewMode}
                    isDraggingRef={isDraggingRef}
                    jumpRef={jumpRef}
                />
                </Suspense>
            </Canvas>

            {/* UI Layer */}
            {!focusedPhotoId && !isCharSelectorOpen && (
                <>
                    <Joystick onMove={handleJoystickMove} />
                    <JumpButton onJump={handleJump} />
                </>
            )}

            {!focusedPhotoId && !isCharSelectorOpen && (
                <>
                {/* 标题区域 */}
                <div className="absolute top-8 left-0 right-0 text-center pointer-events-none select-none z-10 px-4">
                    <h1 className="text-gray-800 text-2xl md:text-3xl font-serif font-bold tracking-widest drop-shadow-sm">恋爱一周年</h1>
                    <p className="text-gray-500 text-xs md:text-sm mt-2 font-medium tracking-widest uppercase">我们的纪念画廊</p>
                </div>

                {/* 右上角控制按钮组 - 垂直排列 */}
                <div className="absolute top-6 right-6 z-20 flex flex-col gap-4 items-center">
                  
                  <BackgroundMusic />

                  {/* 视角切换按钮 */}
                  <button 
                      onClick={(e) => {
                      e.stopPropagation();
                      setViewMode(prev => prev === 'third' ? 'first' : 'third');
                      }}
                      className="bg-white/40 backdrop-blur-md border border-white/50 p-3 rounded-full shadow-lg hover:bg-white transition-all active:scale-95"
                      title="切换视角"
                  >
                      {viewMode === 'third' ? <Eye className="w-6 h-6 text-gray-700" /> : <User className="w-6 h-6 text-gray-700" />}
                  </button>

                  {/* 换装按钮 */}
                  <button 
                      onClick={(e) => {
                      e.stopPropagation();
                      setIsCharSelectorOpen(true);
                      }}
                      className="bg-white/40 backdrop-blur-md border border-white/50 p-3 rounded-full shadow-lg hover:bg-white transition-all active:scale-95"
                      title="更换角色"
                  >
                      <Shirt className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
                </>
            )}

            <CharacterSelector 
              isOpen={isCharSelectorOpen} 
              onClose={() => setIsCharSelectorOpen(false)} 
            />

            <Overlay />
        </motion.div>
      )}
    </div>
  );
};

export default App;