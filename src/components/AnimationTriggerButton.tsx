import React from "react";

interface AnimationTriggerButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

/** 觸發動畫的按鈕，支援 aria 標籤 */
const AnimationTriggerButton: React.FC<AnimationTriggerButtonProps> = ({
  onClick,
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label="觸發動畫"
    style={{
      padding: "0.5rem 1rem",
      marginBottom: "4rem",
      fontSize: "1rem",
      cursor: disabled ? "not-allowed" : "pointer",
      borderRadius: "4px",
    }}
  >
    開始動畫
  </button>
);

export default AnimationTriggerButton;
