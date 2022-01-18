import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WeatherService }                                 from '../../services/weather.service';

@Component({
             selector:    'app-pureroom-title',
             templateUrl: './pureroom-title.component.html',
             styleUrls:   [ './pureroom-title.component.css' ],
           })
export class PureroomTitleComponent implements OnInit {

  @Output('toggleSidenav') _toggleSidenav = new EventEmitter();
  @Input('title') title: string = '';

  constructor(public weatherService: WeatherService) { }

  ngOnInit(): void {
  }

  public toggleSidenav(): void {
    this._toggleSidenav.emit();
  }

  isCO2Critical(co2: number): boolean {
    return co2 >= 500;
  }
}
