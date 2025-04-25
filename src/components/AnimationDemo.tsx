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
      </div>
      {/* 骰子與金額顯示 */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <DiceGroup isVisible={isPlaying} />
        <AmountDisplay isVisible={isPlaying} />
      </div>
    </div>
  );
};

export default AnimationDemo;
