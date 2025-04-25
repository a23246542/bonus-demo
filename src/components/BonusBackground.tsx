import React from "react";
import { motion, Variants } from "framer-motion";
import bonusBgSrc from "../assets/bonus-bg.png";

interface BonusBackgroundProps {
  isVisible: boolean;
}

const backgroundVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/** 主背景縮放淡入 */
const BonusBackground: React.FC<BonusBackgroundProps> = ({ isVisible }) => (
  <motion.img
    src={bonusBgSrc}
    alt="主背景"
    initial="hidden"
    animate={isVisible ? "visible" : "hidden"}
    variants={backgroundVariants}
    style={{ width: "100%", maxWidth: 400 }}
  />
);

export default BonusBackground;
