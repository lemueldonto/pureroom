import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnChanges, OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild,
}                                      from '@angular/core';
import * as d3                         from 'd3';
import { AxisScale, AxisDomain, zoom } from 'd3';
import { Subscription }                from 'rxjs';
import {
    FlatWeatherTimeSeries,
    SeriesPoint,
    WeatherData,
    WeatherTimeSeries,
}                                      from '../../interfaces/weather.interfaces';
import {
    WeatherService,
}                                      from '../../services/weather.service';

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
    private dimensions = { width: 300, height: 200 };
    private margin = { top: 10, bottom: 85, left: 15, right: 285 };

    private x_temp: any;
    private y_temp: any;
    private x_hum: any;
    private y_hum: any;
    private x_co2: any;
    private y_co2: any;

    constructor(private weatherService: WeatherService) { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    ngAfterViewInit() {
        this.sub = this.weatherService.weatherTimeseries$
                       .subscribe(timeseries => {
                           this.clear();
                           this.buildGraph(timeseries);
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
        const flatData = WeatherService.flatTimeSeries(data);


        this.svg = d3.select(this.plotElem.nativeElement)
                     .attr('width', '100%')
                     .attr('viewBox', `0 0 ${ this.dimensions.width } ${ this.dimensions.height }`)
                     .attr('preserveAspectRatio', 'xMidYMid meet');

        const domain = d3.extent(flatData, d => d.time);

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
            .nice()
            .clamp(true);

        if (domain[0] !== undefined) {
            const gap = 10;
            const middle = ( this.margin.left + this.margin.right ) / 2.;

            this.x_co2 = xScale(domain, [ this.margin.left, this.margin.right ]);
            this.x_temp = xScale(domain, [ this.margin.left, middle - gap ]);
            this.x_hum = xScale(domain, [ middle + gap, this.margin.right ]);

            const temp_range = d3.extent(data.temperature, d => d.value);
            const hum_range = d3.extent(data.humidity, d => d.value);
            const co2_range = d3.extent(data.co2, d => d.value);

            if (temp_range[0] !== undefined)
                this.y_temp = yScale(temp_range);
            if (hum_range[0] !== undefined)
                this.y_hum = yScale(hum_range);
            if (co2_range[0] !== undefined)
                this.y_co2 = yScale(co2_range);

            const addPlot = (points: SeriesPoint[], group: any, x: any, y: any, label: string, id: string, color: string) => {
                const g = group.append('g');

                const bottom = y.range()[0];
                const top = y.range()[0];
                const left = x.range()[0];
                const right = x.range()[1];

                // X-Axis line
                g.append('g')
                 .attr('transform', `translate(0,${ bottom })`)
                 .attr('class', 'x-axis')
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
                 .attr('transform', `translate(${ left - 12 },${ 50 }) rotate(-90)`)
                 .style('font-size', '3.5')
                 .text(label);

                g.append('path')
                 .datum(points)
                 .attr('clip-path', 'url(#clip)')
                 .attr('id', id)
                 .attr('fill', 'none')
                 .attr('stroke', color)
                 .attr('stroke-width', 0.22)
                 .attr('stroke-linejoin', 'round')
                 .attr('stroke-linecap', 'round')
                 .attr('d', d3.line()
                              .x((d: any) => x(d.time))
                              .y((d: any) => y(d.value)));

                return g;
            };


            this.graphs = this.svg.append('g');

            addPlot(data.co2, this.graphs, this.x_co2, this.y_co2, 'CO2 [ppm]', 'co2', 'steelblue');
            addPlot(data.humidity, this.graphs, this.x_hum, this.y_hum, 'Humidity [%]', 'hum', 'steelblue')
                .attr('transform', `translate(0,${ this.dimensions.height / 2 })`);
            addPlot(data.temperature, this.graphs, this.x_temp, this.y_temp, 'Temperature [°C]', 'temp', 'steelblue')
                .attr('transform', `translate(0,${ this.dimensions.height / 2 })`);
        }
    }

}
