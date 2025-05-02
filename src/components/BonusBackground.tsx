import React from "react";
import bonusBgSrc from "../assets/bonus-bg.png";

interface BonusBackgroundProps {
  className?: string;
}

/**
 * 主背景圖片內容組件
 * 移除動畫邏輯，改為單純的圖片渲染
 */
const BonusBackground: React.FC<BonusBackgroundProps> = ({
  className = "",
}) => {
  return (
    <img
      src={bonusBgSrc}
      alt="主背景"
      className={`w-285 object-cover ${className}`}
    />
  );
};

export default BonusBackground;
