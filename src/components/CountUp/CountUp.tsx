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
  duration = 2, // 參考用，實際由物理參數控制
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
  const damping = 60; // 增加阻尼可以減少彈跳
  const stiffness = 250; // 增加剛性可以加快速度
  const mass = 1; // 質量也會影響動畫

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
    mass,
    // 增加最終值的精確性
    restDelta: 0.01, // 當速度小於此值時認為動畫停止
    restSpeed: 0.01, // 當變化小於此值時認為動畫停止
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  // 設定初始文字內容 - 初始時不顯示任何內容，避免閃現0
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = "";
    }
  }, []);

  // 啟動動畫的 Effect
  useEffect(() => {
    // 確保只有在元件可見、允許啟動且尚未啟動時執行
    if (isInView && startWhen && !animationStarted) {
      setAnimationStarted(true); // 標記動畫已啟動

      if (typeof onStart === "function") {
        onStart();
      }

      // 開始動畫前先設定起始顯示
      if (ref.current) {
        const options = {
          useGrouping: !!separator,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        };

        // 設定正確的起始值顯示（對齊在右側）
        const startValue = direction === "down" ? to : from;
        const formattedNumber = Intl.NumberFormat("en-US", options).format(
          startValue
        );

        ref.current.textContent = separator
          ? formattedNumber.replace(/,/g, separator)
          : formattedNumber;
      }

      // 使用 setTimeout 處理延遲
      const timeoutId = setTimeout(() => {
        // 設定 motionValue 的目標值，觸發 useSpring 動畫
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);

      return () => {
        clearTimeout(timeoutId); // 清除計時器
      };
    }
  }, [
    isInView,
    startWhen,
    animationStarted,
    motionValue,
    direction,
    from,
    to,
    delay,
    onStart,
    separator,
  ]);

  // 監聽 springValue 的變化並更新 DOM
  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const options = {
          useGrouping: !!separator,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        };
        // 四捨五入到最接近的整數
        const roundedValue = Math.round(latest);
        const formattedNumber = Intl.NumberFormat("en-US", options).format(
          roundedValue
        );

        ref.current.textContent = separator
          ? formattedNumber.replace(/,/g, separator)
          : formattedNumber;
      }
    });

    // 監聽動畫完成事件
    const unsubscribeComplete = springValue.on("animationComplete", () => {
      // 確保最終值被精確設定
      if (ref.current) {
        const finalValue = direction === "down" ? from : to;
        const options = {
          useGrouping: !!separator,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        };
        const formattedNumber = Intl.NumberFormat("en-US", options).format(
          finalValue
        );
        ref.current.textContent = separator
          ? formattedNumber.replace(/,/g, separator)
          : formattedNumber;
      }
      // 觸發 onEnd 回調
      if (typeof onEnd === "function") {
        onEnd();
      }
    });

    // 清理函式
    return () => {
      unsubscribe();
      unsubscribeComplete();
    };
  }, [springValue, separator, onEnd, direction, from, to]);

  return <span className={`${className}`} ref={ref} />;
}
