
import React, { useEffect, useRef, useState } from 'react';
import { Music, VolumeX } from 'lucide-react';

export const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // TODO: Add your background music URL here (mp3/ogg)
  // Example: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  const MUSIC_URL = ""; 

  useEffect(() => {
    // Only attempt to play if a URL is provided
    if (audioRef.current && MUSIC_URL) {
      audioRef.current.volume = 0.3; // Set gentle volume
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            // Auto-play was prevented by browser policy (interaction required)
            console.log("Autoplay prevented. User must click to play.");
            setIsPlaying(false);
          });
      }
    }
  }, [MUSIC_URL]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!MUSIC_URL) {
      console.warn("No music URL provided in components/BackgroundMusic.tsx");
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
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
