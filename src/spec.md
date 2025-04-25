我要做一個 lottie 動畫效果展示頁，動畫需求如下

1. 有個按鍵可以觸發動畫
2. 以 assets/bonus-bg 為主圖，整體出現的時候要縮放動畫出現
3. 放上 assets/dice-group 骰子圖片區塊跟 assets/金額金額圖片區塊
4. aperture 光圈圖片要在 bonus-bg 後面旋轉
5. 使用 dotLottie 載入這個 lottie 動畫連結https://lottie.host/03c77dbb-2ad6-4143-8ce6-4f2db003e207/JubKD5Ylvk.lottie，在bonus-bg出現的同時，在bonus-bg上方播放一次
6. 可以用 css3 或是 famerMotion 製作動畫

### 設計需求規範 – Lottie 動畫展示頁

#### 1. 目標

建立一個互動式的 Lottie 動畫展示頁，使用 React + TypeScript + Vite，結合多重圖層與動畫效果，並確保擴展性、可維護性與相容性。

---

#### 2. 開發環境

- React + TypeScript + Vite
- @vitejs/plugin‑react 或 @vitejs/plugin‑react‑swc
- ESLint（建議採用 type‑checked 設定）
- @lottiefiles/dotlottie-react 或@lottiefiles/react-lottie-player 或 lottie-react 函式庫

---

#### 3. 功能需求

1. 觸發按鍵
   - 按鈕元件（命名：`<AnimationTriggerButton>`）
   - 點擊後開始整體動畫序列
2. 主背景圖 (`assets/bonus-bg`) 縮放出現
   - 初始透明度 0、縮放比例 0.8
   - 0.5s 內淡入至透明度 1 且縮放至 1.0
3. 骰子圖區塊 (`assets/dice-group`) ＋ 金額圖區塊 (`assets/金額`)
   - 命名：`<DiceGroup>`、`<AmountDisplay>`
   - 於背景圖出現後 0.2s 內淡入並滑入位置
4. 光圈 (aperture) 圖片
   - 放置於主背景後層
   - 持續旋轉動畫：360°／4s，無限循環
5. dotLottie 動畫
   - 載入連結：[https://lottie.host/03c77dbb-2ad6-4143-8ce6-4f2db003e207/JubKD5Ylvk.lottie](vscode-file://vscode-app/Applications/Visual%20Studio%20Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)
   - 組件命名：`<LottieOverlay>`
   - 與主背景同時觸發，在背景上方播放一次

---

#### 4. UI/UX 規格

- 響應式設計：寬度 ≥ 320px
- 動畫緩動：使用 ease‑out
- ARIA 標籤：按鈕需有 `aria-label="觸發動畫"`

---

#### 5. 資源管理與命名

- 目錄結構
  ├ assets/bonus-bg.png
  ├ assets/dice-group.png
  ├ assets/金額.png
  └ components/
  ├ AnimationTriggerButton.tsx
  ├ BonusBackground.tsx
  ├ DiceGroup.tsx
  ├ AmountDisplay.tsx
  ├ ApertureEffect.tsx
  └ LottieOverlay.tsx
- 命名規範：
  - 元件採 PascalCase
  - 變數、函式採 camelCase
  - 常數採 UPPER_SNAKE_CASE

---

#### 6. 動畫流程時序

1. 使用者點擊 `<AnimationTriggerButton>`
2. `<BonusBackground>` 縮放＋淡入 (0.5s)
3. 同時觸發 `<LottieOverlay>` 播放一次 (0.7s 內完成)
4. 0.2s 後 `<DiceGroup>`、`<AmountDisplay>` 依序滑入
5. `<ApertureEffect>` 持續旋轉（∞ 循環）

---

#### 7. 非功能需求

- 效能：動畫合併 GPU 加速
- 相容性：支援主流現代瀏覽器
- 可測試性：各元件應具備單元測試
- 可維護性：遵循 SOLID 原則、單一職責
- 錯誤處理：dotLottie 載入失敗要有 fallback 顯示

---

#### 8. 未來擴展性

- 可參數化動畫時序與時長
- 支援多種 Lottie 動畫來源
- 插件化光圈、背景、疊加動畫組件
- 可替換不同主題資源 (皮膚/樣式)

---

上述規範旨在維持程式碼品質、減少 bug 產生，並確保專案延展性與可維護性。
