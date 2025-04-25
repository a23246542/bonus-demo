import React from "react";
import { motion } from "framer-motion";
import apertureSrc from "../assets/aperture.png";

/** 持續旋轉的光圈效果，置於最底層 */
const ApertureEffect: React.FC = () => (
  <motion.img
    src={apertureSrc}
    alt="光圈效果"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      maxWidth: 400,
      zIndex: -1,
    }}
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
  />
);

export default ApertureEffect;
