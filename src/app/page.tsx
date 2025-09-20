'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RouletteWheel } from '@/components/RouletteWheel';
import { BettingBoard } from '@/components/BettingBoard';
import { GameHistory } from '@/components/GameHistory';
import { Bet, GameHistory as GameHistoryType, ROULETTE_NUMBERS } from '@/lib/types';
import { calculateGameResult } from '@/lib/game-utils';

export default function Home() {
  const [balance, setBalance] = useState(1000);
  const [activeBets, setActiveBets] = useState<Bet[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistoryType[]>([]);
  const [lastResult, setLastResult] = useState<{ won: number; lost: number } | null>(null);

  const spinWheel = () => {
    if (activeBets.length === 0) return;

    const totalBet = activeBets.reduce((sum, bet) => sum + bet.amount, 0);
    if (totalBet > balance) return;

    setIsSpinning(true);
    setLastResult(null);

    // Generate random winning number
    const randomIndex = Math.floor(Math.random() * ROULETTE_NUMBERS.length);
    const winning = ROULETTE_NUMBERS[randomIndex];
    setWinningNumber(winning);

    // Deduct bets from balance immediately
    setBalance(prev => prev - totalBet);
  };

  const handleSpinComplete = () => {
    if (winningNumber === null) return;

    const result = calculateGameResult(activeBets, winningNumber);

    // Update balance with winnings
    if (result.totalWon > 0) {
      setBalance(prev => prev + result.totalWon);
    }

    // Add to history
    const historyEntry: GameHistoryType = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      winningNumber,
      bets: activeBets,
      totalWon: result.totalWon,
      totalLost: result.totalLost
    };

    setGameHistory(prev => [historyEntry, ...prev].slice(0, 100));
    setLastResult({ won: result.totalWon, lost: result.totalLost });

    // Reset for next game
    setActiveBets([]);
    setIsSpinning(false);
    setWinningNumber(null);
  };

  const handlePlaceBet = (bet: Bet) => {
    const totalCurrentBets = activeBets.reduce((sum, b) => sum + b.amount, 0);
    if (totalCurrentBets + bet.amount > balance) return;

    setActiveBets(prev => [...prev, bet]);
  };

  const clearBets = () => {
    if (!isSpinning) {
      setActiveBets([]);
    }
  };

  const addFunds = () => {
    setBalance(prev => prev + 500);
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Казино Рулетка</h1>
          <Badge variant="secondary" className="mt-2 bg-zinc-800 text-zinc-300">
            Без реальных денег
          </Badge>
        </div>

        {/* Balance and Controls */}
        <Card className="mb-6 p-4 bg-zinc-950 border-zinc-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-zinc-400">Баланс</p>
                <p className="text-2xl font-bold text-white">${balance}</p>
              </div>
              {balance < 100 && (
                <Button
                  onClick={addFunds}
                  variant="outline"
                  className="bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800"
                >
                  Занять у Казино $500
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={clearBets}
                variant="outline"
                disabled={isSpinning || activeBets.length === 0}
                className="bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800"
              >
                Очистить ставки
              </Button>
              <Button
                onClick={spinWheel}
                disabled={isSpinning || activeBets.length === 0}
                className={`bg-white text-black hover:bg-zinc-200 ${isSpinning ? 'opacity-0' : 'opacity-100'} transition-all`}
              >
                {isSpinning ? 'Вращение...' : 'Крутить'}
              </Button>
            </div>
          </div>

          {/* Result display */}
          <div className="mt-4 flex gap-2 min-h-[40px]">
            {lastResult?.won > 0 && (
              <Badge className="bg-green-600 text-white">
                Выигрыш: +${lastResult.won}
              </Badge>
            )}
            {lastResult?.lost > 0 && (
              <Badge className="bg-red-600 text-white">
                Проигрыш: -${lastResult.lost}
              </Badge>
            )}
          </div>
        </Card>

        {/* Main game area */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Roulette Wheel */}
            <Card className="p-6 bg-zinc-950 border-zinc-800">
              <RouletteWheel
                isSpinning={isSpinning}
                winningNumber={winningNumber}
                onSpinComplete={handleSpinComplete}
              />
            </Card>

            {/* Game History */}
            <GameHistory history={gameHistory} />
          </div>

          {/* Betting Board */}
          <div>
            <Tabs defaultValue="bets" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-900">
                <TabsTrigger value="bets" className="data-[state=active]:bg-zinc-800">
                  Ставки
                </TabsTrigger>
                <TabsTrigger value="rules" className="data-[state=active]:bg-zinc-800">
                  Правила
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bets">
                <BettingBoard
                  balance={balance}
                  onPlaceBet={handlePlaceBet}
                  activeBets={activeBets}
                  disabled={isSpinning}
                />
              </TabsContent>

              <TabsContent value="rules">
                <Card className="p-6 bg-zinc-950 border-zinc-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Правила игры</h3>
                  <div className="space-y-4 text-sm text-zinc-400">
                    <div>
                      <h4 className="font-medium text-white mb-1">Типы ставок и выплаты:</h4>
                      <ul className="space-y-1 ml-4">
                        <li>• Прямая ставка (одно число): 35:1</li>
                        <li>• Красное/Черное: 1:1</li>
                        <li>• Четное/Нечетное: 1:1</li>
                        <li>• 1-18/19-36: 1:1</li>
                        <li>• Дюжина (1-12, 13-24, 25-36): 2:1</li>
                        <li>• Колонка: 2:1</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-white mb-1">Как играть:</h4>
                      <ol className="space-y-1 ml-4">
                        <li>1. Выберите размер фишки</li>
                        <li>2. Разместите ставки на доске</li>
                        <li>3. Нажмите "Крутить" для запуска рулетки</li>
                        <li>4. Дождитесь результата</li>
                        <li>5. Выигрыши автоматически добавляются к балансу</li>
                      </ol>
                    </div>

                    <div className="p-3 bg-zinc-900 rounded">
                      <p className="text-xs text-zinc-500">
                        Это демо-версия игры без реальных денег.
                        Используется только для развлечения.
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
