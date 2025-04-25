import React from "react";
import { motion, Variants } from "framer-motion";
import amountSrc from "../assets/coin-number.png";

interface AmountDisplayProps {
  isVisible: boolean;
}

const amountVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.9, duration: 0.3, ease: "easeOut" },
  },
};

/** 金額顯示，淡入並滑入 */
const AmountDisplay: React.FC<AmountDisplayProps> = ({ isVisible }) => (
  <motion.img
    src={amountSrc}
    alt="金額顯示"
    initial="hidden"
    animate={isVisible ? "visible" : "hidden"}
    variants={amountVariants}
    style={{ width: 100 }}
  />
);

export default AmountDisplay;
