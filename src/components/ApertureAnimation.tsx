import React, { useState, useCallback, useEffect } from "react";
import { motion, useAnimationControls, Variants } from "framer-motion";
import apertureSrc from "../assets/aperture.png";

/**
 * 單獨測試光圈動畫的元件
 * 用於偵錯光圈動畫效果問題
 */
const ApertureAnimation: React.FC = () => {
  // 光圈動畫控制器
  const apertureControls = useAnimationControls();
  // 動畫狀態
  const [isPlaying, setIsPlaying] = useState(false);
  // 顯示狀態
  const [isVisible, setIsVisible] = useState(false);
  // 載入狀態
  const [isLoaded, setIsLoaded] = useState(false);
  // 旋轉狀態
  const [isRotating, setIsRotating] = useState(false);

  // 光圈動畫變體
  const apertureVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { duration: 0.4, ease: "easeOut" },
        scale: { duration: 0.4, ease: "easeOut" },
      },
    },
  };

  // 元件載入時初始化控制器
  useEffect(() => {
    apertureControls.set("hidden");
    setIsLoaded(true);

    // 記錄到控制台，檢查元件載入狀態
    console.log("ApertureAnimation 元件已載入，控制器已初始化");

    // 清理函式
    return () => {
      console.log("ApertureAnimation 元件已卸載");
      setIsRotating(false);
    };
  }, [apertureControls]);

  // 播放光圈動畫
  const playAnimation = useCallback(async () => {
    if (isPlaying) return;

    try {
      setIsPlaying(true);
      setIsVisible(true);
      console.log("開始播放光圈動畫...");

      // 使用 Promise 來等待動畫啟動
      await new Promise<void>((resolve) => {
        // 延遲確保 DOM 已更新
        setTimeout(async () => {
          try {
            // 嘗試啟動動畫
            await apertureControls.start("visible");
            console.log("光圈動畫 'visible' 已啟動");

            // 啟動旋轉
            setIsRotating(true);
            console.log("光圈旋轉已啟動");

            resolve();
          } catch (error) {
            console.error("光圈動畫啟動失敗:", error);
            resolve();
          }
        }, 50);
      });

      // 等待動畫完成
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch (error) {
      console.error("動畫執行期間發生錯誤:", error);
    } finally {
      setIsPlaying(false);
    }
  }, [apertureControls, isPlaying]);

  // 重設動畫
  const resetAnimation = useCallback(() => {
    setIsVisible(false);
    setIsRotating(false);
    apertureControls.set("hidden");
    console.log("光圈動畫已重設");
  }, [apertureControls]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-lg mb-4">光圈動畫測試</h2>

      {/* 載入狀態顯示 */}
      {!isLoaded && <p>載入中...</p>}

      {/* 光圈動畫容器 */}
      <div className="relative bg-blue-50 p-8 rounded-lg w-full max-w-xs h-60 flex items-center justify-center overflow-hidden">
        {isVisible && (
          <motion.div
            initial="hidden"
            animate={apertureControls}
            variants={apertureVariants}
            className="z-10"
            onAnimationStart={() => console.log("光圈淡入動畫開始")}
            onAnimationComplete={() => console.log("光圈淡入動畫完成")}
          >
            <motion.img
              src={apertureSrc}
              alt="光圈效果"
              className="w-60 h-60 object-cover"
              animate={{
                rotate: isRotating ? 360 : 0,
              }}
              transition={{
                rotate: {
                  duration: 8,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "loop",
                },
              }}
              aria-hidden="true"
            />
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
        <p>旋轉狀態: {isRotating ? "旋轉中" : "停止"}</p>
        <p>元件載入: {isLoaded ? "已載入" : "載入中"}</p>
        <p className="text-xs mt-2">提示: 請檢查瀏覽器控制台的記錄訊息</p>
      </div>
    </div>
  );
};

export default ApertureAnimation;
