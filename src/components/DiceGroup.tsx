import React from "react";
import { motion, Variants, AnimationControls } from "framer-motion";
import diceGroupSrc from "../assets/dice-group.png";

interface DiceGroupProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

const diceVariants: Variants = {
  hidden: { opacity: 0, y: -20, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.3, duration: 0.3, ease: "easeOut" }, // 延遲和持續時間縮短
  },
};

/** 骰子組，淡入並從上方滑入，放置在金色骰盅內 */
const DiceGroup: React.FC<DiceGroupProps> = ({
  isVisible,
  onAnimationComplete,
}) => (
  <motion.img
    src={diceGroupSrc}
    alt="骰子"
    initial="hidden"
    animate={isVisible ? "visible" : "hidden"}
    variants={diceVariants}
    // className="w-107 h-72 object-cover"
    className="w-107 h-72 object-cover"
    style={{
      // width: 100,
      // marginBottom: 16,
      position: "relative",
      // top: "10px", // 微調骰子在盅內的垂直位置
    }}
    onAnimationComplete={isVisible ? onAnimationComplete : undefined}
  />
);

export default DiceGroup;
