// 導入必要的依賴
import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { DotLottieReact, DotLottie } from "@lottiefiles/dotlottie-react";

// 導入型別和常數
import {
  CoinProps,
  AnimationInfo,
  DotLottieWithData,
  FrameEvent,
} from "./types";
// import { COIN_LOTTIE_SRC } from "./constants";

// 金幣 Lottie 動畫來源
export const COIN_LOTTIE_SRC =
  "https://lottie.host/33f958a6-8c38-468d-a7a1-9af036113478/fwu8M9Ifnn.lottie"; //60fps 3s
// "https://lottie.host/11822c63-d1ab-4429-bec7-a5202c212ba4/4VXbEcwOdb.lottie"; //35fps 3s
// "https://lottie.host/e2b455a7-5733-418b-8b00-e1cf9684394a/ycvPKfDZJS.lottie";
// "https://lottie.host/931236a4-1a45-4f56-9d26-27bc31fa2683/w1iJh9Vv51.json";

/**
 * 單個金幣組件
 *
 * @param resetAtSecond 指定在第幾秒重頭播放動畫 目前測試1.2秒剛好
 */
const Coin = ({ resetAtSecond: propResetAtSecond }: CoinProps) => {
  // 為每個金幣生成隨機特性，使落下效果更自然
  const style = useMemo(() => {
    const randomLeft = Math.random() * 100; // 隨機水平位置 (0-100%)
    const randomDelay = 2 + Math.random() * 2; // 隨機延遲開始 (0-5秒)
    // const randomDuration = 5 + Math.random() * 4; // 延長隨機落下時間 (5-9秒)
    const randomDuration = 4 + Math.random() * 2; // 延長隨機落下時間 (2-4秒)
    // const randomSize = 40 + Math.random() * 60; // 隨機大小 (40-100px)
    const randomRotation = Math.random() * 360; // 隨機旋轉角度 (0-360度)

    // 決定 z-index 與對應透明度（z 越小越淡出）
    const randomZIndex = Math.floor(Math.random() * 100);
    const depthOpacity = 0.6 + (randomZIndex / 100) * 0.4;

    return {
      left: `${randomLeft}%`,
      animationDelay: `${randomDelay}s`,
      animationDuration: `${randomDuration}s`,
      width: "80px",
      height: "80px",
      transform: `rotate(${randomRotation}deg)`,
      zIndex: randomZIndex,
      // opacity: depthOpacity,
    };
  }, []);

  // 使用 state 儲存 DotLottie 實例，確保在 useEffect 中能正確取得
  const [lottieInstance, setLottieInstance] = useState<DotLottie | null>(null);

  // 防止過於頻繁重置的冷卻時間標記
  const resetCooldownRef = useRef<boolean>(false);

  // 使用 useRef 存儲動畫資訊
  const animInfoRef = useRef<AnimationInfo>({
    totalFrames: 0,
    // frameRate: 35, // 預設幀率
    frameRate: 60, // 預設幀率
    duration: 0,
    resetAtSecond: 0,
    resetAtFrame: 0,
    isReady: false,
  });

  // 使用 ref 追蹤傳入的 resetAtSecond prop 值
  const resetAtSecondPropRef = useRef<number | undefined>(propResetAtSecond);

  // 更新 ref 當 prop 值變化時
  useEffect(() => {
    resetAtSecondPropRef.current = propResetAtSecond;
    // resetAtSecond 或 lottieInstance 變動時，重新計算重置點
    if (animInfoRef.current.isReady && lottieInstance) {
      calculateDuration(lottieInstance);
    }
  }, [propResetAtSecond, lottieInstance]);

  // 設定回調函數獲取 Lottie 實例
  const dotLottieRefCallback = (instance: DotLottie | null) => {
    if (instance) {
      // 儲存實例至 state
      setLottieInstance(instance);
      // 若已載入幀資訊，立即計算時長
      if (instance.totalFrames > 0) {
        calculateDuration(instance);
      }
    }
  };

  /**
   * 計算動畫時長和重置點的函式
   *
   * @param dotLottie DotLottie 實例
   * @returns 是否成功計算
   */
  const calculateDuration = (dotLottie: DotLottie): boolean => {
    console.log("calculateDuration", {
      ...dotLottie,
    });

    try {
      // 確保幀數有效
      if (!dotLottie.totalFrames || dotLottie.totalFrames <= 0) {
        console.warn("無效的幀數資訊，等待正確載入...");
        return false;
      }

      // 取得動畫總幀數和幀率
      const totalFrames = dotLottie.totalFrames;
      console.log("總幀數:", totalFrames, dotLottie.duration);
      // 安全地從擴充後的實例取得幀率
      const dotLottieWD = dotLottie as DotLottieWithData;
      const frameRate =
        dotLottieWD.animationData?.fr ?? animInfoRef.current.frameRate;

      // 計算動畫時長 (秒)
      // const duration = totalFrames / frameRate;
      const duration = dotLottie.duration;

      // 計算指定秒數對應的幀數
      // 如果有設定 resetAtSecond，則使用它，否則使用動畫時長的一半
      const resetAtSecond =
        resetAtSecondPropRef.current !== undefined
          ? resetAtSecondPropRef.current
          : duration / 2;
      const resetAtFrame = Math.floor(resetAtSecond * frameRate);

      // 存儲資訊
      animInfoRef.current = {
        ...animInfoRef.current,
        totalFrames,
        frameRate,
        duration,
        resetAtFrame,
        isReady: true,
      };

      console.log("動畫資訊:", {
        totalFrames,
        frameRate,
        duration: `${duration.toFixed(2)}秒`,
        resetAtSecond,
        resetAtFrame,
      });

      return true;
    } catch (error) {
      console.error("計算動畫時長時發生錯誤:", error);
      return false;
    }
  };

  /**
   * 重置動畫到起始位置的函式
   */
  const resetAnimation = useCallback(() => {
    // 避免過於頻繁重置，使用冷卻機制
    if (resetCooldownRef.current) {
      return;
    }

    const dotLottie = lottieInstance;
    if (dotLottie) {
      // 設置冷卻標記
      resetCooldownRef.current = true;

      // 重置動畫
      dotLottie.setFrame(0);
      dotLottie.play();

      // 100ms 後解除冷卻
      setTimeout(() => {
        resetCooldownRef.current = false;
      }, 100);
    }
  }, [lottieInstance]);

  // 監聽動畫載入完成並計算時長
  useEffect(() => {
    const dotLottie = lottieInstance;
    // console.log({
    //   animInfoRef: animInfoRef.current,
    //   dotLottie,
    // });

    if (!dotLottie) return;

    // 如果還沒準備好且資訊不完整，監聽相關事件
    if (!animInfoRef.current.isReady) {
      // 監聽動畫載入完成事件
      const onLoaded = () => {
        console.log("動畫載入完成");
        calculateDuration(dotLottie);
      };

      // 幀更新事件 - 也可以用來確認動畫已載入
      const onFrame = (event: FrameEvent) => {
        // console.log("當前幀:", event.currentFrame);
        // 只在第一幀時檢查，避免重複計算
        if (event.currentFrame === 0 && !animInfoRef.current.isReady) {
          if (dotLottie.totalFrames > 0) {
            calculateDuration(dotLottie);
            // 成功計算後可以移除此監聽器
            if (animInfoRef.current.isReady) {
              dotLottie.removeEventListener("frame", onFrame);
            }
          }
        }
      };

      // 針對不同版本的 API 嘗試不同的事件名稱
      //   dotLottie.addEventListener("loaded", onLoaded);
      dotLottie.addEventListener("load", onLoaded);
      dotLottie.addEventListener("ready", onLoaded);
      dotLottie.addEventListener("complete", onLoaded);
      dotLottie.addEventListener("frame", onFrame);

      // 保險起見，設定延遲檢查
      const timeoutId = setTimeout(() => {
        if (!animInfoRef.current.isReady && dotLottie.totalFrames > 0) {
          calculateDuration(dotLottie);
        }
      }, 300);

      return () => {
        // dotLottie.removeEventListener("loaded", onLoaded);
        dotLottie.removeEventListener("load", onLoaded);
        dotLottie.removeEventListener("ready", onLoaded);
        dotLottie.removeEventListener("complete", onLoaded);
        dotLottie.removeEventListener("frame", onFrame);
        clearTimeout(timeoutId);
      };
    }
  }, [lottieInstance]);

  // 監聽幀變化並在適當時機重置動畫
  useEffect(() => {
    const dotLottie = lottieInstance;
    if (!dotLottie) return;

    let checkInfoInterval: number | null = null;

    // 若尚未準備好，設定檢查間隔
    if (!animInfoRef.current.isReady) {
      checkInfoInterval = window.setInterval(() => {
        if (dotLottie.totalFrames > 0) {
          const result = calculateDuration(dotLottie);
          if (result && checkInfoInterval) {
            clearInterval(checkInfoInterval);
          }
        }
      }, 200);
    }

    // 幀變化事件處理函數 - 根據 Lottie 播放時間判斷重置時機
    const onFrameChange = (event: FrameEvent) => {
      const { resetAtFrame, isReady } = animInfoRef.current;
      // console.log("onFrameChange", {
      //   currentFrame: event.currentFrame,
      //   resetAtFrame,
      //   isReady,
      // });
      if (isReady && event.currentFrame >= resetAtFrame) {
        resetAnimation();
      }
    };

    // 添加事件監聽器
    lottieInstance.addEventListener("frame", onFrameChange);

    // 清理函數
    return () => {
      if (lottieInstance) {
        lottieInstance.removeEventListener("frame", onFrameChange);
      }
      if (checkInfoInterval) {
        clearInterval(checkInfoInterval);
      }
    };
  }, [lottieInstance, resetAnimation]);

  return (
    <div className="coin absolute top-[-100px] coin-animation" style={style}>
      <DotLottieReact
        src={COIN_LOTTIE_SRC}
        autoplay
        style={{ width: "100%", height: "100%" }}
        dotLottieRefCallback={dotLottieRefCallback}
      />
    </div>
  );
};

export default Coin;
