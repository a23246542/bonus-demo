import React, { useState, useCallback, useMemo } from "react";
import {
  motion,
  useAnimationControls,
  AnimatePresence,
  Variants,
  AnimationControls,
} from "framer-motion";
import BonusBackground from "./BonusBackground";
import LottieOverlay from "./LottieOverlay";
import DiceGroup from "./DiceGroup";
import AmountDisplay from "./AmountDisplay";
import jackpotBg from "../assets/JACKPOT.jpg";
import apertureSrc from "../assets/aperture.png"; // 直接引入光圈圖片
import { useAnimationSequence } from "../hooks/useAnimationSequence";

// 動畫元件類型定義
type ComponentType = "aperture" | "background" | "dice" | "lottie" | "amount";

/**
 * 定義各種動畫變體
 */
// 光圈動畫
const apertureVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, rotate: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 360,
    transition: {
      opacity: { duration: 0.4, ease: "easeOut" },
      scale: { duration: 0.4, ease: "easeOut" },
      rotate: {
        duration: 8,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  },
};

// 背景動畫
const backgroundVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// 骰子動畫
const diceVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

// Lottie 動畫
const lottieVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.0, ease: "easeOut" },
  },
};

// 金額動畫
const amountVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

/**
 * AnimationDemo: 整合多層動畫的主要元件
 * 統一在外層處理動畫邏輯，內部組件專注於內容渲染
 */
const AnimationDemo: React.FC = () => {
  // 動畫控制器
  const apertureControls = useAnimationControls();
  const backgroundControls = useAnimationControls();
  const diceControls = useAnimationControls();
  const lottieControls = useAnimationControls();
  const amountControls = useAnimationControls();

  // 建立控制器映射
  const controlsMap = useMemo<Record<ComponentType, AnimationControls>>(
    () => ({
      aperture: apertureControls,
      background: backgroundControls,
      dice: diceControls,
      lottie: lottieControls,
      amount: amountControls,
    }),
    [
      apertureControls,
      backgroundControls,
      diceControls,
      lottieControls,
      amountControls,
    ]
  );

  // 定義動畫階段
  const animationStages = [
    {
      id: "背景和光圈階段跟骰子階段",
      timeout: 2000,
      execute: async (controls: Record<ComponentType, AnimationControls>) => {
        try {
          await Promise.all([
            controls.aperture.start("visible"),
            controls.background.start("visible"),
            controls.dice.start("visible"),
          ]);
          console.log("背景、光圈和骰子動畫已啟動");
        } catch (err) {
          console.error("背景、光圈和骰子動畫啟動失敗:", err);
          throw err;
        }
      },
    },
    // {
    //   id: "骰子階段",
    //   timeout: 1200, // 增加逾時時間
    //   start: async () => {
    //     // *** 簡化：直接 await ***
    //     try {
    //       await diceControls.start("visible");
    //       console.log("骰子動畫已啟動 (Promise resolved)");
    //     } catch (err) {
    //       console.error("骰子動畫啟動失敗:", err);
    //       throw err;
    //     }
    //   },
    // },
    {
      id: "金額階段",
      timeout: 1300,
      execute: async (controls: Record<ComponentType, AnimationControls>) => {
        try {
          await controls.amount.start("visible");
          console.log("金額動畫已啟動");
        } catch (err) {
          console.error("金額動畫啟動失敗:", err);
          throw err;
        }
      },
    },
    {
      id: "Lottie階段",
      timeout: 1500,
      execute: async (controls: Record<ComponentType, AnimationControls>) => {
        try {
          await controls.lottie.start("visible");
          console.log("Lottie動畫已啟動");
        } catch (err) {
          console.error("Lottie動畫啟動失敗:", err);
          throw err;
        }
      },
    },
  ];

  // 使用自定義動畫序列控制器
  const {
    startSequence,
    resetSequence,
    isPlaying,
    isComplete,
    shouldShowComponent,
  } = useAnimationSequence<ComponentType>(animationStages, controlsMap);

  // 處理觸發按鈕點擊
  const handleTrigger = useCallback((): void => {
    resetSequence();
    setTimeout(() => {
      startSequence();
    }, 50);
  }, [resetSequence, startSequence]);

  const appStyle = {
    backgroundImage: `url(${jackpotBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div
      className="AnimationDemo w-full max-w-[390px] mx-auto h-[844px] overflow-hidden relative"
      style={appStyle}
    >
      <button
        onClick={handleTrigger}
        disabled={isPlaying}
        aria-label="觸發動畫"
        className="absolute top-20 left-0 right-0 mx-auto z-10"
        style={{
          width: "120px",
          padding: "0.5rem 1rem",
          marginBottom: "4rem",
          fontSize: "1rem",
          cursor: isPlaying ? "not-allowed" : "pointer",
          borderRadius: "4px",
        }}
      >
        開始動畫
      </button>

      {/* 主要動畫容器 */}
      <div className="container absolute top-0 left-0 right-0 bottom-0 outline outline-1 outline-red-600">
        {/* 光圈效果 - 放在最底層 - 直接使用 motion.img 而不是組件 */}
        <AnimatePresence>
          {shouldShowComponent("aperture") && (
            <motion.div
              className="top-150 absolute left-0 right-0 bottom-0 w-full h-full"
              style={{ zIndex: 1 }}
            >
              <motion.img
                src={apertureSrc}
                alt="光圈效果"
                className="w-550 h-550 object-cover mx-auto"
                initial="hidden"
                animate={apertureControls}
                variants={apertureVariants}
                aria-hidden="true"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 背景容器 */}
        <AnimatePresence>
          {shouldShowComponent("background") && (
            <motion.div
              className="absolute w-285 h-382 top-250 left-0 right-0 bottom-0 mx-auto"
              style={{ position: "relative", zIndex: 2 }}
              initial="hidden"
              animate={backgroundControls}
              variants={backgroundVariants}
            >
              <BonusBackground className="absolute top-0 left-0 right-0 mx-auto" />

              {/* Lottie 動畫僅在達到特定階段後顯示 */}
              <AnimatePresence>
                {shouldShowComponent("lottie") && (
                  <motion.div
                    initial="hidden"
                    animate={lottieControls}
                    variants={lottieVariants}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <LottieOverlay
                      isVisible={true}
                      onAnimationComplete={undefined}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 骰子在金色骰盅內位置 */}
              <AnimatePresence>
                {shouldShowComponent("dice") && (
                  <motion.div
                    className="DiceGroup absolute top-122 left-0 right-0 mx-auto"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                    initial="hidden"
                    animate={diceControls}
                    variants={diceVariants}
                  >
                    <DiceGroup />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 金幣數字在紫色背景區塊 */}
              <AnimatePresence>
                {shouldShowComponent("amount") && (
                  <motion.div
                    className="absolute top-245 left-0 right-0 mx-auto"
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                    initial="hidden"
                    animate={amountControls}
                    variants={amountVariants}
                  >
                    <AmountDisplay />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 動畫完成後顯示重設按鈕 */}
      {isComplete && (
        <button
          onClick={resetSequence}
          className="absolute bottom-20 left-0 right-0 mx-auto"
          style={{
            width: "120px",
            padding: "0.5rem 1rem",
            background: "#4a4a4a",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          重設動畫
        </button>
      )}
    </div>
  );
};

export default AnimationDemo;
