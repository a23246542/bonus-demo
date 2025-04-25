import React from "react";
import { motion, Variants } from "framer-motion";
import diceGroupSrc from "../assets/dice-group.png";

interface DiceGroupProps {
  isVisible: boolean;
}

const diceVariants: Variants = {
  hidden: { opacity: 0, y: -20, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.7, duration: 0.4, ease: "easeOut" },
  },
};

/** 骰子組，淡入並從上方滑入，放置在金色骰盅內 */
const DiceGroup: React.FC<DiceGroupProps> = ({ isVisible }) => (
  <motion.img
    src={diceGroupSrc}
    alt="骰子"
    initial="hidden"
    animate={isVisible ? "visible" : "hidden"}
    variants={diceVariants}
    style={{
      width: 100,
      marginBottom: 16,
      position: "relative",
      top: "10px", // 微調骰子在盅內的垂直位置
    }}
  />
);

export default DiceGroup;
