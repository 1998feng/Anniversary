import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-[#f5f5f5] flex flex-col items-center justify-center text-gray-800 overflow-hidden">
      {/* Background - CSS Gradient (无网络依赖) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white via-gray-100 to-gray-200" />
      
      <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-100/50 via-transparent to-transparent" />
      </div>

      {/* Content - Dark text on light background */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6 text-gray-500">
            <Sparkles className="w-5 h-5 text-gray-400" />
            <span className="uppercase tracking-[0.4em] text-xs border-b border-gray-300 pb-1 font-medium">One Year Anniversary</span>
            <Sparkles className="w-5 h-5 text-gray-400" />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-serif font-medium mb-8 text-gray-900 leading-tight drop-shadow-none"
        >
          我们的 <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 via-gray-800 to-gray-600">
            一周年
          </span>
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 0, 0, 0.05)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="group relative px-10 py-4 bg-transparent border border-gray-400 rounded-sm
                     text-gray-800 font-light text-lg tracking-widest hover:border-gray-800 transition-all duration-500"
        >
          <div className="flex items-center gap-4">
            <span>进入</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </div>
        </motion.button>
      </div>
    </div>
  );
};