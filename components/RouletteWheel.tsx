'use client';

import { useEffect, useState } from 'react';
import { ROULETTE_NUMBERS } from '@/lib/types';
import { getNumberColor } from '@/lib/game-utils';

interface RouletteWheelProps {
  isSpinning: boolean;
  winningNumber: number | null;
  onSpinComplete?: () => void;
}

export function RouletteWheel({ isSpinning, winningNumber, onSpinComplete }: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);

  useEffect(() => {
    if (isSpinning && winningNumber !== null) {
      const numberIndex = ROULETTE_NUMBERS.indexOf(winningNumber);
      const anglePerNumber = 360 / ROULETTE_NUMBERS.length;
      const targetAngle = numberIndex * anglePerNumber;
      const spins = 5; // Number of full rotations
      const finalRotation = spins * 360 + targetAngle + Math.random() * 30 - 15;

      setRotation(finalRotation);
      setCurrentNumber(null);

      // Set the winning number after animation completes
      setTimeout(() => {
        setCurrentNumber(winningNumber);
        onSpinComplete?.();
      }, 4000);
    }
  }, [isSpinning, winningNumber, onSpinComplete]);

  return (
    <div className="relative w-96 h-96 mx-auto">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-8 border-zinc-800 bg-zinc-900 shadow-2xl">
        {/* Wheel sections */}
        <div
          className="absolute inset-4 rounded-full overflow-hidden transition-transform duration-[4000ms] ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {ROULETTE_NUMBERS.map((number, index) => {
            const angle = (360 / ROULETTE_NUMBERS.length) * index;
            const color = getNumberColor(number);

            return (
              <div
                key={index}
                className="absolute w-full h-full"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-44 flex items-start justify-center pt-2 text-white font-bold text-sm`}
                  style={{
                    backgroundColor: color === 'red' ? '#dc2626' : color === 'black' ? '#18181b' : '#16a34a',
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                  }}
                >
                  <span className="transform rotate-180">{number}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center shadow-inner">
          {currentNumber !== null && (
            <span className="text-white font-bold text-2xl">{currentNumber}</span>
          )}
        </div>

        {/* Ball indicator */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg z-10" />
      </div>
    </div>
  );
}
