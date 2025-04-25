import React, { useState } from "react";
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

  const handleTrigger = (): void => {
    setIsPlaying(true);
  };

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
      {/* 光圈效果 */}
      <ApertureEffect />
      {/* 背景與 Lottie 疊加 */}
      <div style={{ position: "relative" }}>
        <BonusBackground isVisible={isPlaying} />
        <LottieOverlay isVisible={isPlaying} />

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
