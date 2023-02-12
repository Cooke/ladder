// Javascript program for Elo Rating

export function calcWinProbability(
  playerRating: number,
  opponentRating: number
) {
  return (
    1.0 / (1 + Math.pow(10, (1.0 * (opponentRating - playerRating)) / 400))
  );
}

const K = 30;

export function calculateNewRating(
  player1Rating: number,
  player2Rating: number,
  player1NormScore: number
) {
  const player1WinProb = calcWinProbability(player1Rating, player2Rating);
  const player2WinProb = 1 - player1WinProb;
  const player2NormScore = 1 - player1NormScore;

  player1Rating = Math.round(
    player1Rating + K * (player1NormScore - player1WinProb)
  );
  player2Rating = Math.round(
    player2Rating + K * (player2NormScore - player2WinProb)
  );

  return {
    player1Rating,
    player2Rating,
  };
}
