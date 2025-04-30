import type { ThemeConfig } from "tailwindcss/types/config";

/** root font size to pixel */
const getPxToRem = (px: number | string, suffix: string = "rem"): string => {
  const unit = (Number(px) / 16).toFixed(4);
  return (unit.replace(/(\.0+$)/g, "") + suffix).replace(/^0rem$/, "0");
};

const theme: Partial<ThemeConfig> = {
  extend: {
    spacing: {
      // 1: 0 ~ 1000
      ...Array.from({ length: 1000 })
        .map((_, i) => i)
        .reduce((res, n) => ({ ...res, [n]: getPxToRem(n) }), {}),
      // 0.5: 0 ~ 100
      ...Array.from({ length: 200 })
        .map((_, i) => (i / 2).toFixed(1))
        .reduce((res, n) => ({ ...res, [parseFloat(n)]: getPxToRem(n) }), {}),
      // viewport height 100%
      svh: "var(--svh);",
      // viewport width 100%
      svw: "var(--svw);",
      // safe area
      "safe-top": "var(--safe-top);",
      "safe-bottom": "var(--safe-bottom);",
      "safe-left": "var(--safe-left);",
      "safe-right": "var(--safe-right);",
    },
    // 1: 0 ~ 40
    fontSize: {
      ...Array.from({ length: 40 })
        .map((_, i) => i)
        .reduce((res, n) => ({ ...res, [n]: getPxToRem(n) }), {}),
    },
    // 1 為單位: 0 ~ 40 = 0 ~ 40px
    lineHeight: {
      ...Array.from({ length: 40 })
        .map((_, i) => i)
        .reduce((res, n) => ({ ...res, [n]: getPxToRem(n) }), {}),
      0: "0",
    },
    // 0.5 為單位: 0 ~ 100 = 0 ~ 100px
    borderRadius: {
      ...Array.from({ length: 200 })
        .map((_, i) => (i * 0.5).toFixed(1))
        .reduce((res, n) => ({ ...res, [parseFloat(n)]: getPxToRem(n) }), {}),
    },
    // 0.5 為單位: 0 ~ 60 = 0 ~ 60px
    borderWidth: {
      ...Array.from({ length: 120 })
        .map((_, i) => (i * 0.5).toFixed(1))
        .reduce((res, n) => ({ ...res, [parseFloat(n)]: getPxToRem(n) }), {}),
    },
    // 10 為單位: 0 ~ 200
    zIndex: {
      ...Array.from({ length: 15 })
        .map((_, i) => (i + 1) * 10 + 50)
        .reduce((res, n) => ({ ...res, [n]: n }), {}),
    },
    transitionDuration: {
      400: "400ms",
      300: "300ms",
    },
  },
};

export default theme;
