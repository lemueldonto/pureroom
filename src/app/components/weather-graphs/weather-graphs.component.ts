import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
}                       from '@angular/core';
import * as d3          from 'd3';
import { Subscription } from 'rxjs';
import {
    SeriesPoint, TimeSeries,
    WeatherTimeSeries,
}                       from '../../interfaces/weather.interfaces';
import {
    WeatherService,
}                       from '../../services/weather.service';

@Component({
               selector:    'app-weather-graphs',
               templateUrl: './weather-graphs.component.html',
               styleUrls:   [ './weather-graphs.component.css' ],
           })
export class WeatherGraphsComponent implements OnInit, AfterViewInit, OnDestroy {


    @ViewChild('plot') plotElem!: ElementRef;

    private sub: Subscription | null = null;

    private svg: any = null;
    private graphs: any = null;
    private dimensions = { width: 300, height: 150 };
    private margin = { top: 5, bottom: 40, left: 15, right: 285 };

    private x_score: any;
    private y_score: any;
    private x_temp: any;
    private y_temp: any;
    private x_hum: any;
    private y_hum: any;
    private x_co2: any;
    private y_co2: any;

    private scores: TimeSeries = [];

    constructor(private weatherService: WeatherService) { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    ngAfterViewInit() {
        this.sub = this.weatherService.weatherTimeseries$
                       .subscribe(timeSeries => {
                           this.clear();
                           this.buildGraph(timeSeries);
                       });
    }

    private clear(): void {
        d3.select(this.plotElem.nativeElement)
          .selectAll('*')
          .remove();

        this.svg = this.graphs = null;
        this.x_co2 = this.x_hum = this.x_temp = null;
        this.y_co2 = this.y_hum = this.y_temp = null;
    }

    private buildGraph(data: WeatherTimeSeries): void {
        // TODO remove
        let max = -Infinity;
        let min = +Infinity;
        data.co2.forEach(({ value }) => {
            if (value > max)
                max = value;
            if (value < min)
                min = value;
        });

        // map co2 between [0, 10]
        this.scores = data.co2.map(({ value, time }) => ( {
            value: 10 * ( value - max ) / ( min - max ),
            time,
        } ));
        this.scores = WeatherGraphsComponent.EMA(this.scores);

        const flatData = WeatherService.flatTimeSeries(data);

        this.svg = d3.select(this.plotElem.nativeElement)
                     .attr('width', '100%')
                     .attr('viewBox', `0 0 ${ this.dimensions.width } ${ this.dimensions.height }`)
                     .attr('preserveAspectRatio', 'xMidYMid meet');

        // Y Scales
        const yScale = (domain: [ number, number ]) => d3
            .scaleLinear()
            .domain(domain)
            .range([ this.margin.bottom, this.margin.top ])
            .clamp(true)
            .nice();

        const xScale = (domain: [ number, number ], range: [ number, number ]) => d3
            .scaleTime()
            .domain(domain)
            .range(range)
            // .nice()
            .clamp(true);

        const domain = d3.extent(flatData, d => d.time);
        if (domain[0] !== undefined) {

            const gap = 10;
            const middle = ( this.margin.left + this.margin.right ) / 2.;

            this.x_score = xScale(domain, [ this.margin.left, this.margin.right ]);
            this.x_co2 = xScale(domain, [ this.margin.left, this.margin.right ]);
            this.x_temp = xScale(domain, [ this.margin.left, middle - gap ]);
            this.x_hum = xScale(domain, [ middle + gap, this.margin.right ]);

            const score_range = d3.extent(this.scores, d => d.value);
            const temp_range = d3.extent(data.temperature, d => d.value);
            const hum_range = d3.extent(data.humidity, d => d.value);
            const co2_range = d3.extent(data.co2, d => d.value);

            if (temp_range[0] !== undefined)
                this.y_temp = yScale(temp_range);
            if (hum_range[0] !== undefined)
                this.y_hum = yScale(hum_range);
            if (co2_range[0] !== undefined)
                this.y_co2 = yScale(co2_range);
            if (score_range[0] !== undefined)
                this.y_score = yScale(score_range);

            const addPlot = (points: SeriesPoint[], group: any, x: any, y: any, label: string, id: string, className: string,
                             color: string = 'darkorange',
                             strokeWidth   = 0.4) => {
                const g = group.append('g')
                               .attr('class', className);

                const { bottom, top, left, right } = WeatherGraphsComponent.getMargins(x, y);

                // X-Axis line
                g.append('g')
                 .attr('transform', `translate(0,${ bottom })`)
                 .attr('class', `${ id }-x-axis`)
                 .attr('stroke-width', 0.1)
                 .style('stroke-dasharray', '1,1')
                 .style('font-size', '2.5')
                 .call(d3.axisBottom(x)
                         .ticks(10)
                         .tickSize(top - bottom));

                // Y-Axis line
                g.append('g')
                 .attr('transform', `translate(${ left },0)`)
                 .attr('stroke-width', 0.5)
                 .call(d3.axisLeft(y).tickSize(0).tickFormat(<any> ''));

                // // Y-Axis scale
                g.append('g')
                 .attr('transform', `translate(${ left },0)`)
                 .attr('stroke-width', 0.1)
                 .style('stroke-dasharray', '1,1')
                 .style('font-size', '3')
                 .call(d3.axisLeft(y).ticks(6).tickSize(left - right));

                // Y-Axis label
                g.append('text')
                 .attr('text-anchor', 'middle')
                 .attr('transform', `translate(${ left - 12 },${ bottom / 2 }) rotate(-90)`)
                 .style('font-size', '3.5')
                 .text(label);

                g.append('path')
                 .datum(points)
                 .attr('clip-path', 'url(#clip)')
                 .attr('id', id)
                 .attr('fill', 'none')
                 .attr('stroke', color)
                 .attr('stroke-width', strokeWidth)
                 .attr('stroke-linejoin', 'round')
                 .attr('stroke-linecap', 'round')
                 .attr('d', d3.line()
                              .x((d: any) => x(d.time))
                              .y((d: any) => y(d.value)));

                return g;
            };

            this.graphs = this.svg.append('g');

            addPlot(this.scores, this.graphs, this.x_score, this.y_score, 'Score', 'score', 'score', 'darkslateblue', 0.6);
            addPlot(data.co2, this.graphs, this.x_co2, this.y_co2, 'CO2 [ppm]', 'co2', 'co2')
                .attr('transform', `translate(0,${ this.dimensions.height / 3 })`);
            addPlot(data.humidity, this.graphs, this.x_hum, this.y_hum, 'Humidity [%]', 'humidity', 'humidity')
                .attr('transform', `translate(0,${ 2 * this.dimensions.height / 3 })`);
            addPlot(data.temperature, this.graphs, this.x_temp, this.y_temp, 'Temperature [°C]', 'temperature', 'temperature')
                .attr('transform', `translate(0,${ 2 * this.dimensions.height / 3 })`);

            this.addBrush(this.svg, this.x_score, this.y_score);
        }
    }

    private addBrush(graph: any, x: any, y: any) {
        const { left, top, right, bottom } = WeatherGraphsComponent.getMargins(x, y);

        const brush = d3.brushX()
                        .extent([ [ left, top ], [ right, bottom ] ])
                        .on('brush end', (event: any) => {
                            if (event.sourceEvent && event.sourceEvent.type === 'zoom') {
                                return;
                            } else {
                                const s = event.selection || x.range();
                                const domain = x.domain();
                                const selection = s.map(x.invert, x);
                                console.dir({ domain, selection }, { dir: null, colors: true });
                                // x.domain(s.map(x.invert, x));
                                this.updateX(selection, 'temperature', 'x_temp', this.y_temp);
                                this.updateX(selection, 'co2', 'x_co2', this.y_co2);
                                this.updateX(selection, 'humidity', 'x_hum', this.y_hum);
                            }
                        });

        graph.append('g')
             .attr('class', 'brush')
             .call(brush)
             .call(brush.move, x.range());
    }

    private static getMargins(x: any, y: any): { left: number, right: number, top: number, bottom: number } {
        return {
            bottom: y.range()[0],
            top:    y.range()[1],
            left:   x.range()[0],
            right:  x.range()[1],
        };
    }

    private static EMA(data: TimeSeries, window = 20): TimeSeries {
        const weight = 2 / ( window + 10 );
        return data.reduce((prev: TimeSeries, curr: SeriesPoint): TimeSeries => {
            if (prev.length > 1) {
                const EMAy = prev[prev.length - 1].value ?? 0;
                const EMAt = ( curr.value - EMAy ) * weight + EMAy;
                return [ ...prev, { value: EMAt, time: curr.time } ];
            } else {
                return [ ...prev, curr ];
            }
        }, []);
    }

    private updateX(domain: [ number, number ], id: string, x_accessor: 'x_temp' | 'x_hum' | 'x_co2', y: any) {

        this[x_accessor].domain(domain);

        this.svg.select(`#${ id }`)
            .attr('d', d3.line()
                         .x((d: any) => this[x_accessor](d.time))
                         .y((d: any) => y(d.value)));

        const { bottom, top } = WeatherGraphsComponent.getMargins(this[x_accessor], y);

        this.svg.select(`.${ id }-x-axis`)
            .call(d3.axisBottom(this[x_accessor])
                    .ticks(10)
                    .tickSize(top - bottom));
    }
}
