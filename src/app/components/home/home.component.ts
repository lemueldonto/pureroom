import { Component, OnInit } from '@angular/core';
import { WeatherService }    from '../../services/weather.service';
import { ReportService }     from '../../services/report.service';

@Component({
             selector:    'app-home',
             templateUrl: './home.component.html',
             styleUrls:   [ './home.component.css' ],
           })
export class HomeComponent implements OnInit {

  readonly grafanaData = [
    {
      url:         'http://localhost:3030/d-solo/JKLwyLA7z/test?orgId=1&from=1641886972056&to=1641908572056&panelId=2&refresh=1m',
      title:       'Dashboard 1',
      description: 'Sunt zetaes aperto azureus, festus ventuses.',
      dimensions:  { width: 632, height: 200 },
    },
    {
      url:         'http://localhost:3030/d-solo/JKLwyLA7z/test?orgId=1&from=1641886972056&to=1641908572056&panelId=2&refresh=1m',
      title:       'Dashboard 2',
      description: 'Galluss peregrinatione in cubiculum!',
      dimensions:  { width: 632, height: 200 },
    },
    {
      url:         'http://localhost:3030/d-solo/JKLwyLA7z/test?orgId=1&from=1641886972056&to=1641908572056&panelId=2&refresh=1m',
      title:       'Dashboard 2',
      description: 'Peritus caniss ducunt ad fluctui.',
      dimensions:  { width: 1280, height: 200 },
    },
  ];

  constructor(public weatherService: WeatherService,
              public reportService: ReportService) { }

  ngOnInit(): void {
  }
}
