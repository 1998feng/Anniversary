
export interface PhotoData {
  id: string;
  url: string;
  title: string;
  description?: string;
  position: [number, number, number];
  rotation: [number, number, number];
  // dimensions 字段已移除，现在由组件根据图片自动计算
}

// 严格限制这 4 种皮肤 ID
export type CharacterId = 'steve' | 'tuxedo' | 'zombie' | 'alex';

export interface GameState {
  focusedPhotoId: string | null;
  isJoystickActive: boolean;
  selectedCharacter: CharacterId;
  isCameraReverse: boolean; // 新增：是否反转视角控制
  setFocusedPhotoId: (id: string | null) => void;
  setJoystickActive: (active: boolean) => void;
  setSelectedCharacter: (id: CharacterId) => void;
  toggleCameraReverse: () => void; // 新增：切换视角控制模式
}

export interface JoystickOutput {
  x: number;
  y: number;
}
