import React, { useState, useCallback } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LottieOverlayProps {
  isVisible: boolean;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

const LOTTIE_URL =
  "https://lottie.host/03c77dbb-2ad6-4143-8ce6-4f2db003e207/JubKD5Ylvk.lottie";

/** Lottie 疊加動畫，僅播放一次並處理載入錯誤 */
const LottieOverlay: React.FC<LottieOverlayProps> = ({
  isVisible,
  onAnimationStart,
  onAnimationComplete,
}) => {
  const [hasError, setHasError] = useState(false);

  const handleAnimationStart = useCallback(() => {
    if (onAnimationStart) {
      onAnimationStart();
    }
  }, [onAnimationStart]);

  const handleAnimationComplete = useCallback(() => {
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  }, [onAnimationComplete]);

  if (!isVisible) return null;
  if (hasError) {
    return <div style={{ color: "red" }}>動畫載入失敗</div>;
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
      onLoad={handleAnimationStart}
      // onComplete={handleAnimationComplete}
      onError={() => setHasError(true)}
    />
  );
};

export default LottieOverlay;
