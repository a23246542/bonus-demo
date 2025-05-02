import React, { useState, useCallback, useEffect } from "react";
import {
  motion,
  useAnimationControls,
  AnimatePresence,
  Variants,
} from "framer-motion";
import BonusBackground from "./BonusBackground";
import LottieOverlay from "./LottieOverlay";
import DiceGroup from "./DiceGroup";
import AmountDisplay from "./AmountDisplay";
import jackpotBg from "../assets/JACKPOT.jpg";
import apertureSrc from "../assets/aperture.png"; // 直接引入光圈圖片

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
 * 自定義動畫序列控制 Hook
 */
function useAnimationSequence(
  animations: {
    id: string;
    start: () => Promise<void>;
    timeout?: number; // 可選的逾時保護
  }[]
) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // 開始執行動畫序列
  const startSequence = useCallback(async () => {
    try {
      setIsPlaying(true);
      setIsComplete(false);
      setCurrentIndex(-1); // 重設索引

      for (let i = 0; i < animations.length; i++) {
        const animation = animations[i];
        console.log(`動畫階段變更: ${animation.id}`);

        // *** 關鍵修改：先更新索引，讓對應元件可以開始渲染 ***
        setCurrentIndex(i);

        // *** 關鍵修改：加入短暫延遲，等待 DOM 更新 ***
        await new Promise((resolve) => setTimeout(resolve, 50)); // 50ms 延遲，可以視情況調整

        // 執行動畫並處理可能的逾時
        const startPromise = animation.start(); // 取得 start 回傳的 Promise
        let timeoutTimer: NodeJS.Timeout | null = null;

        if (animation.timeout) {
          const timeoutPromise = new Promise<void>((resolveTimeout) => {
            timeoutTimer = setTimeout(() => {
              console.warn(`${animation.id} 逾時，自動進入下一階段`);
              resolveTimeout(); // 逾時也算完成
            }, animation.timeout);
          });

          try {
            await Promise.race([startPromise, timeoutPromise]);
          } catch (err) {
            console.error(`執行 ${animation.id} 動畫時發生錯誤:`, err);
            // 發生錯誤時仍繼續下一階段 (避免卡住)
          } finally {
            // 清除計時器
            if (timeoutTimer) {
              clearTimeout(timeoutTimer);
            }
          }
        } else {
          try {
            await startPromise; // 直接等待動畫 Promise 完成
          } catch (err) {
            console.error(`執行 ${animation.id} 動畫時發生錯誤:`, err);
            // 發生錯誤時仍繼續下一階段
          }
        }

        // *** 移除這裡的 setCurrentIndex(i)，因為已移到前面 ***
      }

      // 確保最後一個動畫完成後才設定 isComplete
      // 加入短暫延遲，讓使用者能看到完整動畫
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsComplete(true);
    } catch (error) {
      console.error("動畫序列執行錯誤:", error);
    } finally {
      setIsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animations]); // 移除 setCurrentIndex 依賴，因為它在 useCallback 內部被設定

  // 重設動畫序列
  const resetSequence = useCallback(() => {
    setCurrentIndex(-1);
    setIsPlaying(false);
    setIsComplete(false);
  }, []);

  return {
    startSequence,
    resetSequence,
    currentIndex,
    isPlaying,
    isComplete,
  };
}

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

  // 使用自定義動畫序列控制器
  const { startSequence, resetSequence, currentIndex, isPlaying, isComplete } =
    useAnimationSequence([
      {
        id: "背景和光圈階段跟骰子階段",
        timeout: 2000, // 增加逾時時間到 1000ms
        start: async () => {
          // *** 簡化：直接 await ***
          try {
            await Promise.all([
              apertureControls.start("visible"),
              backgroundControls.start("visible"),
              diceControls.start("visible"),
            ]);
            console.log("背景和光圈動畫已啟動 (Promise resolved)");
            console.log("骰子動畫已啟動 (Promise resolved)");
          } catch (err) {
            console.error("背景和光圈動畫啟動失敗:", err);
            // 錯誤會被 useAnimationSequence 捕捉
            throw err; // 重新拋出錯誤，讓 useAnimationSequence 知道
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
        timeout: 1300, // 增加逾時時間
        start: async () => {
          // *** 簡化：直接 await ***
          try {
            await amountControls.start("visible");
            console.log("金額動畫已啟動 (Promise resolved)");
          } catch (err) {
            console.error("金額動畫啟動失敗:", err);
            throw err;
          }
        },
      },
      {
        id: "Lottie階段",
        timeout: 1500, // 增加逾時時間
        start: async () => {
          // *** 簡化：直接 await ***
          try {
            await lottieControls.start("visible");
            console.log("Lottie動畫已啟動 (Promise resolved)");
            // 注意：Lottie 元件本身的播放可能需要額外處理或時間
          } catch (err) {
            console.error("Lottie動畫啟動失敗:", err);
            throw err;
          }
        },
      },
    ]);

  // 根據當前動畫索引決定顯示哪些元件
  const shouldShowApertureAndBackground = currentIndex >= 0;
  const shouldShowDice = currentIndex >= 1;
  const shouldShowLottie = currentIndex >= 2;
  const shouldShowAmount = currentIndex >= 3;

  // 初始化控制器設定
  useEffect(() => {
    // 設定所有控制器的初始狀態為 hidden
    apertureControls.set("hidden");
    backgroundControls.set("hidden");
    diceControls.set("hidden");
    lottieControls.set("hidden");
    amountControls.set("hidden");
  }, [
    apertureControls,
    backgroundControls,
    diceControls,
    lottieControls,
    amountControls,
  ]);

  // 處理觸發按鈕點擊
  const handleTrigger = useCallback((): void => {
    // 重設並重新啟動動畫序列
    resetSequence();

    // 重設所有控制器到初始狀態
    // 使用 set 而不是 stop().then(() => set()) 以立即重設
    apertureControls.set("hidden");
    backgroundControls.set("hidden");
    diceControls.set("hidden");
    lottieControls.set("hidden");
    amountControls.set("hidden");

    // 短暫延遲確保重設完成 (如果 set 是同步的，可能不需要)
    setTimeout(() => {
      startSequence();
    }, 50); // 保持這個延遲以防萬一
  }, [
    resetSequence,
    startSequence,
    apertureControls,
    backgroundControls,
    diceControls,
    lottieControls,
    amountControls,
  ]);

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
          {shouldShowApertureAndBackground && (
            <motion.div
              className="top-150 absolute left-0 right-0 bottom-0 w-full h-full"
              style={{ zIndex: 1 }}
              // 移除這裡的 initial/animate/variants，因為由 img 控制
            >
              <motion.img
                src={apertureSrc}
                alt="光圈效果"
                className="w-550 h-550 object-cover mx-auto"
                initial="hidden" // 初始狀態
                animate={apertureControls} // 由控制器驅動
                variants={apertureVariants} // 使用定義好的變體
                aria-hidden="true" // 光圈是裝飾性元素
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 背景容器 */}
        <AnimatePresence>
          {shouldShowApertureAndBackground && (
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
                {shouldShowLottie && (
                  <motion.div
                    initial="hidden"
                    animate={lottieControls}
                    variants={lottieVariants}
                    // 將 Lottie 放在 BonusBackground 內部，調整樣式使其疊加
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <LottieOverlay
                      isVisible={true} // isVisible 由 AnimatePresence 控制
                      onAnimationComplete={undefined}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 骰子在金色骰盅內位置 */}
              <AnimatePresence>
                {shouldShowDice && (
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
                {shouldShowAmount && (
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
