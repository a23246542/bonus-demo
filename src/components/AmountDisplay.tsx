import React from "react";
import { motion, Variants } from "framer-motion";
import amountSrc from "../assets/coin-number.png";

interface AmountDisplayProps {
  isVisible: boolean;
}

const amountVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.9, duration: 0.4, ease: "easeOut" },
  },
};

/** 金額顯示，淡入並從下方滑入，位於紫色背景區塊 */
const AmountDisplay: React.FC<AmountDisplayProps> = ({ isVisible }) => (
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
  />
);

export default AmountDisplay;
