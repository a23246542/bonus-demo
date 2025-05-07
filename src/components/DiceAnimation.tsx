import React, { useState, useCallback, useEffect } from "react";
import { motion, useAnimationControls, Variants } from "framer-motion";
import DiceGroup from "./DiceGroup";

/**
 * 單獨測試骰子動畫的元件
 * 用於偵錯 diceControls 動畫問題
 */
const DiceAnimation: React.FC = () => {
  // 骰子動畫控制器
  const diceControls = useAnimationControls();
  // 動畫狀態
  const [isPlaying, setIsPlaying] = useState(false);
  // 顯示狀態
  const [isVisible, setIsVisible] = useState(false);
  // 載入狀態
  const [isLoaded, setIsLoaded] = useState(false);

  // 骰子動畫變體
  const diceVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
    bounce: {
      opacity: 1,
      y: [0, -10, 0],
      scale: 1,
      transition: {
        y: { repeat: 3, duration: 0.5, ease: "easeInOut" },
        opacity: { duration: 0.3 },
      },
    },
  };

  // 元件載入時初始化控制器
  useEffect(() => {
    diceControls.set("hidden");
    setIsLoaded(true);

    // 記錄到控制台，檢查元件載入狀態
    console.log("DiceAnimation 元件已載入，控制器已初始化");

    // 清理函式
    return () => {
      console.log("DiceAnimation 元件已卸載");
    };
  }, [diceControls]);

  // 播放骰子動畫
  const playAnimation = useCallback(async () => {
    if (isPlaying) return;

    try {
      setIsPlaying(true);
      setIsVisible(true);
      console.log("開始播放骰子動畫...");

      // 使用 Promise 來等待動畫啟動
      await new Promise<void>((resolve) => {
        // 延遲確保 DOM 已更新
        setTimeout(async () => {
          try {
            // 嘗試啟動動畫
            await diceControls.start("visible");
            console.log("骰子動畫 'visible' 已啟動");
            resolve();
          } catch (error) {
            console.error("骰子動畫啟動失敗:", error);
            resolve();
          }
        }, 50);
      });

      // 等待動畫完成
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 播放彈跳效果
      await diceControls.start("bounce");
      console.log("骰子動畫 'bounce' 已啟動");
    } catch (error) {
      console.error("動畫執行期間發生錯誤:", error);
    } finally {
      setIsPlaying(false);
    }
  }, [diceControls, isPlaying]);

  // 重設動畫
  const resetAnimation = useCallback(() => {
    setIsVisible(false);
    diceControls.set("hidden");
    console.log("骰子動畫已重設");
  }, [diceControls]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl mb-4">骰子動畫測試</h2>

      {/* 載入狀態顯示 */}
      {!isLoaded && <p>載入中...</p>}

      {/* 骰子動畫容器 */}
      <div className="relative bg-amber-50 p-8 rounded-lg w-full max-w-xs h-40 flex items-center justify-center">
        {isVisible && (
          <motion.div
            initial="hidden"
            animate={diceControls}
            variants={diceVariants}
            className="z-10"
            onAnimationStart={() => console.log("骰子動畫開始")}
            onAnimationComplete={() => console.log("骰子動畫完成")}
          >
            <DiceGroup diceValues={[1, 1, 1]} />
          </motion.div>
        )}
      </div>

      {/* 控制按鈕 */}
      <div className="mt-6 space-x-4">
        <button
          onClick={playAnimation}
          disabled={isPlaying}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          {isPlaying ? "播放中..." : "播放動畫"}
        </button>

        <button
          onClick={resetAnimation}
          disabled={isPlaying}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300"
        >
          重設動畫
        </button>
      </div>

      {/* 偵錯資訊 */}
      <div className="mt-4 text-left w-full max-w-xs text-sm bg-gray-200 p-2 rounded">
        <p>控制器狀態: {isPlaying ? "播放中" : "閒置"}</p>
        <p>顯示狀態: {isVisible ? "顯示" : "隱藏"}</p>
        <p>元件載入: {isLoaded ? "已載入" : "載入中"}</p>
        <p className="text-xs mt-2">提示: 請檢查瀏覽器控制台的記錄訊息</p>
      </div>
    </div>
  );
};

export default DiceAnimation;
