import { Bet, BetType, GameResult, RED_NUMBERS, BLACK_NUMBERS } from './types';

export function getNumberColor(number: number): 'red' | 'black' | 'green' {
  if (number === 0) return 'green';
  if (RED_NUMBERS.includes(number)) return 'red';
  if (BLACK_NUMBERS.includes(number)) return 'black';
  return 'green';
}

export function calculatePayout(betType: BetType, amount: number): number {
  const payouts: Record<BetType, number> = {
    straight: 35, // 35 to 1
    red: 1,      // 1 to 1
    black: 1,    // 1 to 1
    even: 1,     // 1 to 1
    odd: 1,      // 1 to 1
    low: 1,      // 1 to 1 (1-18)
    high: 1,     // 1 to 1 (19-36)
    dozen1: 2,   // 2 to 1 (1-12)
    dozen2: 2,   // 2 to 1 (13-24)
    dozen3: 2,   // 2 to 1 (25-36)
    column1: 2,  // 2 to 1
    column2: 2,  // 2 to 1
    column3: 2,  // 2 to 1
  };

  return amount * payouts[betType];
}

export function isWinningBet(bet: Bet, winningNumber: number): boolean {
  switch (bet.type) {
    case 'straight':
      return bet.numbers ? bet.numbers.includes(winningNumber) : false;
    case 'red':
      return getNumberColor(winningNumber) === 'red';
    case 'black':
      return getNumberColor(winningNumber) === 'black';
    case 'even':
      return winningNumber !== 0 && winningNumber % 2 === 0;
    case 'odd':
      return winningNumber !== 0 && winningNumber % 2 === 1;
    case 'low':
      return winningNumber >= 1 && winningNumber <= 18;
    case 'high':
      return winningNumber >= 19 && winningNumber <= 36;
    case 'dozen1':
      return winningNumber >= 1 && winningNumber <= 12;
    case 'dozen2':
      return winningNumber >= 13 && winningNumber <= 24;
    case 'dozen3':
      return winningNumber >= 25 && winningNumber <= 36;
    case 'column1':
      return winningNumber > 0 && (winningNumber - 1) % 3 === 0;
    case 'column2':
      return winningNumber > 0 && (winningNumber - 2) % 3 === 0;
    case 'column3':
      return winningNumber > 0 && (winningNumber - 3) % 3 === 0;
    default:
      return false;
  }
}

export function calculateGameResult(bets: Bet[], winningNumber: number): GameResult {
  const winningBets: Bet[] = [];
  let totalWon = 0;
  let totalLost = 0;

  bets.forEach(bet => {
    if (isWinningBet(bet, winningNumber)) {
      const winAmount = calculatePayout(bet.type, bet.amount);
      winningBets.push({
        ...bet,
        payout: winAmount
      });
      totalWon += winAmount;
    } else {
      totalLost += bet.amount;
    }
  });

  return {
    winningNumber,
    winningBets,
    totalWon,
    totalLost
  };
}

export function generateRandomNumber(): number {
  return Math.floor(Math.random() * 37); // 0-36
}
