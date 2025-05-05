import React from "react";
import AnimationDemo from "./components/AnimationDemo";
import DiceAnimation from "./components/DiceAnimation";
import ApertureAnimation from "./components/ApertureAnimation";
import ProjectileDemo from "./components/ProjectileDemo"; // 引入拋物線粒子動畫展示元件
import "./App.css";

function App() {
  return (
    <div className="App">
      <AnimationDemo />

      {/* <DiceAnimation /> */}
      {/* <ApertureAnimation /> */}

      {/* 使用拋物線粒子動畫展示元件 */}
      {/* <ProjectileDemo /> */}
    </div>
  );
}

export default App;
