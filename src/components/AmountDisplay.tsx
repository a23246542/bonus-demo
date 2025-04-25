import React from "react";
import { motion, Variants } from "framer-motion";
import amountSrc from "../assets/coin-number.png";

interface AmountDisplayProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

const amountVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.5, duration: 0.3, ease: "easeOut" }, // 縮短延遲和持續時間
  },
};

/** 金額顯示，淡入並從下方滑入，位於紫色背景區塊 */
const AmountDisplay: React.FC<AmountDisplayProps> = ({
  isVisible,
  onAnimationComplete,
}) => (
  <motion.img
    src={amountSrc}
    alt="金額顯示"
    initial="hidden"
    animate={isVisible ? "visible" : "hidden"}
    variants={amountVariants}
    style={{
      width: 180,
      position: "relative",
      top: "40px", // 調整位置至紫色背景區塊
    }}
    onAnimationComplete={isVisible ? onAnimationComplete : undefined}
  />
);

export default AmountDisplay;
