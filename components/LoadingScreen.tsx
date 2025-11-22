
import React from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen: React.FC = () => {
  const { active, progress } = useProgress();

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-[300] bg-[#f5f5f5] flex flex-col items-center justify-center text-gray-800"
        >
          <div className="flex flex-col items-center max-w-md w-full px-8">
            {/* Title */}
            <h2 className="text-xl md:text-2xl font-serif font-light tracking-[0.2em] text-gray-800 mb-2 uppercase">
              布置纪念日会场
            </h2>
            <p className="text-gray-500 text-xs mb-12 font-mono">收集甜蜜瞬间中...</p>

            {/* Minimalist Line Progress */}
            <div className="h-[1px] w-48 bg-gray-300 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gray-800"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>

            {/* Percentage */}
            <p className="mt-4 text-[10px] text-gray-400 font-mono">
              {Math.round(progress)}%
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
