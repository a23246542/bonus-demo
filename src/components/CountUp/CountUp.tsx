import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2, // Duration of the animation in seconds
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [animationStarted, setAnimationStarted] = useState(false);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  // 使用固定參數以提供更一致的動畫體驗
  const damping = 50;
  const stiffness = 170;

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
    // 增加最終值的精確性
    restDelta: 0.01,
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  // 設定初始文字內容
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = String(direction === "down" ? to : from);
    }
  }, [from, to, direction]);

  // 用於追蹤動畫持續時間並強制完成
  useEffect(() => {
    if (isInView && startWhen && !animationStarted) {
      setAnimationStarted(true);

      if (typeof onStart === "function") {
        onStart();
      }

      // 開始動畫
      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);

      // 使用 requestAnimationFrame 和時間戳記來追蹤持續時間
      let startTime: number | null = null;
      let animationFrameId: number;

      // 定義動畫進度計算函式
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);

        // 如果接近動畫結束，強制設定最終值
        if (progress >= 0.95) {
          // 直接設定最終值，避免動畫延遲
          if (ref.current) {
            const options = {
              useGrouping: !!separator,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            };

            const formattedNumber = Intl.NumberFormat("en-US", options).format(
              direction === "down" ? from : to
            );

            ref.current.textContent = separator
              ? formattedNumber.replace(/,/g, separator)
              : formattedNumber;
          }

          // 觸發結束回調
          if (typeof onEnd === "function" && progress >= 0.99) {
            onEnd();
            return; // 停止動畫循環
          }
        }

        // 繼續動畫循環直到完成
        animationFrameId = requestAnimationFrame(animate);
      };

      // 延遲後開始動畫計時
      const animationStartTimeoutId = setTimeout(() => {
        animationFrameId = requestAnimationFrame(animate);
      }, delay * 1000);

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(animationStartTimeoutId);
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [
    isInView,
    startWhen,
    motionValue,
    direction,
    from,
    to,
    delay,
    onStart,
    onEnd,
    duration,
    animationStarted,
    separator,
  ]);

  // 更新文字內容
  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const options = {
          useGrouping: !!separator,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        };

        const formattedNumber = Intl.NumberFormat("en-US", options).format(
          Number(latest.toFixed(0))
        );

        ref.current.textContent = separator
          ? formattedNumber.replace(/,/g, separator)
          : formattedNumber;
      }
    });

    return () => unsubscribe();
  }, [springValue, separator]);

  return <span className={`${className}`} ref={ref} />;
}
