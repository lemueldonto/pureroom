import { Component }                                                     from '@angular/core';
import { WeatherService }                                                from './services/weather.service';
import { MatSnackBar }                                                   from '@angular/material/snack-bar';
import { combineLatest, filter, interval, map, of, switchMap, throttle } from 'rxjs';
import { NotifierService }                                               from './services/notifier.service';

@Component({
             selector:    'app-root',
             templateUrl: './app.component.html',
             styleUrls:   [ './app.component.css' ],
           })
export class AppComponent {
  readonly title = 'Pure Room';

  constructor(private weatherService: WeatherService,
              private notifierService: NotifierService) {

    this.weatherService.criticalCO2Level$.pipe(switchMap(co2Critical => {
      return this.weatherService.weatherData$
                 .pipe(map(data => data.co2),
                       filter(co2 => co2 >= co2Critical),
                       throttle(() => interval(15000)));
    })).subscribe(co2 => {
      this.notifierService.notify();
    });

  }

}
