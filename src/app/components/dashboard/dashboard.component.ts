import { Component, OnInit } from '@angular/core';
import { ReportService }     from '@services/report.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(public reportService: ReportService) { }

  ngOnInit(): void {
  }

}
