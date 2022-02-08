import { Injectable }                                                      from '@angular/core';
import { combineLatest, map, Observable, ReplaySubject, take, tap, timer } from 'rxjs';
import {
    FlatWeatherTimeSeries,
    SeriesPoint, MeasureTypes, WeatherData,
    WeatherTimeSeries,
}                                                                          from '@interfaces/weather.interfaces';
import { HttpClient }                                                      from '@angular/common/http';
import { environment as env }                                              from '@env';

abstract class AbstractFetcher<T> {
    public abstract get data$(): Observable<T>;
}

class ScoreFetcher implements AbstractFetcher<SeriesPoint[]> {
    private _data = new ReplaySubject<SeriesPoint[]>(1);

    private static readonly clamp = (x: number): number => Math.max(0, Math.min(10, x));


    constructor(private url: string,
                private http: HttpClient,
                private timeout = 5 * 60 * 1000) {

        timer(0, timeout)
            .subscribe(() => {
                this._fetchData()
                    .pipe(map(scores => scores.map(({ value, time }) => ( {
                        value: ScoreFetcher.clamp(value / 10.),
                        time:  time * 1000,
                    } ))))
                    .subscribe(data => this._data.next(data));
            });
    }

    public get data$(): Observable<SeriesPoint[]> {
        return this._data.asObservable();
    }

    private _fetchData(): Observable<SeriesPoint[]> {
        return this.http.get<SeriesPoint[]>(this.url)
                   .pipe(take(1));
    }
}

class InfluxDBFetcher implements AbstractFetcher<SeriesPoint[]> {
    private _data = new ReplaySubject<SeriesPoint[]>(1);

    constructor(private baseurl: string,
                private measure: MeasureTypes,
                private http: HttpClient,
                private timeout = 5 * 60 * 1000) {

        timer(0, timeout)
            .subscribe(() => {
                this._fetchData(measure)
                    .subscribe(data => this._data.next(data));
            });
    }

    public get data$(): Observable<SeriesPoint[]> {
        return this._data.asObservable();
    }

    private _fetchData(measurement: MeasureTypes): Observable<SeriesPoint[]> {
        return this.http.get<SeriesPoint[]>(this.baseurl + measurement)
                   .pipe(take(1));
    }
}

class OpenhabFetcher implements AbstractFetcher<number> {
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

    public get data$(): Observable<number> {
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

    // Influx
    readonly influx_baseurl = 'http://localhost:8080/weather/';
    private _temperatureTimeSeriesFetcher$ = new InfluxDBFetcher(this.influx_baseurl, 'temperature', this.http);
    private _humidityTimeSeriesFetcher$ = new InfluxDBFetcher(this.influx_baseurl, 'humidity', this.http);
    private _co2TimeSeriesFetcher$ = new InfluxDBFetcher(this.influx_baseurl, 'co2', this.http);

    // Openhab
    readonly openhab_baseurl = 'https://openhab.ubiquarium.fr/rest/items/';
    private _temperatureDataFetcher$ = new OpenhabFetcher(this.openhab_baseurl + 'MultiSensor02_Temperature', this.http);
    private _humidityDataFetcher$ = new OpenhabFetcher(this.openhab_baseurl + 'IndoorNetatmo02_Humidity', this.http);
    private _co2DataFetcher$ = new OpenhabFetcher(this.openhab_baseurl + 'IndoorNetatmo02_Co2', this.http);

    readonly lastDay = 86400;
    readonly period = 864000;
    private _scoreTimeSeriesFetcher$ = new ScoreFetcher(`${ env.scoreUrl }/score?period=${ this.period }`, this.http);

    constructor(private http: HttpClient) { }

    /*
     *
     * Data
     *
     */
    get temperatureData$(): Observable<number> {
        return this._temperatureDataFetcher$.data$;
    }

    get co2Data$(): Observable<number> {
        return this._co2DataFetcher$.data$;
    }

    get humidityData$(): Observable<number> {
        return this._humidityDataFetcher$.data$;
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
    get temperatureTimeSeriesFetcher$(): Observable<SeriesPoint[]> {
        return this._temperatureTimeSeriesFetcher$.data$;
    }

    get humidityTimeSeriesFetcher$(): Observable<SeriesPoint[]> {
        return this._humidityTimeSeriesFetcher$.data$;
    }

    get co2TimeSeriesFetcher$(): Observable<SeriesPoint[]> {
        return this._co2TimeSeriesFetcher$.data$;
    }

    get scoreTimeSeriesFetcher$(): Observable<SeriesPoint[]> {
        return this._scoreTimeSeriesFetcher$.data$;
    }

    get weatherTimeseries$(): Observable<WeatherTimeSeries> {
        return combineLatest([
                                 this.temperatureTimeSeriesFetcher$,
                                 this.co2TimeSeriesFetcher$,
                                 this.humidityTimeSeriesFetcher$,
                                 this.scoreTimeSeriesFetcher$,
                             ])
            .pipe(map(([ temperature, co2, humidity, scores ]) => ( { temperature, co2, humidity, scores } )));
    }

    public static flatTimeSeries(data: WeatherTimeSeries): FlatWeatherTimeSeries {
        const addLabel = (label: MeasureTypes) => (d: SeriesPoint) => ( { ...d, label } );
        const co2 = data.co2.map(addLabel('co2'));
        const tem = data.temperature.map(addLabel('temperature'));
        const hum = data.humidity.map(addLabel('humidity'));
        const scr = data.scores.map(addLabel('scores'));

        return [ ...tem, ...hum, ...co2, ...scr ];
    }
}
