import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  motion,
  useAnimationControls,
  Variants,
  AnimationControls,
  AnimatePresence,
} from "framer-motion";
import BonusBackground from "./BonusBackground";
import LottieOverlay, { LottieControlsRef } from "./LottieOverlay";
import DiceGroup from "./DiceGroup";
import AmountDisplay from "./AmountDisplay";
import jackpotBg from "../assets/JACKPOT.jpg";
import apertureSrc from "../assets/aperture.png"; // 直接引入光圈圖片
import { useAnimationSequence } from "../hooks/useAnimationSequence";
import ProjectileAnimation from "./ProjectileAnimation"; // 從新檔案匯入
import CountUp from "./CountUp";

// 動畫元件類型定義
type ComponentType =
  | "aperture"
  | "background"
  | "dice"
  | "lottie"
  | "amount"
  | "projectile";

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
  // hidden: { opacity: 0, y: 20 },
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    // y: 0,
    // transition: { duration: 0.1, ease: "easeOut" },
  },
};

const projectileVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
// 主要容器動畫變體
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: { duration: 0.8, ease: "easeInOut" },
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
  const projectileControls = useAnimationControls(); // 新增拋物線動畫控制器

  // 控制整個容器的顯示狀態
  const [showContainer, setShowContainer] = useState(false);

  // 控制 CountUp 動畫的啟動狀態
  const [startCountUp, setStartCountUp] = useState(false);

  // 使用 useRef 存儲 CountUp 完成回調，避免不必要的重新渲染
  const countUpCompleteRef = useRef<(() => void) | null>(null);

  // 內部管理 Lottie ref
  const lottieRef = useRef<LottieControlsRef>(null);

  // 建立控制器映射
  const controlsMap = useMemo<Record<ComponentType, AnimationControls>>(
    () => ({
      aperture: apertureControls,
      background: backgroundControls,
      dice: diceControls,
      lottie: lottieControls,
      amount: amountControls,
      projectile: projectileControls,
    }),
    [
      apertureControls,
      backgroundControls,
      diceControls,
      lottieControls,
      amountControls,
      projectileControls,
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
      timeout: 900000, // 增加逾時時間，確保有足夠時間讓 CountUp 完成
      execute: async (controls: Record<ComponentType, AnimationControls>) => {
        try {
          // 先顯示金額容器
          await controls.amount.start("visible");
          console.log("金額動畫已啟動");

          // 使用 Promise 來等待 CountUp 完成
          await new Promise<void>((resolve) => {
            // 將解析 Promise 的函式存儲到 ref 中
            countUpCompleteRef.current = () => {
              console.log("CountUp 動畫執行完畢 (在 Promise 內)");
              resolve();
            };

            // 延遲一小段時間再啟動 CountUp 動畫
            // setTimeout(() => {
            setStartCountUp(true);
            console.log("CountUp 動畫開始啟動");
            // }, 300);
          });

          console.log("金額階段完全結束，準備進入下一階段");
        } catch (err) {
          console.error("金額動畫啟動失敗:", err);
          throw err;
        }
      },
    },
    // {
    //   id: "Lottie階段",
    //   timeout: 1500,
    //   execute: async (controls: Record<ComponentType, AnimationControls>) => {
    //     try {
    //       await controls.lottie.start("visible");
    //       console.log("Lottie動畫已啟動");

    //       // 在這裡手動播放 Lottie 動畫
    //       if (lottieRef.current) {
    //         lottieRef.current.play();
    //       }
    //     } catch (err) {
    //       console.error("Lottie動畫啟動失敗:", err);
    //       throw err;
    //     }
    //   },
    // },
    {
      id: "拋物線粒子階段",
      timeout: 3000,
      execute: async (controls: Record<ComponentType, AnimationControls>) => {
        try {
          // await controls.projectile.start("visible");
          await controls.projectile.start({
            opacity: 1,
            // transition: { duration: 3 },
          });
          console.log("拋物線粒子動畫已啟動");

          // 等待拋物線動畫完成
          await new Promise((resolve) => setTimeout(resolve, 1500));
        } catch (err) {
          console.error("拋物線粒子動畫啟動失敗:", err);
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
    shouldShowComponent, // 雖然不用於條件渲染，仍保留以供日誌記錄和偵錯
  } = useAnimationSequence<ComponentType>(animationStages, controlsMap);

  // 當動畫完成後，設定計時器在 3 秒後隱藏容器
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        // setShowContainer(false);
        console.log("動畫容器淡出中...");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  // 處理觸發按鈕點擊
  const handleTrigger = useCallback((): void => {
    console.log({
      ...apertureControls,
      // mount: apertureControls.mount(),
    });

    resetSequence(); // 先重置所有動畫狀態
    setShowContainer(true); // 顯示容器
    setStartCountUp(false); // 重置 CountUp 狀態

    // 使用小延遲確保重置完成
    setTimeout(() => {
      startSequence(); // 開始動畫序列
    }, 50);
  }, [resetSequence, startSequence, apertureControls]);

  // 手動控制 Lottie 動畫的函式
  const playLottie = useCallback(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, []);

  const pauseLottie = useCallback(() => {
    if (lottieRef.current) {
      lottieRef.current.pause();
    }
  }, []);

  const stopLottie = useCallback(() => {
    if (lottieRef.current) {
      lottieRef.current.stop();
    }
  }, []);

  const seekLottie = useCallback((frame: number) => {
    if (lottieRef.current) {
      lottieRef.current.seek(frame);
    }
  }, []);

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

      {/* 使用 AnimatePresence 包裹主要動畫容器，處理出場動畫 */}
      <AnimatePresence>
        {showContainer && (
          <motion.div
            className="container absolute top-0 left-0 right-0 bottom-0 outline outline-1 outline-red-600"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* 光圈效果 */}
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

            {/* 背景容器 */}
            <motion.div
              className="absolute w-285 h-382 top-250 left-0 right-0 bottom-0 mx-auto"
              style={{ position: "relative", zIndex: 2 }}
              initial="hidden"
              animate={backgroundControls}
              variants={backgroundVariants}
            >
              <BonusBackground className="absolute top-0 left-0 right-0 mx-auto" />

              {/* Lottie 動畫 */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial="hidden"
                animate={lottieControls}
                variants={lottieVariants}
              >
                <LottieOverlay
                  ref={lottieRef}
                  isVisible={true}
                  onAnimationComplete={() => console.log("Lottie 動畫播放完成")}
                />
              </motion.div>

              {/* 拋物線粒子 */}
              <motion.div
                className="absolute inset-0"
                // initial="hidden"
                // animate={projectileControls}
                // variants={{
                //   hidden: { opacity: 1 },
                //   visible: { opacity: 1 },
                // }}
              >
                <ProjectileAnimation
                  id="projectile-1"
                  v0={10}
                  angle={45}
                  color="gold"
                  startX={120}
                  startY={220}
                  size={16}
                  controls={projectileControls}
                  onComplete={(id) => console.log(`粒子 ${id} 完成動畫`)}
                />
                <ProjectileAnimation
                  id="projectile-2"
                  v0={8}
                  angle={60}
                  color="#ff9933"
                  startX={140}
                  startY={220}
                  size={14}
                  controls={projectileControls}
                  onComplete={(id) => console.log(`粒子 ${id} 完成動畫`)}
                />
                <ProjectileAnimation
                  id="projectile-3"
                  v0={12}
                  angle={30}
                  color="#ffcc33"
                  startX={160}
                  startY={220}
                  size={12}
                  controls={projectileControls}
                  onComplete={(id) => console.log(`粒子 ${id} 完成動畫`)}
                />
                <ProjectileAnimation
                  id="projectile-4"
                  v0={10}
                  angle={120}
                  color="gold"
                  startX={120}
                  startY={220}
                  size={16}
                  controls={projectileControls}
                  onComplete={(id) => console.log(`粒子 ${id} 完成動畫`)}
                />
                <ProjectileAnimation
                  id="projectile-5"
                  v0={8}
                  angle={140}
                  color="#ff9933"
                  startX={140}
                  startY={220}
                  size={14}
                  controls={projectileControls}
                  onComplete={(id) => console.log(`粒子 ${id} 完成動畫`)}
                />
                <ProjectileAnimation
                  id="projectile-6"
                  v0={12}
                  angle={160}
                  color="#ffcc33"
                  startX={160}
                  startY={220}
                  size={12}
                  controls={projectileControls}
                  onComplete={(id) => console.log(`粒子 ${id} 完成動畫`)}
                />
              </motion.div>

              {/* 骰子 */}
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

              {/* 金額 */}
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
                <CountUp
                  to={9999}
                  // to={100}
                  duration={4}
                  separator=","
                  startWhen={startCountUp}
                  className="text-[#FBF04C] font-roboto text-[30px] font-black leading-[32px] text-right"
                  onStart={() => console.log("CountUp 動畫開始執行")}
                  onEnd={() => {
                    console.log("CountUp 動畫執行完畢");
                    // 使用 ref 存儲的回調函式
                    if (countUpCompleteRef.current) {
                      countUpCompleteRef.current();
                      // 執行後清除引用
                      countUpCompleteRef.current = null;
                    }
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lottie 控制按鈕 */}
      <div className="absolute bottom-40 left-0 right-0 mx-auto flex justify-center gap-2">
        <button
          onClick={playLottie}
          className="text-xs px-2 py-1 bg-blue-500 text-white rounded"
        >
          播放
        </button>
        <button
          onClick={pauseLottie}
          className="text-xs px-2 py-1 bg-yellow-500 text-white rounded"
        >
          暫停
        </button>
        <button
          onClick={stopLottie}
          className="text-xs px-2 py-1 bg-red-500 text-white rounded"
        >
          停止
        </button>
        <button
          onClick={() => seekLottie(30)}
          className="text-xs px-2 py-1 bg-green-500 text-white rounded"
        >
          跳至30幀
        </button>
      </div>

      {/* 動畫完成後顯示重設按鈕 */}
      {isComplete && showContainer && (
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
