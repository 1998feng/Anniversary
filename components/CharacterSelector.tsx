import React from 'react';
import { useGameStore } from '../store';
import { CharacterId } from '../types';
import { X, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CharacterSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHARACTERS: { id: CharacterId; name: string; color: string }[] = [
  { id: 'steve', name: '经典史蒂夫', color: '#008080' }, // Matches actual model
  { id: 'tuxedo', name: '西装史蒂夫', color: '#1a1a1a' },
  { id: 'alex', name: '亚历克斯', color: '#677c36' },
  { id: 'zombie', name: '僵尸', color: '#527a3a' },
];

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ isOpen, onClose }) => {
  const { selectedCharacter, setSelectedCharacter } = useGameStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white/90 rounded-xl p-6 w-[90%] max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5" />
                选择皮肤
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {CHARACTERS.map((char) => (
                <button
                  key={char.id}
                  onClick={() => {
                    setSelectedCharacter(char.id);
                    onClose();
                  }}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    selectedCharacter === char.id 
                      ? 'border-black bg-gray-100 scale-105' 
                      : 'border-transparent bg-white hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  <div 
                    className="w-12 h-12 rounded-full border shadow-sm"
                    style={{ backgroundColor: char.color }}
                  />
                  <span className="font-medium text-gray-700">{char.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};