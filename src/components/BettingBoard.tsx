'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BetType, Bet, RED_NUMBERS } from '@/lib/types';
import { calculatePayout } from '@/lib/game-utils';

interface BettingBoardProps {
  balance: number;
  onPlaceBet: (bet: Bet) => void;
  activeBets: Bet[];
  disabled: boolean;
}

export function BettingBoard({ balance, onPlaceBet, activeBets, disabled }: BettingBoardProps) {
  const [selectedChip, setSelectedChip] = useState(10);
  const chipValues = [1, 5, 10, 25, 50, 100];

  const placeBet = (type: BetType, numbers?: number[]) => {
    if (selectedChip > balance || disabled) return;

    const bet: Bet = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount: selectedChip,
      numbers,
      payout: calculatePayout(type, selectedChip)
    };

    onPlaceBet(bet);
  };

  const getTotalBetAmount = (type: BetType, numbers?: number[]): number => {
    return activeBets
      .filter(bet =>
        bet.type === type &&
        (!numbers || JSON.stringify(bet.numbers) === JSON.stringify(numbers))
      )
      .reduce((sum, bet) => sum + bet.amount, 0);
  };

  return (
    <Card className="p-6 bg-zinc-950 border-zinc-800">
      <div className="space-y-6">
        {/* Chip selector */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-zinc-400 text-sm font-medium">Выберите фишку:</span>
          <div className="flex gap-2">
            {chipValues.map((value) => (
              <button
                key={value}
                onClick={() => setSelectedChip(value)}
                disabled={value > balance}
                className={`w-12 h-12 rounded-full border-2 font-bold text-sm transition-all ${
                  selectedChip === value
                    ? 'bg-white text-black border-white scale-110'
                    : value > balance
                    ? 'bg-zinc-800 text-zinc-600 border-zinc-700 cursor-not-allowed'
                    : 'bg-zinc-800 text-white border-zinc-600 hover:bg-zinc-700'
                }`}
              >
                ${value}
              </button>
            ))}
          </div>
        </div>

        {/* Number grid */}
        <div className="space-y-4">
          <div className="text-zinc-400 text-sm font-medium mb-2">Числа:</div>
          <div className="grid grid-cols-12 gap-1">
            <div className="col-span-1">
              <button
                onClick={() => placeBet('straight', [0])}
                disabled={disabled}
                className="relative w-full aspect-square bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded transition-colors"
              >
                0
                {getTotalBetAmount('straight', [0]) > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-white text-black text-xs">
                    ${getTotalBetAmount('straight', [0])}
                  </Badge>
                )}
              </button>
            </div>
            {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => {
              const isRed = RED_NUMBERS.includes(num);
              const betAmount = getTotalBetAmount('straight', [num]);
              return (
                <button
                  key={num}
                  onClick={() => placeBet('straight', [num])}
                  disabled={disabled}
                  className={`relative aspect-square ${
                    isRed ? 'bg-red-600 hover:bg-red-500' : 'bg-zinc-900 hover:bg-zinc-800'
                  } disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded transition-colors border border-zinc-700`}
                >
                  {num}
                  {betAmount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-white text-black text-xs">
                      ${betAmount}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Outside bets */}
        <div className="space-y-3">
          <div className="text-zinc-400 text-sm font-medium">Внешние ставки:</div>

          {/* Even money bets */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { type: 'red' as BetType, label: 'Красное', className: 'bg-red-600 hover:bg-red-500' },
              { type: 'black' as BetType, label: 'Черное', className: 'bg-zinc-900 hover:bg-zinc-800' },
              { type: 'even' as BetType, label: 'Четное', className: 'bg-zinc-800 hover:bg-zinc-700' },
              { type: 'odd' as BetType, label: 'Нечетное', className: 'bg-zinc-800 hover:bg-zinc-700' },
              { type: 'low' as BetType, label: '1-18', className: 'bg-zinc-800 hover:bg-zinc-700' },
              { type: 'high' as BetType, label: '19-36', className: 'bg-zinc-800 hover:bg-zinc-700' },
            ].map(({ type, label, className }) => {
              const betAmount = getTotalBetAmount(type);
              return (
                <button
                  key={type}
                  onClick={() => placeBet(type)}
                  disabled={disabled}
                  className={`relative p-3 ${className} disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded transition-colors border border-zinc-700`}
                >
                  {label}
                  {betAmount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-white text-black text-xs">
                      ${betAmount}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>

          {/* Dozens */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { type: 'dozen1' as BetType, label: '1-я дюжина' },
              { type: 'dozen2' as BetType, label: '2-я дюжина' },
              { type: 'dozen3' as BetType, label: '3-я дюжина' },
            ].map(({ type, label }) => {
              const betAmount = getTotalBetAmount(type);
              return (
                <button
                  key={type}
                  onClick={() => placeBet(type)}
                  disabled={disabled}
                  className="relative p-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded transition-colors border border-zinc-700"
                >
                  {label}
                  {betAmount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-white text-black text-xs">
                      ${betAmount}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>

          {/* Columns */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { type: 'column1' as BetType, label: 'Колонка 1' },
              { type: 'column2' as BetType, label: 'Колонка 2' },
              { type: 'column3' as BetType, label: 'Колонка 3' },
            ].map(({ type, label }) => {
              const betAmount = getTotalBetAmount(type);
              return (
                <button
                  key={type}
                  onClick={() => placeBet(type)}
                  disabled={disabled}
                  className="relative p-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded transition-colors border border-zinc-700"
                >
                  {label}
                  {betAmount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-white text-black text-xs">
                      ${betAmount}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Total bet display */}
        <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
          <span className="text-zinc-400">Общая ставка:</span>
          <span className="text-white font-bold text-xl">
            ${activeBets.reduce((sum, bet) => sum + bet.amount, 0)}
          </span>
        </div>
      </div>
    </Card>
  );
}
