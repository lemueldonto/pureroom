import { Injectable }                     from '@angular/core';
import { ReportService }                  from '@services/report.service';
import { map, Observable, ReplaySubject } from 'rxjs';
import { SeriesPoint, WeatherData }       from '@interfaces/weather.interfaces';
import { HttpClient, HttpParams }         from '@angular/common/http';
import { environment as env }             from '@env';

@Injectable({
    providedIn: 'root',
})
export class SimulationService {

    private static readonly SIMULATION_URL = env.scoreUrl + '/score/calculate';

    constructor(private http: HttpClient) { }

    public simulate({ temperature, co2, humidity }: WeatherData): Observable<SeriesPoint> {
        const params = new HttpParams().appendAll({ temperature, co2, humidity });
        return this.http.get<SeriesPoint>(SimulationService.SIMULATION_URL, { params });
    }

}
