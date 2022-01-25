import { Injectable }                         from '@angular/core';
import { map, Observable, of, ReplaySubject } from 'rxjs';
import { SummaryData }                        from '../interfaces/report.interfaces';

@Injectable({
                providedIn: 'root',
            })
export class ReportService {

    private _summaryData = new ReplaySubject<SummaryData>(1);

    constructor() {
        const clamp = (x: number) => Math.max(Math.min(x, 10), 0);
        const score = clamp(5 * Math.random() + 5);
        this._summaryData.next({
                                   killingStreak: score >= 7 ? Math.floor(Math.random() * 7) : 0,
                                   scoreLabel:    '', tip: '',
                                   score:         score,
                               });
    }

    get summaryData$(): Observable<SummaryData> {
        return this._summaryData.asObservable();
    }

    public scoreRanges$(): Observable<any> {
        return of(null);
    }

    public analyzeScore(score: number, ranges: any): string {
        if (score >= 7) {
            return 'Great';
        } else if (score >= 5) {
            return 'Ok';
        } else if (score >= 2) {
            return 'Bad';
        } else {
            return 'Critical';
        }
    }

    public analyzeScore$(score: number): Observable<string> {
        return this.scoreRanges$().pipe(map(ranges => this.analyzeScore(score, ranges)));
    }
}
