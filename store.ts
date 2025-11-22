
import { create } from 'zustand';
import { GameState } from './types';

export const useGameStore = create<GameState>((set) => ({
  focusedPhotoId: null,
  isJoystickActive: false,
  selectedCharacter: 'steve', // 默认必须是 steve
  setFocusedPhotoId: (id) => set({ focusedPhotoId: id }),
  setJoystickActive: (active) => set({ isJoystickActive: active }),
  setSelectedCharacter: (id) => set({ selectedCharacter: id }),
}));

// 地图配置 - 圆形大厅
const HALL_RADIUS = 18; 
const WALL_HEIGHT = 4.5; 

const getCircularTransform = (index: number, total: number, radius: number, height: number) => {
  const angle = (index / total) * Math.PI * 2; 
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const rotationY = angle + Math.PI; 

  return {
    position: [x, height, z] as [number, number, number],
    rotation: [0, rotationY, 0] as [number, number, number],
  };
};

// 移除 dim 字段，尺寸现在由 PhotoFrame 自动计算
// 主题更新：恋爱一周年纪念
const photoConfigs = [
  { id: '1', url: 'https://picsum.photos/600/800?random=101', title: '相遇的那天' },
  { id: '2', url: 'https://picsum.photos/600/600?random=102', title: '第一次约会' },
  { id: '3', url: 'https://picsum.photos/500/700?random=103', title: '确认关系' },
  { id: '4', url: 'https://picsum.photos/800/600?random=104', title: '一起过的生日' },
  { id: '5', url: 'https://picsum.photos/600/800?random=105', title: '无论是晴是雨' },
  { id: '6', url: 'https://picsum.photos/900/500?random=106', title: '第一次旅行' },
  { id: '7', url: 'https://picsum.photos/500/500?random=107', title: '你的可爱瞬间' },
  { id: '8', url: 'https://picsum.photos/600/800?random=108', title: '我们的纪念物' },
  { id: '9', url: 'https://picsum.photos/800/1000?random=109', title: '平淡的幸福' },
  { id: '10', url: 'https://picsum.photos/800/600?random=110', title: '彼此包容' },
  { id: '11', url: 'https://picsum.photos/600/600?random=111', title: '一周年快乐' },
  { id: '12', url: 'https://picsum.photos/1000/600?random=112', title: '未完待续...' },
];

export const PHOTOS: import('./types').PhotoData[] = photoConfigs.map((config, index) => {
  const transform = getCircularTransform(index, photoConfigs.length, HALL_RADIUS - 0.5, WALL_HEIGHT);
  return {
    id: config.id,
    url: config.url,
    title: config.title,
    position: transform.position,
    rotation: transform.rotation,
  };
});
