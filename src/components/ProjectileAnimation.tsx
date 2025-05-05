import React, { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  AnimationControls,
} from "framer-motion";
import Coin from "./Coin";

// 重力（m/s²）、比例尺（1 m = 10 px）
const g = 9.8;
const scale = 10;

interface Position {
  x: number;
  y: number;
}

interface ProjectileAnimationProps {
  id?: string;
  v0?: number; // 初速度
  angle?: number; // 角度
  color?: string; // 顏色
  startX?: number; // 起始X座標
  startY?: number; // 起始Y座標
  size?: number; // 粒子大小
  onComplete?: (id: string) => void; // 完成回呼
  controls?: AnimationControls; // 動畫控制器
}

const ProjectileAnimation: React.FC<ProjectileAnimationProps> = ({
  id = "projectile-1",
  v0 = 20,
  angle = 45,
  color = "gold",
  startX = 0,
  startY = 300,
  size = 16,
  onComplete,
  controls,
}) => {
  // 使用 useMotionValue 來追蹤時間進度
  const progress = useMotionValue(0);

  // 追蹤元件是否已顯示
  const [isVisible, setIsVisible] = useState(false);
  // 追蹤動畫是否已完成
  const [isCompleted, setIsCompleted] = useState(false);

  console.log(`isVisible: ${isVisible}, isCompleted: ${isCompleted}`);

  // 當元件顯示時開始動畫
  useEffect(() => {
    if (isVisible && !isCompleted) {
      animate(progress, 1, {
        duration: 2,
        ease: "linear",
        onComplete: () => {
          setIsCompleted(true);
          if (onComplete) onComplete(id);
        },
      });
    }
  }, [isVisible, progress, id, onComplete, isCompleted]);

  // 使用 useTransform 建立衍生值
  const x = useTransform(progress, (p) => {
    const vx = v0 * Math.cos((angle * Math.PI) / 180);
    return startX + vx * p * scale;
  });

  const y = useTransform(progress, (p) => {
    const vy = v0 * Math.sin((angle * Math.PI) / 180);
    const calculatedY = vy * p - 0.5 * g * p * p;
    return startY - calculatedY * scale;
  });

  // 漸變透明度
  const opacity = useTransform(progress, [0, 0.01, 0.7, 1], [0, 1, 0.8, 0]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={controls || { opacity: 1 }}
      onAnimationStart={() => {
        if (!isCompleted) {
          setIsVisible(true);
        }
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      style={{
        x,
        y,
        width: size,
        height: size,
        // borderRadius: "50%",
        // background: `radial-gradient(circle, ${color}, ${
        //   color === "gold" ? "darkgoldenrod" : color
        // })`,
        position: "absolute",
        opacity,
        // boxShadow: `0 0 10px ${color}`,
      }}
    >
      <Coin />
    </motion.div>
  );
};

export default ProjectileAnimation;
