
import React from 'react';
import { useGameStore, PHOTOS } from '../store';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Overlay: React.FC = () => {
  const { focusedPhotoId, setFocusedPhotoId } = useGameStore();
  const photo = PHOTOS.find(p => p.id === focusedPhotoId);

  return (
    <AnimatePresence>
      {focusedPhotoId && photo && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10"
          onClick={() => setFocusedPhotoId(null)} // 点击背景关闭
        >
          {/* 关闭按钮 - 绝对定位在右上角 */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setFocusedPhotoId(null);
            }}
            className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors group"
          >
            <X className="w-8 h-8 text-white/70 group-hover:text-white" />
          </button>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-full max-h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()} // 防止点击内容关闭
          >
            {/* 图片容器 */}
            <div className="relative shadow-2xl">
              <img 
                src={photo.url} 
                alt={photo.title} 
                className="max-w-[90vw] max-h-[80vh] object-contain rounded-sm border-[8px] border-white shadow-black/50"
              />
            </div>

            {/* 底部标题 */}
            <div className="mt-6 text-center">
              <h2 className="text-3xl font-serif font-bold text-white tracking-widest drop-shadow-md">
                {photo.title}
              </h2>
              <div className="w-12 h-1 bg-white/50 mx-auto mt-3 rounded-full"></div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
