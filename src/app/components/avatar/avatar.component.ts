import { Component, Input, OnInit } from '@angular/core';
import {SeriesPoint} from "@interfaces/weather.interfaces";
import {ReportService} from "@services/report.service";
@Component({
               selector:    'app-avatar',
               templateUrl: './avatar.component.html',
               styleUrls:   [ './avatar.component.css' ],
           })
export class AvatarComponent implements OnInit {

    @Input('score') score: SeriesPoint = { time: Date.now(), value: 7 };

    constructor(public reportService: ReportService) { }

    ngOnInit(): void {
    }

}
