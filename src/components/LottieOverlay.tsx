import React, {
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// 定義控制器方法的介面
export interface LottieControlsRef {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (frame: number) => void;
}

interface LottieOverlayProps {
  isVisible: boolean;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

const LOTTIE_URL =
  "https://lottie.host/03c77dbb-2ad6-4143-8ce6-4f2db003e207/JubKD5Ylvk.lottie";

/** Lottie 疊加動畫，僅播放一次並處理載入錯誤 */
const LottieOverlay = forwardRef<LottieControlsRef, LottieOverlayProps>(
  ({ isVisible, onAnimationStart, onAnimationComplete }, ref) => {
    const [hasError, setHasError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [dotLottieInstance, setDotLottieInstance] = useState<any>(null);

    // 將控制方法暴露給父元件
    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          if (dotLottieInstance) {
            dotLottieInstance.play();
          }
        },
        pause: () => {
          if (dotLottieInstance) {
            dotLottieInstance.pause();
          }
        },
        stop: () => {
          if (dotLottieInstance) {
            dotLottieInstance.stop();
          }
        },
        seek: (frame: number) => {
          if (dotLottieInstance) {
            dotLottieInstance.setFrame(frame);
          }
        },
      }),
      [dotLottieInstance]
    );

    // 當獲取到 dotLottie 實例時的回調函式
    const dotLottieRefCallback = useCallback((lottieInstance: unknown) => {
      if (lottieInstance) {
        setDotLottieInstance(lottieInstance);
      }
    }, []);

    const handleAnimationStart = useCallback(() => {
      if (onAnimationStart) {
        onAnimationStart();
      }
    }, [onAnimationStart]);

    // 使用 useEffect 監聽載入事件並模擬動畫完成事件
    useEffect(() => {
      if (isLoaded && onAnimationComplete) {
        // 預設 lottie 動畫約 1000-2000ms，這裡模擬動畫結束事件
        const timer = setTimeout(() => {
          onAnimationComplete();
        }, 1500);

        return () => clearTimeout(timer);
      }
    }, [isLoaded, onAnimationComplete]);

    // 處理動畫載入錯誤的顯示
    if (!isVisible) return null;
    if (hasError) {
      return (
        <div
          style={{
            color: "red",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "12px",
            background: "rgba(0,0,0,0.7)",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          動畫載入失敗
        </div>
      );
    }

    return (
      <DotLottieReact
        src={LOTTIE_URL}
        autoplay
        loop={false}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          maxWidth: 400,
          pointerEvents: "none",
        }}
        onLoad={() => {
          setIsLoaded(true);
          handleAnimationStart();
        }}
        onError={() => setHasError(true)}
        dotLottieRefCallback={dotLottieRefCallback}
      />
    );
  }
);

export default LottieOverlay;
