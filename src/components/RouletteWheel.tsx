'use client';

import { useState, useEffect } from 'react';

interface RouletteWheelProps {
  isSpinning: boolean;
  winningNumber: number | null;
  onSpinComplete?: () => void;
}

export function RouletteWheel({ isSpinning, winningNumber, onSpinComplete }: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [previousNumber, setPreviousNumber] = useState<number | null>(null);

  // Конфигурация рулетки (европейская версия с одним зеро)
  const numbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
    5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ];

  useEffect(() => {
    if (isSpinning && winningNumber !== null) {
      const spins = 8; // Количество полных оборотов
      
      // Сохраняем предыдущий результат перед началом вращения
      if (currentNumber !== null) {
        setPreviousNumber(currentNumber);
      }
      
      // Скрываем текущее число во время вращения
      setCurrentNumber(null);

      // Находим позицию выигрышного числа в массиве
      const winningIndex = numbers.indexOf(winningNumber);
      // Вычисляем угол для выигрышного числа (каждое число занимает ~9.73 градуса)
      const anglePerNumber = 360 / numbers.length;
      const targetAngle = (360 * spins) + (winningIndex * anglePerNumber);

      setRotation(prev => prev % 360); // Нормализуем текущее вращение

      // Плавный старт с последующим замедлением
      setTimeout(() => {
        setRotation(prev => prev + targetAngle);
        
        // Устанавливаем выигрышное число после завершения анимации
        setTimeout(() => {
          setCurrentNumber(winningNumber);
          setPreviousNumber(winningNumber);
          onSpinComplete?.();
        }, 6000); // Соответствует длительности анимации
      }, 100);
    }
  }, [isSpinning, winningNumber, onSpinComplete]);

  // Функция для определения цвета фона в зависимости от числа
  const getBackgroundColor = (number: number | null) => {
    if (number === 0) return 'bg-green-600'; // Зеленый для 0
    
    // Красные числа в европейской рулетке
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    
    if (number !== null && redNumbers.includes(number)) {
      return 'bg-red-600'; // Красный для красных чисел
    }
    
    return 'bg-black'; // Черный для остальных чисел
  };

  // Создаем градиент для всех секторов
  const createWheelGradient = () => {
    const anglePerNumber = 360 / numbers.length;
    let gradientString = '';
    
    numbers.forEach((number, index) => {
      const startAngle = index * anglePerNumber;
      const endAngle = (index + 1) * anglePerNumber;
      
      const color = number === 0 
        ? '#15803d' // зеленый для 0
        : [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(number)
          ? '#dc2626' // красный
          : '#000000'; // черный
      
      gradientString += `${color} ${startAngle}deg ${endAngle}deg, `;
    });
    
    return gradientString.slice(0, -2); // Убираем последнюю запятую и пробел
  };

  return (
    <div className="relative mx-auto select-none" style={{ width: 'min(28rem, 90vw)', height: 'min(28rem, 90vw)' }}>
      {/* Ободок колеса */}
      <div className="absolute inset-0 rounded-full border-8 border-amber-600 bg-gradient-to-br from-amber-700 to-amber-800 shadow-xl">
        <div className="absolute inset-2 rounded-full border-4 border-zinc-800 bg-zinc-900 overflow-hidden">
          
          {/* Колесо рулетки */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(${createWheelGradient()})`,
              transition: 'transform 6000ms cubic-bezier(0.17, 0.67, 0.21, 0.99)', // Плавное затухание
            }}
          >
            {/* Внутренний контур */}
            <div className="absolute inset-0 rounded-full border border-zinc-700/30" />
            
            {/* Разделительные линии между числами */}
            {numbers.map((_, index) => {
              const angle = (360 / numbers.length) * index;
              return (
                <div
                  key={index}
                  className="absolute top-0 left-1/2 w-px h-1/2 bg-white/30 origin-bottom"
                  style={{
                    transform: `rotate(${angle}deg)`,
                  }}
                />
              );
            })}
          </div>

          {/* Центр с результатом - показываем только предыдущий результат */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex items-center justify-center z-10 bg-zinc-800 border-4 border-amber-600">
            {previousNumber !== null && (
              <div
                className={`w-20 h-20 flex items-center justify-center rounded-full ${getBackgroundColor(previousNumber)} text-white`}
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  fontWeight: '900',
                }}
              >
                <div className="text-3xl">
                  {previousNumber}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Индикатор сверху */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20"
        style={{ top: '-4px' }}
      >
        <div
          className="bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-amber-800"
          style={{
            width: '20px',
            height: '20px',
            transform: 'rotate(45deg)',
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7))',
          }}
        />
      </div>
    </div>
  );
}