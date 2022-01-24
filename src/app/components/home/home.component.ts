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
            url:         'http://localhost:3030/d-solo/frazUQ1nk/new-dashboard?orgId=1&from=1642501194989&to=1642522794989&panelId=2',
            title:       'Humidity',
            description: 'Sunt zetaes aperto azureus, festus ventuses.',
            dimensions:  { width: 632, height: 200 },
        },
        {
            url:         'http://localhost:3030/d-solo/frazUQ1nk/new-dashboard?orgId=1&from=1642501336093&to=1642522936094&panelId=4',
            title:       'Temperature',
            description: 'Galluss peregrinatione in cubiculum!',
            dimensions:  { width: 632, height: 200 },
        },
        {
            url:         'http://localhost:3030/d-solo/frazUQ1nk/new-dashboard?orgId=1&from=1642501382272&to=1642522982272&panelId=6',
            title:       'CO2',
            description: 'Peritus caniss ducunt ad fluctui.',
            dimensions:  { width: 1280, height: 200 },
        },
    ];

    constructor(public weatherService: WeatherService,
                public reportService: ReportService) { }

    ngOnInit(): void {
    }
}
