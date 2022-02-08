import { Injectable }         from '@angular/core';
import { WeatherService }     from './weather.service';
import { SeriesPoint }        from '@interfaces/weather.interfaces';
import { map }                from 'rxjs/operators';
import { Observable }         from 'rxjs';
import { environment as env } from '@env';


export interface IMGAttributes {
    src: string,
    alt: string
}

@Injectable({
                providedIn: 'root',
            })
export class ReportService {

    private avatarMap: Map<number, IMGAttributes> =
                new Map<number, IMGAttributes>([
                                                   [ 0, { src: 'plant0', alt: 'dead plant' } ],
                                                   [ 1, { src: 'plant1', alt: 'dying plant' } ],
                                                   [ 2, { src: 'plant2', alt: 'diseased plant' } ],
                                                   [ 3, { src: 'plant3', alt: 'living plant' } ],
                                               ]);

    constructor(private weatherService: WeatherService) {
    }

    public get score$(): Observable<SeriesPoint> {
        return this.weatherService.scoreTimeSeriesFetcher$
                   .pipe(map(arr => arr[arr.length - 1]));
    }

    public get avatar$(): Observable<IMGAttributes> {
        const discretize = ({ value: score }: SeriesPoint): number => {
            if (score < 3)
                return 0;
            else if (score < 5)
                return 1;
            else if (score < 7)
                return 2;
            else
                return 3;
        };

        const toAsset = (attrs: IMGAttributes): IMGAttributes => ( {
            ...attrs,
            src: env.avatarDir + attrs.src + '.png',
        } );

        return this.score$
                   .pipe(map(discretize),
                         map((key: number) => this.avatarMap.get(key)!),
                         map(toAsset),
                   );
    }

}
