import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router }   from '@angular/router';

@Component({
             selector:    'app-scorebar',
             templateUrl: './scorebar.component.html',
             styleUrls:   [ './scorebar.component.css' ],
           })
export class ScorebarComponent implements OnInit {
  readonly width = 800;
  readonly height = 100;
  readonly viewBox = `0 0 ${ this.width } ${ this.height }`;

  @Input('airQuality') airQuality: number = 0;
  cursor: number;

  constructor() {
    this.cursor = this.width * ( this.airQuality / 100. );
  }

  ngOnInit(): void {

  }

}
