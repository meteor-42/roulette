'use client';

import { useEffect, useMemo, useState } from 'react';
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

  const anglePerNumber = 360 / ROULETTE_NUMBERS.length;

  // Color scheme that matches the betting board exactly
  const getSegmentColor = (num: number) => {
    const color = getNumberColor(num);
    if (color === 'red') return '#dc2626'; // red-600 exactly matching betting board
    if (color === 'black') return '#18181b'; // zinc-900 exactly matching betting board
    return '#16a34a'; // green-600 for zero
  };

  // Build wheel background with precise colors
  const wheelBackground = useMemo(() => {
    const segments: string[] = [];
    for (let i = 0; i < ROULETTE_NUMBERS.length; i++) {
      const start = i * anglePerNumber;
      const end = (i + 1) * anglePerNumber;
      const color = getSegmentColor(ROULETTE_NUMBERS[i]);
      segments.push(`${color} ${start}deg ${end}deg`);
    }
    return `conic-gradient(from -90deg, ${segments.join(', ')})`;
  }, [anglePerNumber]);

  useEffect(() => {
    if (isSpinning && winningNumber !== null) {
      const numberIndex = ROULETTE_NUMBERS.indexOf(winningNumber);
      const centerAngle = numberIndex * anglePerNumber + anglePerNumber / 2;
      const spins = 5;

      setRotation((prev) => {
        const currentMod = ((prev % 360) + 360) % 360;
        const desiredMod = ((360 - centerAngle) % 360 + 360) % 360;
        const delta = ((desiredMod - currentMod) + 360) % 360;
        return prev + spins * 360 + delta;
      });
      setCurrentNumber(null);

      const timer = setTimeout(() => {
        setCurrentNumber(winningNumber);
        onSpinComplete?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isSpinning, winningNumber, onSpinComplete, anglePerNumber]);

  return (
    <div className="relative mx-auto select-none" style={{ width: 'min(28rem, 90vw)', height: 'min(28rem, 90vw)' }}>
      {/* Outer premium bezel with gold accent */}
      <div className="absolute inset-0 rounded-full border-8 border-amber-600 bg-gradient-to-br from-amber-700 to-amber-800 shadow-2xl">
        <div className="absolute inset-2 rounded-full border-4 border-zinc-800 bg-zinc-950">

          {/* Spinning wheel with colors */}
          <div
            className="absolute inset-3 rounded-full transition-transform duration-[4000ms] ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              background: wheelBackground
            }}
          >
            {/* Subtle inner border */}
            <div className="absolute inset-0 rounded-full border border-zinc-700/30" />
          </div>

          {/* Static number labels (non-rotating, positioned around wheel) */}
          <div className="absolute inset-0">
            {ROULETTE_NUMBERS.map((num, index) => {
              const angle = (index * anglePerNumber - 90) * (Math.PI / 180); // Convert to radians, offset by -90deg
              const radius = 160; // Distance from center
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <div
                  key={num}
                  className="absolute text-white font-bold text-xl"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    textShadow: '0 0 8px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.8)',
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    fontWeight: '800',
                    letterSpacing: '-0.05em'
                  }}
                >
                  {num}
                </div>
              );
            })}
          </div>

          {/* Center hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border-4 border-amber-600 flex items-center justify-center shadow-inner">
            {currentNumber !== null && (
              <div className="text-center">
                <div
                  className={`text-3xl font-bold mb-1 ${
                    getNumberColor(currentNumber) === 'red' ? 'text-red-500' :
                    getNumberColor(currentNumber) === 'black' ? 'text-white' :
                    'text-green-400'
                  }`}
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    fontWeight: '900'
                  }}
                >
                  {currentNumber}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top pointer - elegant diamond shape */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20"
        style={{ top: '-4px' }}
      >
        <div
          className="bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-amber-800"
          style={{
            width: '16px',
            height: '16px',
            transform: 'rotate(45deg)',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))'
          }}
        />
      </div>
    </div>
  );
}
