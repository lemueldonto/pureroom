export interface SummaryData {
  score: number,
  scoreLabel: string,
  killingStreak: number,
  tip: string,
}

export interface ScoreRanges {
  critical: [ number, number ], // [x1, x2)
  bad: [ number, number ], // (x1, x2]
  ok: [ number, number ], // (x1, x2]
  great: [ number, number ], // (x1, x2]
}
