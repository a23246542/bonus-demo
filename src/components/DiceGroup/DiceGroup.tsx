import { useMemo } from "react";
import Dice1 from "@/assets/dices/dice_1.png";
import Dice2 from "@/assets/dices/dice_2.png";
import Dice3 from "@/assets/dices/dice_3.png";
import Dice4 from "@/assets/dices/dice_4.png";
import Dice5 from "@/assets/dices/dice_5.png";
import Dice6 from "@/assets/dices/dice_6.png";

const diceImgs = {
  1: Dice1,
  2: Dice2,
  3: Dice3,
  4: Dice4,
  5: Dice5,
  6: Dice6,
};

const dicePositions: Record<number, string> = {
  1: "top-0 left-[2%]",
  //   2: "top-0 left-1/2 transform -translate-x-1/2",
  2: "top-0 right-0",
  3: "top-23 right-[20%]",
};

type DiceNumber = 1 | 2 | 3 | 4 | 5 | 6;

interface DiceGroupProps {
  /** 骰子點數陣列，例如 [3,2,6] */
  diceValues: DiceNumber[];
  /** 自訂類名 */
  className?: string;
}

/**
 * 骰子群組元件 - 根據傳入的點數陣列顯示骰子圖片
 */
const DiceGroup = ({ diceValues, className = "" }: DiceGroupProps) => {
  const validatedDiceValues = useMemo(() => {
    return diceValues.map((value) => {
      if (value >= 1 && value <= 6) return value as DiceNumber;
      return 1 as DiceNumber;
    });
  }, [diceValues]);

  return (
    <div
      //   className={`dice-group flex items-center justify-center gap-2 ${className}`}
      className={`dice-group w-107 h-72 ${className} relative`}
    >
      {validatedDiceValues.map((value, index) => {
        const positionClass = dicePositions[index + 1];
        return (
          <div key={index} className={`dice-item absolute ${positionClass}`}>
            <img
              src={diceImgs[value]}
              alt={`骰子點數 ${value}`}
              className={`w-43 h-48 object-cover dice-${value} ${className}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DiceGroup;
