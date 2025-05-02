import React from "react";
import apertureSrc from "../assets/aperture.png";

interface ApertureEffectProps {
  className?: string;
}

/**
 * 光圈效果圖片內容組件
 * 移除動畫邏輯，改為單純的圖片渲染
 */
const ApertureEffect: React.FC<ApertureEffectProps> = ({ className = "" }) => {
  return (
    <img
      src={apertureSrc}
      alt="光圈效果"
      className={`w-550 h-550 object-cover mx-auto ${className}`}
      aria-hidden="true" // 光圈是裝飾性元素
    />
  );
};

export default ApertureEffect;
