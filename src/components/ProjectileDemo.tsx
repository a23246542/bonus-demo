import React, { useState, useCallback } from "react";
import { useAnimationControls } from "framer-motion";
import ProjectileAnimation from "./ProjectileAnimation";

/**
 * 拋物線粒子動畫展示元件
 * 展示多個拋物線粒子的動畫效果
 */
const ProjectileDemo: React.FC = () => {
  // 建立動畫控制器
  const projectileControls = useAnimationControls();

  // 追蹤已完成的粒子
  const [completedProjectiles, setCompletedProjectiles] = useState<Set<string>>(
    new Set()
  );

  // 處理拋物線動畫完成的回呼函式
  const handleProjectileComplete = useCallback((id: string) => {
    console.log(`粒子 ${id} 完成動畫`);
    setCompletedProjectiles((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, []);

  // 處理開始動畫按鈕點擊
  const handleStartAnimation = useCallback(() => {
    // 重設已完成粒子集合
    setCompletedProjectiles(new Set());
    // 啟動動畫
    projectileControls.start({
      opacity: 1,
      transition: { duration: 3 },
    });
  }, [projectileControls]);

  return (
    <div className="flex flex-col items-center justify-center p-8 h-[600px] relative">
      <h3 className="text-lg mb-8">拋物線粒子動畫測試</h3>

      {/* 粒子動畫容器 */}
      <div className="w-full h-[400px] bg-gray-800 rounded-lg relative overflow-hidden">
        {/* 多個不同參數的拋物線粒子 */}
        <ProjectileAnimation
          id="projectile-1"
          v0={20}
          angle={45}
          color="gold"
          startX={100}
          startY={350}
          size={16}
          controls={projectileControls}
          onComplete={handleProjectileComplete}
        />

        <ProjectileAnimation
          id="projectile-2"
          v0={18}
          angle={60}
          color="#ff9933"
          startX={150}
          startY={350}
          size={14}
          controls={projectileControls}
          onComplete={handleProjectileComplete}
        />

        <ProjectileAnimation
          id="projectile-3"
          v0={22}
          angle={30}
          color="#ffcc33"
          startX={200}
          startY={350}
          size={12}
          controls={projectileControls}
          onComplete={handleProjectileComplete}
        />

        <ProjectileAnimation
          id="projectile-4"
          v0={25}
          angle={50}
          color="#66ccff"
          startX={250}
          startY={350}
          size={15}
          controls={projectileControls}
          onComplete={handleProjectileComplete}
        />

        <ProjectileAnimation
          id="projectile-5"
          v0={15}
          angle={70}
          color="#ff6699"
          startX={300}
          startY={350}
          size={13}
          controls={projectileControls}
          onComplete={handleProjectileComplete}
        />
      </div>

      {/* 控制按鈕 */}
      <div className="mt-6">
        <button
          onClick={handleStartAnimation}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          發射粒子
        </button>
      </div>

      {/* 狀態顯示 */}
      <div className="mt-4 text-sm">
        <p>已完成粒子: {completedProjectiles.size}/5</p>
        <div className="flex gap-2 mt-2">
          {Array.from({ length: 5 }).map((_, index) => {
            const id = `projectile-${index + 1}`;
            return (
              <div
                key={id}
                className={`w-3 h-3 rounded-full ${
                  completedProjectiles.has(id) ? "bg-green-500" : "bg-gray-400"
                }`}
                title={id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectileDemo;
