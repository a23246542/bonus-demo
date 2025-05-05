import { DotLottie } from "@lottiefiles/dotlottie-react";

// 擴充 DotLottie 型別以取得 animationData 中的幀率屬性
export type DotLottieWithData = DotLottie & { animationData: { fr: number } };

// 定義幀變化事件的介面
export interface FrameEvent {
  currentFrame: number;
}

// 定義動畫資訊介面，提高型別安全性
export interface AnimationInfo {
  totalFrames: number;
  frameRate: number;
  duration: number;
  resetAtSecond: number;
  resetAtFrame: number;
  isReady: boolean;
}

// 金幣組件 Props
export interface CoinProps {
  resetAtSecond?: number; // 在第幾秒重頭播放，預設為動畫時長的一半
}

// 獲獎玩家介面
export interface AwardPlayer {
  id: number;
  avatarUrl: string;
  amount: number;
  style: {
    position: "absolute";
    transform?: string;
    left: string;
    opacity: number;
    zIndex: number;
  };
}

// 金幣雨組件 Props
export interface CoinRainProps {
  count?: number; // 金幣數量
  resetAtSecond?: number; // 在第幾秒重頭播放
  showAwardPlayers?: boolean; // 是否顯示獲獎玩家
}
