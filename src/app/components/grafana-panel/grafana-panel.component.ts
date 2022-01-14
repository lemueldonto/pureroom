import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl }    from '@angular/platform-browser';

@Component({
             selector:    'app-grafana-panel',
             templateUrl: './grafana-panel.component.html',
             styleUrls:   [ './grafana-panel.component.css' ],
           })
export class GrafanaPanelComponent implements OnInit {

  @Input('dashboardTitle') dashboardTitle: string = '';

  @Input('grafanaURL') grafanaURL: string = '';
  bypassedGrafanaURL: SafeUrl = '';

  constructor(private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.bypassedGrafanaURL = this.domSanitizer.bypassSecurityTrustResourceUrl(this.grafanaURL);
  }

}
