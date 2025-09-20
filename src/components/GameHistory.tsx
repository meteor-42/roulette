'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GameHistory as GameHistoryType } from '@/lib/types';
import { getNumberColor } from '@/lib/game-utils';

interface GameHistoryProps {
  history: GameHistoryType[];
}

export function GameHistory({ history }: GameHistoryProps) {
  const recentNumbers = history.slice(0, 10).map(h => h.winningNumber);

  return (
    <Card className="p-6 bg-zinc-950 border-zinc-800">
      <h3 className="text-lg font-semibold text-white mb-4">История игр</h3>

      {/* Recent numbers */}
      <div className="mb-6">
        <p className="text-sm text-zinc-400 mb-2">Последние числа:</p>
        <div className="flex gap-2 flex-wrap">
          {recentNumbers.length > 0 ? (
            recentNumbers.map((number, index) => {
              const color = getNumberColor(number);
              return (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    color === 'red' ? 'bg-red-600' :
                    color === 'black' ? 'bg-zinc-900' :
                    'bg-green-600'
                  }`}
                >
                  {number}
                </div>
              );
            })
          ) : (
            <span className="text-zinc-500">Нет истории</span>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-zinc-400">Статистика последних 10 игр:</h4>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-900 rounded p-3">
            <p className="text-xs text-zinc-500 mb-1">Красные</p>
            <p className="text-lg font-bold text-red-500">
              {recentNumbers.filter(n => getNumberColor(n) === 'red').length}
            </p>
          </div>

          <div className="bg-zinc-900 rounded p-3">
            <p className="text-xs text-zinc-500 mb-1">Черные</p>
            <p className="text-lg font-bold text-white">
              {recentNumbers.filter(n => getNumberColor(n) === 'black').length}
            </p>
          </div>

          <div className="bg-zinc-900 rounded p-3">
            <p className="text-xs text-zinc-500 mb-1">Четные</p>
            <p className="text-lg font-bold text-blue-500">
              {recentNumbers.filter(n => n !== 0 && n % 2 === 0).length}
            </p>
          </div>

          <div className="bg-zinc-900 rounded p-3">
            <p className="text-xs text-zinc-500 mb-1">Нечетные</p>
            <p className="text-lg font-bold text-purple-500">
              {recentNumbers.filter(n => n % 2 === 1).length}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed history */}
      {history.length > 0 && (
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-medium text-zinc-400">Последние результаты:</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.slice(0, 5).map((game) => (
              <div key={game.id} className="bg-zinc-900 rounded p-3 text-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                        getNumberColor(game.winningNumber) === 'red' ? 'bg-red-600' :
                        getNumberColor(game.winningNumber) === 'black' ? 'bg-zinc-900 border border-zinc-700' :
                        'bg-green-600'
                      }`}
                    >
                      {game.winningNumber}
                    </div>
                    <span className="text-zinc-400">
                      {new Date(game.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {game.totalWon > 0 && (
                      <Badge variant="default" className="bg-green-600 text-white">
                        +${game.totalWon}
                      </Badge>
                    )}
                    {game.totalLost > 0 && (
                      <Badge variant="default" className="bg-red-600 text-white">
                        -${game.totalLost}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
