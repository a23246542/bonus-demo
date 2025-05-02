import React from "react";
import diceGroupSrc from "../assets/dice-group.png";

interface DiceGroupProps {
  className?: string;
}

/**
 * 骰子圖片內容組件
 * 移除動畫邏輯，改為單純的圖片渲染
 */
const DiceGroup: React.FC<DiceGroupProps> = ({ className = "" }) => (
  <img
    src={diceGroupSrc}
    alt="骰子"
    className={`w-107 h-72 object-cover ${className}`}
  />
);

export default DiceGroup;
