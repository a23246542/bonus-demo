import React from "react";
import { motion, Variants } from "framer-motion";
import apertureSrc from "../assets/aperture.png";

interface ApertureEffectProps {
  isVisible: boolean;
}

const apertureVariants: Variants = {
  hidden: { opacity: 0, scale: 0, rotate: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 360,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      rotate: {
        repeat: Infinity,
        duration: 4,
        ease: "linear",
      },
    },
  },
};

/** 持續旋轉的光圈效果，置於最底層，比主背景更大 */
const ApertureEffect: React.FC<ApertureEffectProps> = ({ isVisible }) => (
  <motion.img
    src={apertureSrc}
    alt="光圈效果"
    initial="hidden"
    animate={isVisible ? "visible" : "hidden"}
    variants={apertureVariants}
    style={{
      position: "absolute",
      top: "-15%",
      left: "-15%",
      width: "130%",
      maxWidth: 520, // 比原本的400大30%
      zIndex: -1,
    }}
  />
);

export default ApertureEffect;
