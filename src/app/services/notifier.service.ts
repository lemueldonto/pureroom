import { Injectable }                                                                                    from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
}                                                                                                        from '@angular/common/http';
import { interval, merge, mergeAll, mergeMap, Observable, of, switchMap, switchMapTo, take, tap, timer } from 'rxjs';
import {
  MatSnackBar,
}                                                                                                        from '@angular/material/snack-bar';

import { environment as env } from '@env';

@Injectable({
              providedIn: 'root',
            })
export class NotifierService {
  private running = false;

  constructor(private http: HttpClient,
              private snackBar: MatSnackBar) { }

  changeLampState(on: boolean): Observable<any> {
    const body = on ? 'ON' : 'OFF';
    console.log('turning lamp ', body);
    const headers = new HttpHeaders().set('Content-Type', 'text/plain');
    return this.http.post(env.lampUrl, body, { headers });
  }

  public notify() {
    const duration = 5000;
    if (this.running) {
      return;
    } else {
      this.running = false;
      const snackBarRef = this.snackBar.open('Critical CO2 Level', 'Ignore', { duration });
      // const lampOn$ = this.changeLampState(true)
      //                     .pipe(switchMapTo(timer(duration)));
      //
      // merge(lampOn$, snackBarRef.afterDismissed())
      //   .pipe(take(1),
      //         switchMap(() => this.changeLampState(false)))
      //   .subscribe();
    }
  }
}
