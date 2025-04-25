import React, { useState, useEffect } from "react";
import AnimationTriggerButton from "./AnimationTriggerButton";
import ApertureEffect from "./ApertureEffect";
import BonusBackground from "./BonusBackground";
import LottieOverlay from "./LottieOverlay";
import DiceGroup from "./DiceGroup";
import AmountDisplay from "./AmountDisplay";

/**
 * AnimationDemo: 整合多層動畫的主要元件
 */
const AnimationDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  // 追蹤骰子是否已經顯示
  const [isDiceVisible, setIsDiceVisible] = useState(false);

  const handleTrigger = (): void => {
    setIsPlaying(true);
    // 重設骰子顯示狀態
    setIsDiceVisible(false);
  };

  // 監聽 isPlaying 狀態，設定延遲來追蹤骰子顯示時間
  useEffect(() => {
    if (isPlaying) {
      // 骰子動畫有 0.7 秒延遲 + 0.4 秒動畫時間，所以設定稍微長一點延遲確保骰子完全顯示
      const timer = setTimeout(() => {
        setIsDiceVisible(true);
      }, 1200); // 1.2 秒後骰子應該已完全顯示

      return () => clearTimeout(timer);
    }
  }, [isPlaying]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 400,
        margin: "2rem auto",
        textAlign: "center",
      }}
    >
      <AnimationTriggerButton onClick={handleTrigger} disabled={isPlaying} />
      {/* 光圈效果 - 現在只在動畫播放時顯示 */}
      <ApertureEffect isVisible={isPlaying} />
      {/* 背景與 Lottie 疊加 */}
      <div style={{ position: "relative" }}>
        <BonusBackground isVisible={isPlaying} />
        {/* Lottie 動畫現在只在骰子顯示後才會播放 */}
        <LottieOverlay isVisible={isDiceVisible} />

        {/* 骰子與金額顯示 - 絕對定位於特定位置 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* 骰子在金色骰盅內位置 */}
          <div
            style={{
              marginTop: "30%", // 調整骰子垂直位置
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <DiceGroup isVisible={isPlaying} />
          </div>

          {/* 金幣數字在紫色背景區塊 */}
          <div
            style={{
              marginTop: "5%", // 金幣與骰子間距
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <AmountDisplay isVisible={isPlaying} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationDemo;
