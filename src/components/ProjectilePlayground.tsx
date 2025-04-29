import React, { useRef, useState, useEffect, useCallback } from "react";

// ...既有 imports...

// 重力（m/s²）、比例尺（1 m = 10 px）、球半徑（px）
const g = 9.8;
const scale = 10;
const radius = 8;

interface Position {
  x: number;
  y: number;
}

const projectilePos = (v0: number, angleDeg: number, t: number): Position => {
  const rad = (angleDeg * Math.PI) / 180;
  const vx = v0 * Math.cos(rad);
  const vy = v0 * Math.sin(rad);
  return { x: vx * t, y: vy * t - 0.5 * g * t * t };
};

const ProjectilePlayground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [initialVelocity, setInitialVelocity] = useState<number>(20);
  const [angle, setAngle] = useState<number>(45);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // 清除動畫幀
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // 初速度24 拋射角50剛好
  const shoot = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    startTimeRef.current = performance.now();

    const step = (now: number) => {
      const t = (now - (startTimeRef.current as number)) / 250;
      const { x, y } = projectilePos(initialVelocity, angle, t);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = x * scale;
      const cy = canvas.height - y * scale;

      // 如果球掉出畫布，結束動畫
      if (cy - radius > canvas.height) return;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = "tomato";
      ctx.fill();
      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
  }, [initialVelocity, angle]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        className="projectile-canvas"
      />
      <div className="controls">
        <label>
          初速度 v₀ (m/s)
          <div>
            <input
              type="range"
              min={5}
              max={40}
              step={1}
              value={initialVelocity}
              onChange={(e) => setInitialVelocity(Number(e.target.value))}
            />
            <output>{initialVelocity}</output>
          </div>
        </label>
        <label>
          拋射角 θ (°)
          <div>
            <input
              type="range"
              min={10}
              max={80}
              step={1}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
            />
            <output>{angle}</output>
          </div>
        </label>
        <button onClick={shoot}>發射！</button>
      </div>
    </div>
  );
};

export default ProjectilePlayground;
