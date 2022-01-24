import { Injectable }                         from '@angular/core';
import { map, Observable, of, ReplaySubject } from 'rxjs';
import { ScoreRanges, SummaryData }           from '../interfaces/report.interfaces';

@Injectable({
              providedIn: 'root',
            })
export class ReportService {

  private _summaryData = new ReplaySubject<SummaryData>(1);

  constructor() {
      this._summaryData.next({
                             killingStreak: Math.floor(Math.random() * 7),
                             scoreLabel:    '', tip: '',
                             score:         .3 * Math.random() + .7,
                           });
  }

  get summaryData$(): Observable<SummaryData> {
    return this._summaryData.asObservable();
  }

  public scoreRanges$(): Observable<ScoreRanges> {
    return of({
                critical: [ 0., .2 ],
                bad:      [ .2, .5 ],
                ok:       [ .5, .7 ],
                great:    [ .7, 1. ],
              });
  }

  public analyzeScore(score: number, ranges: ScoreRanges): string {
    if (score >= ranges.great[0]) {
      return 'Great';
    } else if (score >= ranges.ok[0]) {
      return 'Ok';
    } else if (score >= ranges.bad[0]) {
      return 'Bad';
    } else {
      return 'Critical';
    }
  }

  public analyzeScore$(score: number): Observable<string> {
    return this.scoreRanges$().pipe(map(ranges => this.analyzeScore(score, ranges)));
  }
}
