import { Component, OnInit }                                                                 from '@angular/core';
import {
    WeatherService,
}                                                                                            from "@services/weather.service";
import {
    ReportService,
}                                                                                            from '@services/report.service';
import { filter, iif, map, Observable, pairwise, ReplaySubject, startWith, switchMap, take } from 'rxjs';
import {
    SeriesPoint,
}                                                                                            from '@interfaces/weather.interfaces';
import { FormBuilder, FormGroup }                                                            from '@angular/forms';
import {
    MatSlideToggleChange,
}                                                                                            from '@angular/material/slide-toggle';
import {
    SimulationService,
}                                                                                            from '@services/simulation.service';

function isNonNull<T>(value: T): value is NonNullable<T> {
    return value !== null;
}

@Component({
    selector:    'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls:   [ './navbar.component.css' ],
})
export class NavbarComponent implements OnInit {

    public form: FormGroup;

    public readonly scoreBuffer$: Observable<{ curr: SeriesPoint, prev: SeriesPoint | null }>;

    isSimulating$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

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

        this.scoreBuffer$ = this.isSimulating$
            .pipe(
                switchMap(isSimulating => iif(() => isSimulating,
                    this.form.valueChanges
                        .pipe(switchMap(data => this.simulationService.simulate(data))),
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
    }

    public scoreChangeClasses(prev: SeriesPoint | null, curr: SeriesPoint): string {
        if (prev === null)
            return '';

        return `${ curr.value > prev.value ? 'text-success' : 'text-error' } text-sm font-weight-bolder`;
    }

    isCO2Critical(co2: number): boolean {
        return co2 >= 800;
    }

    diffMoreThan({ curr, prev }: { curr: SeriesPoint; prev: SeriesPoint | null }, eps = 0.5): boolean {
        if (prev === null)
            return false;
        else
            return Math.abs(curr.value - prev.value) > eps;
    }

    toggleSimulation($event: MatSlideToggleChange) {
        this.isSimulating$.next($event.checked);

        this.weatherService.weatherData$
            .pipe(take(1))
            .subscribe(data => {
                this.form.setValue({
                    temperature: data.temperature,
                    humidity:    data.humidity,
                    co2:         data.co2,
                });
            });
    }
}
