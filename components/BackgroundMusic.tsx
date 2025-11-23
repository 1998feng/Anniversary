
import React, { useEffect, useRef, useState } from 'react';
import { Music, VolumeX } from 'lucide-react';

export const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- 在此处替换为你的背景音乐链接 (mp3/ogg) ---
  // 如果没有链接，组件将不会尝试自动播放
  // 建议使用外链或项目内的音频文件
  const MUSIC_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; 

  useEffect(() => {
    // 只有当提供了 URL 时才尝试播放
    if (audioRef.current && MUSIC_URL) {
      audioRef.current.volume = 0.3; // 设置柔和的音量 (0.0 - 1.0)
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            // 现代浏览器策略通常会阻止自动播放，除非用户先与页面交互（如点击）
            // 这是正常现象，用户可以点击右上角的音乐图标手动播放
            console.log("自动播放被阻止，等待用户点击播放。", error);
            setIsPlaying(false);
          });
      }
    }
  }, [MUSIC_URL]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!MUSIC_URL) {
      console.warn("未在 components/BackgroundMusic.tsx 中设置音乐链接");
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("播放失败", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <button 
      onClick={togglePlay}
      className={`p-3 rounded-full shadow-lg transition-all active:scale-95 ${
        isPlaying 
          ? 'bg-white/90 text-pink-600 hover:bg-white' 
          : 'bg-gray-200/80 text-gray-500 hover:bg-gray-200'
      }`}
      title={isPlaying ? "静音" : "播放音乐"}
    >
      {isPlaying ? <Music className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
      <audio ref={audioRef} src={MUSIC_URL} loop />
    </button>
  );
};
