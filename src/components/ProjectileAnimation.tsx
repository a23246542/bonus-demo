import React, { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  AnimationControls,
} from "framer-motion";
import Coin from "./Coin";

interface Position {
  x: number;
  y: number;
}

/**
 * 計算拋物線軌跡上的位置
 * @param p 時間進度 (0-1)
 * @param v0 初速度
 * @param angle 角度 (度)
 * @param startX 起始X座標
 * @param startY 起始Y座標
 * @param duration 動畫持續時間 (秒)
 * @param g 重力加速度 (m/s²)
 * @param scale 比例尺 (1 m = scale px)
 * @returns 計算後的位置座標
 */
const calculateProjectilePosition = (
  p: number,
  v0: number,
  angle: number,
  startX: number,
  startY: number,
  duration: number = 2,
  g: number = 9.8,
  scale: number = 25
): Position => {
  // 將進度轉換為實際時間 (秒)
  const t = p * duration;

  // 使用標準拋物線公式計算位移
  const rad = (angle * Math.PI) / 180;
  const vx = v0 * Math.cos(rad);
  const vy = v0 * Math.sin(rad);

  // 計算相對位移並轉換為螢幕座標
  const x = startX + vx * t * scale;
  const y = startY - (vy * t - 0.5 * g * t * t) * scale; // 注意螢幕座標系y軸向下

  return { x, y };
};

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
  duration?: number; // 動畫持續時間 (秒)
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
  duration = 1, // 預設動畫持續時間
}) => {
  // 使用 useMotionValue 來追蹤時間進度
  const progress = useMotionValue(0);

  // 追蹤元件是否已顯示
  const [isVisible, setIsVisible] = useState(false);
  // 追蹤動畫是否已完成
  const [isCompleted, setIsCompleted] = useState(false);

  // console.log(`isVisible: ${isVisible}, isCompleted: ${isCompleted}`);

  // 當元件顯示時開始動畫
  useEffect(() => {
    if (isVisible && !isCompleted) {
      animate(progress, 1, {
        duration: duration, // 使用可設定的持續時間
        ease: "linear",
        onComplete: () => {
          setIsCompleted(true);
          if (onComplete) onComplete(id);
        },
      });
    }
  }, [isVisible, progress, id, onComplete, isCompleted, duration]);

  // 使用 useTransform 建立衍生值
  const x = useTransform(progress, (p) => {
    return calculateProjectilePosition(p, v0, angle, startX, startY, duration)
      .x;
  });

  const y = useTransform(progress, (p) => {
    return calculateProjectilePosition(p, v0, angle, startX, startY, duration)
      .y;
  });

  // 漸變透明度
  const opacity = useTransform(progress, [0, 0.01, 0.9, 1], [0, 1, 0.8, 0]);

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
