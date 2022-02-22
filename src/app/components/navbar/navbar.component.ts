import { Component, OnInit }                                                                      from '@angular/core';
import {
    WeatherService,
}                                                                                                 from "@services/weather.service";
import {
    ReportService,
}                                                                                                 from '@services/report.service';
import { combineLatest, filter, iif, map, Observable, pairwise, ReplaySubject, startWith, switchMap, take, tap } from 'rxjs';
import {
    SeriesPoint, WeatherData,
}                                                                                                 from '@interfaces/weather.interfaces';
import { FormBuilder, FormGroup }                                                                 from '@angular/forms';
import {
    MatSlideToggleChange,
}                                                                                                 from '@angular/material/slide-toggle';
import {
    SimulationService,
}                                                                                                 from '@services/simulation.service';

function isNonNull<T>(value: T): value is NonNullable<T> {
    return value !== null;
}

import { Subscription, timer } from 'rxjs';

@Component({
    selector:    'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls:   [ './navbar.component.css' ],
})
export class NavbarComponent implements OnInit {

    public form: FormGroup;

    public weatherData: Observable<WeatherData> | undefined;

    oldWeather = {
        humidity:    0,
        co2:         0,
        temperature: 0,
    };

    actualWeather = {
        humidity:    0,
        co2:         0,
        temperature: 0,
    };


    private subscriptions: Subscription[] = [];

    public readonly scoreBuffer$: Observable<{ curr: SeriesPoint, prev: SeriesPoint | null }>;

    isSimulating$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

    _simulation$ = new ReplaySubject<SeriesPoint>(1);
    public get simulation$(): Observable<SeriesPoint> {
        return this._simulation$.asObservable();
    }

    private static sndIsNonNull<T>(tuple: [ T, T ]): tuple is [ T, NonNullable<T> ] {
        return isNonNull(tuple[ 1 ]);
    }

    constructor(public weatherService: WeatherService,
                private reportService: ReportService,
                private simulationService: SimulationService,
                private formBuilder: FormBuilder) {

        this.isSimulating$.next(false);

        this.form = formBuilder.group({
            temperature: 0,
            co2:         0,
            humidity:    0,
        });


        combineLatest([this.weatherService.weatherData$, this.isSimulating$])
            .pipe(filter(([_, isSimulating]) => isSimulating))
            .subscribe(([data, _]) => {
                this.form.setValue({
                    temperature: data.temperature,
                    humidity:    data.humidity,
                    co2:         data.co2,
                });
            });


        this.scoreBuffer$ = this.isSimulating$
            .pipe(
                tap((isSimulating) => {
                    if (isSimulating)
                        this.simulationService.simulate(this.form.value)
                            .subscribe(data => this._simulation$.next(data));
                }),
                switchMap(isSimulating => iif(() => isSimulating,
                    this.simulation$,
                    this.reportService.score$,
                )),
            )
            .pipe(startWith(null),
                pairwise(),
                filter(NavbarComponent.sndIsNonNull),
                map(([ prev, curr ]) => ( { prev, curr } )),
            );
    }

    ngOnInit(): void {
        this.weatherData = this.weatherService.weatherData$;
        this.weatherData?.subscribe(x => {
            this.oldWeather = {
                humidity:    x.humidity,
                temperature: x.temperature,
                co2:         x.co2,
            };
        });

        const sub = timer(0, 60000)
            .subscribe(() => this.loadAcutual());

        this.subscriptions.push(sub);
    }

    loadAcutual() {
        this.oldWeather = this.actualWeather;
        this.weatherData?.subscribe(x => {
            this.actualWeather = {
                humidity:    x.humidity,
                temperature: x.temperature,
                co2:         x.co2,
            };
        });
        console.log(this.oldWeather);
        console.log(this.actualWeather);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    public scoreChangeClasses(prev: SeriesPoint | null, curr: SeriesPoint): string {
        if (prev === null)
            return '';

        return `${ curr.value > prev.value ? 'text-success' : 'text-error' } text-sm font-weight-bolder`;
    }

    co2Critical$(co2: number, baseClasses = ''): Observable<string> {
        return this.weatherService.criticalCO2Level$
            .pipe(
                startWith(0),
                map(critical => {
                    if (co2 >= critical)
                        return 'text-danger ' + baseClasses;
                    else
                        return baseClasses;
                }));
    }

    diffMoreThan({ curr, prev }: { curr: SeriesPoint; prev: SeriesPoint | null }, eps = 0.5): boolean {
        if (prev === null)
            return false;
        else
            return Math.abs(curr.value - prev.value) > eps;
    }

    toggleSimulation($event: MatSlideToggleChange) {
        this.isSimulating$.next($event.checked);


    }

    submit() {
        this.simulationService.simulate(this.form.value)
            .subscribe(data => this._simulation$.next(data));
    }
}
