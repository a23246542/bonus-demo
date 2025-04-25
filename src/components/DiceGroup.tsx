import React from "react";
import { motion, Variants } from "framer-motion";
import diceGroupSrc from "../assets/dice-group.png";

interface DiceGroupProps {
  isVisible: boolean;
}

const diceVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.7, duration: 0.3, ease: "easeOut" },
  },
};

/** 骰子組，淡入並滑入 */
const DiceGroup: React.FC<DiceGroupProps> = ({ isVisible }) => (
  <motion.img
    src={diceGroupSrc}
    alt="骰子"
    initial="hidden"
    animate={isVisible ? "visible" : "hidden"}
    variants={diceVariants}
    style={{ width: 100, marginRight: 16 }}
  />
);

export default DiceGroup;
