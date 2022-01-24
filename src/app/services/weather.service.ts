import { Injectable }                                                            from '@angular/core';
import { combineLatest, map, Observable, ReplaySubject, switchMap, take, timer } from 'rxjs';
import {
    InfluxDBData, WeatherData,
    WeatherMockData,
    WeatherTimeseries,
} from '../interfaces/weather.interfaces';
import { randomBoxMuller }                                                       from '../libraries/commons.lib';
import { HttpClient }                                                            from '@angular/common/http';

class InfluxDBFetcher {
    private _data = new ReplaySubject<InfluxDBData[]>(1);

    constructor(private baseurl: string,
                private measure: 'temperature' | 'co2' | 'humidity',
                private http: HttpClient,
                private timeout = 5 * 60 * 1000) {

        timer(0, timeout)
            .subscribe(() => {
                this._fetchData(measure)
                    .subscribe(data => this._data.next(data));
            });
    }

    public get data$(): Observable<InfluxDBData[]> {
        return this._data.asObservable();
    }

    private _fetchData(measurement: 'temperature' | 'co2' | 'humidity'): Observable<InfluxDBData[]> {
        return this.http.get<InfluxDBData[]>(this.baseurl + measurement)
                   .pipe(take(1));
    }
}

class OpenhabFetcher {
    private _data = new ReplaySubject<number>(1);

    constructor(private url: string,
                private http: HttpClient,
                private timeout = 60 * 1000) {

        timer(0, timeout)
            .subscribe(() => {
                this._fetchData(url)
                    .subscribe(data => this._data.next(data));
            });

    }

    public data$(): Observable<number> {
        return this._data.asObservable();
    }

    private _fetchData(url: string): Observable<number> {
        return this.http.get<any>(url)
                   .pipe(
                       take(1),
                       map(({ state }: { state: string }) => {
                               const matches = state.match(/\d+/) ?? [];
                               if (matches.length > 0)
                                   return parseFloat(matches[0]);
                               else
                                   throw 'Invalid format';
                           },
                       ));
    }


}

@Injectable({
                providedIn: 'root',
            })
export class WeatherService {

    private _weatherData = new ReplaySubject<WeatherMockData>(1);

    // Influx
    readonly influx_baseurl = 'http://localhost:8080/influx/';
    private _temperatureTimeSeriesFetcher$ = new InfluxDBFetcher(this.influx_baseurl, 'temperature', this.http);
    private _humidityTimeSeriesFetcher$ = new InfluxDBFetcher(this.influx_baseurl, 'humidity', this.http);
    private _co2TimeSeriesFetcher$ = new InfluxDBFetcher(this.influx_baseurl, 'co2', this.http);

    // Openhab
    readonly openhab_baseurl = 'https://openhab.ubiquarium.fr/rest/items/';
    private _temperatureDataFetcher$ = new OpenhabFetcher(this.openhab_baseurl + 'MultiSensor02_Temperature', this.http);
    private _humidityDataFetcher$ = new OpenhabFetcher(this.openhab_baseurl + 'IndoorNetatmo02_Humidity', this.http);
    private _co2DataFetcher$ = new OpenhabFetcher(this.openhab_baseurl + 'IndoorNetatmo02_Co2', this.http);

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

        this.weatherTimeseries$.subscribe(console.log);

    }


    /*
     *
     * Data
     *
     */
    get temperatureData$(): Observable<number> {
        return this._temperatureDataFetcher$.data$();
    }

    get co2Data$(): Observable<number> {
        return this._co2DataFetcher$.data$();
    }

    get humidityData$(): Observable<number> {
        return this._humidityDataFetcher$.data$();
    }

    get weatherData$(): Observable<WeatherData> {
        return combineLatest([
                                 this.temperatureData$,
                                 this.co2Data$,
                                 this.humidityData$,
                             ])
            .pipe(map(([ temperature, co2, humidity ]) => ( { temperature, co2, humidity } )));
    }

    /*
     *
     * TIME SERIES
     *
     */
    get temperatureTimeSeriesFetcher$(): Observable<InfluxDBData[]> {
        return this._temperatureTimeSeriesFetcher$.data$;
    }

    get humidityTimeSeriesFetcher$(): Observable<InfluxDBData[]> {
        return this._humidityTimeSeriesFetcher$.data$;
    }

    get co2TimeSeriesFetcher$(): Observable<InfluxDBData[]> {
        return this._co2TimeSeriesFetcher$.data$;
    }

    get weatherTimeseries$(): Observable<WeatherTimeseries> {
        return combineLatest([
                                 this.temperatureTimeSeriesFetcher$,
                                 this.co2TimeSeriesFetcher$,
                                 this.humidityTimeSeriesFetcher$,
                             ])
            .pipe(map(([ temperature, co2, humidity ]) => ( { temperature, co2, humidity } )));
    }
}
