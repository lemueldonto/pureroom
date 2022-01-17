import { Component }                                  from '@angular/core';
import { WeatherService }                             from './services/weather.service';
import { MatSnackBar }                                from '@angular/material/snack-bar';
import { combineLatest, interval, map, of, throttle } from 'rxjs';

@Component({
             selector:    'app-root',
             templateUrl: './app.component.html',
             styleUrls:   [ './app.component.css' ],
           })
export class AppComponent {
  readonly title = 'Pure Room';

  constructor(private weatherService: WeatherService,
              private snackBar: MatSnackBar) {
    const co2Critical$ = of(460);
    const co2Data$ = weatherService.weatherData$
                                   .pipe(throttle(() => interval(60 * 1000)),
                                         map(data => data.co2));

    combineLatest([ co2Data$, co2Critical$ ])
      .subscribe(([ co2, co2Critical ]) => {
        if (co2 > co2Critical) {
          this.snackBar.open('Critical CO2 Level!', 'Ignore');
        } else {
          this.snackBar.dismiss();
        }
      });

  }

}
