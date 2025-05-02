import React from "react";
import amountSrc from "../assets/coin-number.png";

interface AmountDisplayProps {
  className?: string;
}

/**
 * 金額顯示圖片內容組件
 * 移除動畫邏輯，改為單純的圖片渲染
 */
const AmountDisplay: React.FC<AmountDisplayProps> = ({ className = "" }) => (
  <div className={`AmountDisplay w-241 h-65 ${className}`}>
    <img src={amountSrc} alt="金額顯示" className="w-168 object-cover" />
  </div>
);

export default AmountDisplay;
