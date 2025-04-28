import React, { useEffect } from "react";
import { motion } from "framer-motion";
import apertureSrc from "../assets/aperture.png";

interface ApertureEffectProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

/** 持續旋轉的光圈效果，置於最底層，比主背景更大 */
const ApertureEffect: React.FC<ApertureEffectProps> = ({
  isVisible,
  onAnimationComplete,
}) => {
  // 使用 useEffect 在適當時機觸發回調，時間縮短
  useEffect(() => {
    if (isVisible && onAnimationComplete) {
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, 400); // 縮短等待時間

      return () => clearTimeout(timer);
    }
  }, [isVisible, onAnimationComplete]);

  return (
    <motion.img
      src={apertureSrc}
      alt="光圈效果"
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={
        isVisible
          ? { opacity: 1, scale: 1, rotate: 360 }
          : { opacity: 0, scale: 0, rotate: 0 }
      }
      transition={{
        opacity: { duration: 0.3, ease: "easeOut" },
        scale: { duration: 0.3, ease: "easeOut" },
        rotate: {
          repeat: Infinity,
          duration: 3, // 加快旋轉
          ease: "linear",
        },
      }}
      style={{
        position: "absolute",
        top: "-15%",
        left: "-15%",
        width: "130%",
        maxWidth: 520,
      }}
    />
  );
};

export default ApertureEffect;
