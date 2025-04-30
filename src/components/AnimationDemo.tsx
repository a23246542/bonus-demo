import React, { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import AnimationTriggerButton from "./AnimationTriggerButton";
import ApertureEffect from "./ApertureEffect";
import BonusBackground from "./BonusBackground";
import LottieOverlay from "./LottieOverlay";
import DiceGroup from "./DiceGroup";
import AmountDisplay from "./AmountDisplay";
import jackpotBg from "../assets/JACKPOT.jpg"; // 引入背景圖片

/**
 * 動畫階段列舉
 */
enum AnimationStage {
  IDLE = "idle",
  BACKGROUND = "background", // 改名為 BACKGROUND，同時顯示光圈和背景
  DICE = "dice",
  LOTTIE = "lottie",
  AMOUNT = "amount",
  COMPLETE = "complete",
}

/**
 * AnimationDemo: 整合多層動畫的主要元件，使用狀態管理控制動畫序列
 */
const AnimationDemo: React.FC = () => {
  // 動畫階段狀態
  const [stage, setStage] = useState<AnimationStage>(AnimationStage.IDLE);
  // 是否已經偵測到狀態變更的除錯狀態
  const [stageChangeDetected, setStageChangeDetected] = useState<{
    [key: string]: boolean;
  }>({});

  // 追蹤狀態變化
  useEffect(() => {
    if (stage !== AnimationStage.IDLE) {
      console.log(`動畫階段變更: ${stage}`);
    }
  }, [stage]);

  // 是否處於播放中狀態
  const isPlaying =
    stage !== AnimationStage.IDLE && stage !== AnimationStage.COMPLETE;

  // 各元件顯示狀態檢查，修改為光圈和背景同時出現
  const shouldShowApertureAndBackground = stage !== AnimationStage.IDLE;
  const shouldShowDice =
    stage !== AnimationStage.IDLE && stage !== AnimationStage.BACKGROUND;
  const shouldShowLottie =
    stage === AnimationStage.LOTTIE ||
    stage === AnimationStage.AMOUNT ||
    stage === AnimationStage.COMPLETE;
  const shouldShowAmount =
    stage === AnimationStage.AMOUNT || stage === AnimationStage.COMPLETE;

  // 處理觸發按鈕點擊
  const handleTrigger = useCallback((): void => {
    // 重設動畫階段，直接進入 BACKGROUND 階段
    setStage(AnimationStage.BACKGROUND);
    // 重設階段變更偵測狀態
    setStageChangeDetected({});
  }, []);

  // 添加安全機制，確保即使回調未觸發，動畫也能繼續進行
  useEffect(() => {
    if (!isPlaying) return;

    // 用於每個階段的計時器，如果階段停滯過久，強制進入下一階段
    const stageTimeouts = {
      [AnimationStage.BACKGROUND]: 500, // 背景和光圈共用一個階段
      [AnimationStage.DICE]: 700,
      [AnimationStage.LOTTIE]: 1000,
      [AnimationStage.AMOUNT]: 800,
    };

    // 如果當前階段有設置超時時間且未曾偵測到變化
    if (stageTimeouts[stage] && !stageChangeDetected[stage]) {
      const timer = setTimeout(() => {
        // 記錄已經處理過這個階段
        setStageChangeDetected((prev) => ({ ...prev, [stage]: true }));

        // 根據當前階段決定下一個階段
        switch (stage) {
          case AnimationStage.BACKGROUND:
            setStage(AnimationStage.DICE);
            break;
          case AnimationStage.DICE:
            setStage(AnimationStage.LOTTIE);
            break;
          case AnimationStage.LOTTIE:
            setStage(AnimationStage.AMOUNT);
            break;
          case AnimationStage.AMOUNT:
            setStage(AnimationStage.COMPLETE);
            break;
        }
      }, stageTimeouts[stage]);

      return () => clearTimeout(timer);
    }
  }, [stage, isPlaying, stageChangeDetected]);

  // 背景和光圈動畫完成處理
  const handleBackgroundComplete = useCallback(() => {
    if (stage === AnimationStage.BACKGROUND) {
      setStage(AnimationStage.DICE);
      setStageChangeDetected((prev) => ({
        ...prev,
        [AnimationStage.BACKGROUND]: true,
      }));
    }
  }, [stage]);

  // 骰子動畫完成處理
  const handleDiceComplete = useCallback(() => {
    if (stage === AnimationStage.DICE) {
      setStage(AnimationStage.LOTTIE);
      setStageChangeDetected((prev) => ({
        ...prev,
        [AnimationStage.DICE]: true,
      }));
    }
  }, [stage]);

  // Lottie動畫完成處理
  const handleLottieComplete = useCallback(() => {
    if (stage === AnimationStage.LOTTIE) {
      setStage(AnimationStage.AMOUNT);
      setStageChangeDetected((prev) => ({
        ...prev,
        [AnimationStage.LOTTIE]: true,
      }));
    }
  }, [stage]);

  // 金額顯示動畫完成處理
  const handleAmountComplete = useCallback(() => {
    if (stage === AnimationStage.AMOUNT) {
      setStage(AnimationStage.COMPLETE);
      setStageChangeDetected((prev) => ({
        ...prev,
        [AnimationStage.AMOUNT]: true,
      }));
    }
  }, [stage]);

  const appStyle = {
    backgroundImage: `url(${jackpotBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div
      className="AnimationDemo w-full max-w-[390px] mx-auto h-[844px] overflow-hidden  relative"
      style={appStyle}
      // style={{
      //   position: "relative",
      //   width: "100%",
      //   maxWidth: 400,
      //   margin: "2rem auto",
      //   textAlign: "center",
      // }}
    >
      {/* <AnimationTriggerButton onClick={handleTrigger} disabled={isPlaying} cla /> */}
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

      {/* 主要動畫容器，確保元件層級正確 */}
      {
        <div className="container absolute top-0 left-0 right-0 bottom-0 outline outline-1 outline-red-600">
          {/* 光圈效果 - 放在最底層 */}
          <div
            className="top-150"
            style={{
              position: "absolute",
              // top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
              zIndex: 1, // 確保光圈在最底層
            }}
          >
            <ApertureEffect
              isVisible={shouldShowApertureAndBackground}
              onAnimationComplete={undefined}
            />
          </div>

          {/* 背景容器 */}
          <div
            className="absolute w-285 h-382 top-250 left-0 right-0 bottom-0 mx-auto"
            style={{ position: "relative", zIndex: 2 }}
          >
            <BonusBackground
              className="absolute top-0 left-0 right-0  mx-auto"
              isVisible={shouldShowApertureAndBackground}
              onAnimationComplete={handleBackgroundComplete}
            />

            {/* Lottie 動畫僅在骰子顯示後播放 */}
            <LottieOverlay
              isVisible={shouldShowLottie}
              onAnimationComplete={handleLottieComplete}
            />

            {/* 骰子與金額顯示 - 絕對定位於特定位置 */}
            {/* 骰子在金色骰盅內位置 */}
            <div
              className="DiceGroup absolute top-122 left-0 right-0  mx-auto"
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <DiceGroup
                isVisible={shouldShowDice}
                onAnimationComplete={handleDiceComplete}
              />
            </div>

            {/* 金幣數字在紫色背景區塊 */}
            <div
              className="absolute top-245 left-0 right-0  mx-auto"
              style={{
                // marginTop: "3%", // 金幣與骰子間距
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <AmountDisplay
                isVisible={shouldShowAmount}
                onAnimationComplete={handleAmountComplete}
              />
            </div>
          </div>
        </div>
        // document.body
      }
    </div>
  );
};

export default AnimationDemo;
