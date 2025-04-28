import React from "react";
import { motion, Variants } from "framer-motion";
import bonusBgSrc from "../assets/bonus-bg.png";

interface BonusBackgroundProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

const backgroundVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" }, // 縮短動畫時間
  },
};

/** 主背景縮放淡入 */
const BonusBackground: React.FC<BonusBackgroundProps> = ({
  isVisible,
  onAnimationComplete,
}) => (
  <motion.img
    src={bonusBgSrc}
    alt="主背景"
    initial="hidden"
    animate={isVisible ? "visible" : "hidden"}
    variants={backgroundVariants}
    style={{ width: "80%", maxWidth: 400 }}
    onAnimationComplete={isVisible ? onAnimationComplete : undefined}
  />
);

export default BonusBackground;
