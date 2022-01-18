import { Injectable }                                            from '@angular/core';
import { interval, Observable, ReplaySubject, switchMap, timer } from 'rxjs';
import { WeatherMockData, WeatherStationData }                   from '../interfaces/weather.interfaces';
import { randomBoxMuller }                                       from '../libraries/commons.lib';
import { HttpClient }                                            from '@angular/common/http';

@Injectable({
              providedIn: 'root',
            })
export class WeatherService {

  private _weatherData = new ReplaySubject<WeatherMockData>(1);

  readonly WEATHER_STATION_URL = 'http://openhab.ubiquarium.fr/rest/items/gAirQuality';
  private _weatherStationData = new ReplaySubject<WeatherStationData>(1);

  // TODO delete me
  private genFakeData = (): WeatherMockData => {
    return {
      temperature: randomBoxMuller({ mean: 20, variance: 3, min: 0 }),
      humidity:    randomBoxMuller({ mean: 67, variance: 5, min: 0 }),
      co2:         randomBoxMuller({ mean: 460, variance: 50, min: 100 }),
      cov:         randomBoxMuller({ mean: 6, variance: 3, min: 0 }),
      airQuality:  randomBoxMuller({ mean: 70, variance: 3, min: 0, max: 100 }),
    };
  };

  constructor(private http: HttpClient) {
    timer(0, 1000).subscribe(() => {
      this._weatherData.next(this.genFakeData());
    });

    timer(0, 15000)
      .pipe(switchMap(() => this.http.get(this.WEATHER_STATION_URL)))
      .subscribe(res => {
        console.dir(res, { depth: null, colors: true });
      });
  }

  get weatherData$(): Observable<WeatherMockData> {
    return this._weatherData.asObservable();
  }

}
