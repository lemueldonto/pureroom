import { Injectable }                                 from '@angular/core';
import { interval, Observable, ReplaySubject, timer } from 'rxjs';
import { WeatherData }                                from '../interfaces/weather.interfaces';
import { randomBoxMuller }                            from '../libraries/commons.lib';

@Injectable({
              providedIn: 'root',
            })
export class WeatherService {

  private _weatherData = new ReplaySubject<WeatherData>(1);

  // TODO delete me
  private genFakeData = (): WeatherData => {
    return {
      temperature: randomBoxMuller({ mean: 20, variance: 3, min: 0 }),
      humidity:    randomBoxMuller({ mean: 67, variance: 5, min: 0 }),
      co2:         randomBoxMuller({ mean: 460, variance: 10, min: 100 }),
      cov:         randomBoxMuller({ mean: 6, variance: 3, min: 0 }),
      airQuality:  randomBoxMuller({ mean: 70, variance: 3, min: 0, max: 100 }),
    };
  };

  constructor() {
    timer(0, 1000).subscribe(() => {
      this._weatherData.next(this.genFakeData());
    });
  }

  get weatherData$(): Observable<WeatherData> {
    return this._weatherData.asObservable();
  }

}
