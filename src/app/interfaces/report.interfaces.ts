export interface SummaryData {
  score: number,
  killingStreak: number,
}

export interface ScoreRanges {
  critical: [ number, number ], // [x1, x2)
  bad: [ number, number ], // (x1, x2]
  ok: [ number, number ], // (x1, x2]
  great: [ number, number ], // (x1, x2]
}
