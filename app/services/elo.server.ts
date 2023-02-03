// Javascript program for Elo Rating

export function calcWinProbability(
  playerRating: number,
  opponentRating: number
) {
  return (
    (1.0 * 1.0) /
    (1 + 1.0 * Math.pow(10, (1.0 * (opponentRating - playerRating)) / 400))
  );
}

const K = 30;

export function calculateNewRating(winnerRating: number, loserRating: number) {
  let probabilityWinnerWin = calcWinProbability(winnerRating, loserRating);
  let probabilityLoserWin = calcWinProbability(loserRating, winnerRating);

  winnerRating = Math.round(winnerRating + K * (1 - probabilityWinnerWin));
  loserRating = Math.round(loserRating + K * (0 - probabilityLoserWin));

  return {
    winnerRating,
    loserRating,
  };
}
