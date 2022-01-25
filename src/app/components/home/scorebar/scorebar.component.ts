import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
}                           from '@angular/core';
import * as d3              from 'd3';
import { ScaleLinear, svg } from 'd3';


@Component({
               selector:    'app-scorebar',
               templateUrl: './scorebar.component.html',
               styleUrls:   [ './scorebar.component.css' ],
           })
export class ScorebarComponent implements OnInit, AfterViewInit, OnChanges {
    @ViewChild('scorebar') scorebarElement!: ElementRef;

    readonly width = 800;
    readonly height = 25;
    readonly margin = {
        left:    10,
        right:   10,
        top:     5,
        botttom: 5,
    };
    readonly scoreFactors = {
        ok:       .7,
        bad:      .5,
        critical: .2,
    };

    @Input('score') score: number = 7;
    x: ScaleLinear<number, number> = d3.scaleLinear();

    constructor() { }

    ngOnInit(): void { }

    ngAfterViewInit(): void {
        const svg = d3.select(this.scorebarElement?.nativeElement)
                      .append('svg')
                      .attr('width', this.width + this.margin.left + this.margin.right)
                      .attr('height', this.height + this.margin.top + this.margin.botttom);

        const start = this.margin.left;
        const end = this.margin.left + this.width;
        const middle = ( start + end ) / 2.;

        this.x.domain([ 0, 10 ])
            .range([ start, end ])
            .clamp(true);

        const bars = [
            { fill: 'green', r: 10, x: middle, w: end - middle },
            { fill: '#7f0000', r: 10, x: start, w: middle - start },
            {
                fill: 'red',
                r:    1,
                x:    ( end - start ) * this.scoreFactors.critical,
                w:    ( end - start ) * ( this.scoreFactors.bad - this.scoreFactors.critical ),
            },
            {
                fill: 'yellow',
                r:    1,
                x:    ( end - start ) * this.scoreFactors.bad,
                w:    ( end - start ) * ( this.scoreFactors.ok - this.scoreFactors.bad ),
            },
        ];

        const scorebarGroup = svg.append('g').attr('class', 'scorebars');

        for (const bar of bars) {
            const y = this.margin.top;
            const h = this.height;

            scorebarGroup.append('rect')
                         .attr('x', bar.x)
                         .attr('y', y)
                         .attr('rx', bar.r)
                         .attr('ry', bar.r)
                         .attr('height', h)
                         .attr('width', bar.w)
                         .attr('fill', bar.fill);
        }

        svg.append('g')
           .attr('class', 'cursor')
           .append('rect')
           .attr('x', this.x(this.score))
           .attr('y', 0)
           .attr('width', 5)
           .attr('height', this.height + this.margin.botttom + this.margin.top)
           .attr('rx', 4)
           .attr('ry', 4)
           .attr('fill', 'dimgrey');

    }

    ngOnChanges(changes: SimpleChanges): void {
        const currVal = changes['score']?.currentValue;
        if (isFinite(currVal)) {
            d3.select('.cursor > rect')
              .transition()
              .duration(250)
              .attr('x', this.x(this.score));
        }
    }

}
