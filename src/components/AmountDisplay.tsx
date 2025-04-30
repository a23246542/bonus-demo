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
  <div
    className="AmountDisplay w-241 h-65"
    style={{ display: isVisible ? "block" : "none" }}
  >
    <motion.img
      src={amountSrc}
      alt="金額顯示"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={amountVariants}
      // className="w-168 h-26 object-cover"
      className="w-168 object-cover"
      style={{}}
      onAnimationComplete={isVisible ? onAnimationComplete : undefined}
    />
  </div>
);

export default AmountDisplay;
