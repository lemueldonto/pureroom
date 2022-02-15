import { Component, OnInit }                            from '@angular/core';
import { WeatherService }                               from "@services/weather.service";
import { ReportService }                                from '@services/report.service';
import { filter, map, Observable, pairwise, startWith } from 'rxjs';
import { SeriesPoint }                                  from '@interfaces/weather.interfaces';

function isNonNull<T>(value: T): value is NonNullable<T> {
    return value !== null;
}

@Component({
    selector:    'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls:   [ './navbar.component.css' ],
})
export class NavbarComponent implements OnInit {

    public readonly scoreBuffer$: Observable<{ curr: SeriesPoint, prev: SeriesPoint | null }>;

    private static sndIsNonNull<T>(tuple: [ T, T ]): tuple is [ T, NonNullable<T> ] {
        return isNonNull(tuple[ 1 ]);
    }

    constructor(public weatherService: WeatherService, private reportService: ReportService) {

        this.scoreBuffer$ = this.reportService.score$
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
        return co2 >= 500;
    }

    diffMoreThan({ curr, prev }: { curr: SeriesPoint; prev: SeriesPoint | null }, eps = 0.5): boolean {
        if (prev === null)
            return false;
        else
            return Math.abs(curr.value - prev.value) > eps;
    }
}
