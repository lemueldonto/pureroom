import { Injectable }                     from '@angular/core';
import { ReportService }                  from '@services/report.service';
import { map, Observable, ReplaySubject } from 'rxjs';
import { SeriesPoint, WeatherData }       from '@interfaces/weather.interfaces';

@Injectable({
    providedIn: 'root',
})
export class SimulationService {


    constructor(private reportService: ReportService) {
    }

    public simulate(data: WeatherData): Observable<SeriesPoint> {
        return this.reportService
            .score$
            .pipe(map(s => s));

    }

}
