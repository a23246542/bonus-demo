import { useState, useCallback, useEffect } from "react";
import { AnimationControls } from "framer-motion";

/**
 * 自定義動畫序列控制 Hook - 使用泛型提高彈性
 * @template T - 元件類型的字串聯合類型
 */
export function useAnimationSequence<T extends string>(
  animations: {
    id: string;
    execute: (controls: Record<T, AnimationControls>) => Promise<void>;
    timeout?: number;
  }[],
  controlsMap: Record<T, AnimationControls>
) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  // 追蹤當前已顯示的元件
  const [visibleComponents, setVisibleComponents] = useState<Set<T>>(new Set());

  // 判斷特定元件是否應該顯示
  const shouldShowComponent = useCallback(
    (component: T) => visibleComponents.has(component),
    [visibleComponents]
  );

  // 建立控制器代理，用於自動追蹤元件顯示狀態
  const createControlsProxy = useCallback(() => {
    const proxy: Record<T, AnimationControls> = {} as Record<
      T,
      AnimationControls
    >;

    (Object.keys(controlsMap) as T[]).forEach((key) => {
      const originalControl = controlsMap[key];

      // 使用代理物件攔截 start 呼叫
      proxy[key] = {
        ...originalControl,
        start: (variant: string) => {
          // 當設為 visible 時，自動加入可見元件集合
          if (variant === "visible") {
            setVisibleComponents((prev) => {
              const newSet = new Set(prev);
              newSet.add(key);
              return newSet;
            });
          }
          // 呼叫原始控制器的 start 方法
          return originalControl.start(variant);
        },
        set: (variant: string) => {
          // 當設為 hidden 時，從可見元件集合中移除
          if (variant === "hidden") {
            setVisibleComponents((prev) => {
              const newSet = new Set(prev);
              newSet.delete(key);
              return newSet;
            });
          }
          // 呼叫原始控制器的 set 方法
          originalControl.set(variant);
        },
      } as unknown as AnimationControls;
    });

    return proxy;
  }, [controlsMap]);

  // 重設所有控制器
  const resetAllControls = useCallback(() => {
    Object.entries(controlsMap).forEach(([_, control]) => {
      (control as AnimationControls).set("hidden");
    });
    setVisibleComponents(new Set());
  }, [controlsMap]);

  // 開始執行動畫序列
  const startSequence = useCallback(async () => {
    try {
      setIsPlaying(true);
      setIsComplete(false);
      setCurrentIndex(-1);
      resetAllControls();

      // 建立控制器代理
      const controlsProxy = createControlsProxy();

      for (let i = 0; i < animations.length; i++) {
        const animation = animations[i];
        console.log(`動畫階段變更: ${animation.id}`, performance.now());

        // 更新索引
        setCurrentIndex(i);

        // 加入短暫延遲，等待 DOM 更新
        // await new Promise((resolve) => setTimeout(resolve, 50));

        // 執行動畫
        const executePromise = animation.execute(controlsProxy);

        let timeoutTimer: NodeJS.Timeout | null = null;

        if (animation.timeout) {
          const timeoutPromise = new Promise<void>((resolveTimeout) => {
            timeoutTimer = setTimeout(() => {
              console.warn(`${animation.id} 逾時，自動進入下一階段`);
              resolveTimeout(); // 逾時也算完成
            }, animation.timeout);
          });

          try {
            await Promise.race([executePromise, timeoutPromise]);
          } catch (err) {
            console.error(`執行 ${animation.id} 動畫時發生錯誤:`, err);
          } finally {
            if (timeoutTimer) clearTimeout(timeoutTimer);
          }
        } else {
          try {
            await executePromise;
          } catch (err) {
            console.error(`執行 ${animation.id} 動畫時發生錯誤:`, err);
          }
        }
      }

      // await new Promise((resolve) => setTimeout(resolve, 50));
      setIsComplete(true);
    } catch (error) {
      console.error("動畫序列執行錯誤:", error);
    } finally {
      setIsPlaying(false);
    }
  }, [animations, createControlsProxy, resetAllControls]);

  // 重設動畫序列
  const resetSequence = useCallback(() => {
    setCurrentIndex(-1);
    setIsPlaying(false);
    setIsComplete(false);
    resetAllControls();
  }, [resetAllControls]);

  // 初始化控制器設定
  useEffect(() => {
    resetAllControls();
  }, [resetAllControls]);

  return {
    startSequence,
    resetSequence,
    currentIndex,
    isPlaying,
    isComplete,
    shouldShowComponent,
  };
}
