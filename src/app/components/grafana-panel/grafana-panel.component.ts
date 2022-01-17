import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl }    from '@angular/platform-browser';

@Component({
             selector:    'app-grafana-panel',
             templateUrl: './grafana-panel.component.html',
             styleUrls:   [ './grafana-panel.component.css' ],
           })
export class GrafanaPanelComponent implements OnInit {

  @Input('title') title: string = '';
  @Input('grafanaURL') grafanaURL: string = '';
  @Input('description') description: string = '';
  // TODO refactor to find a way to use %, possible passing ngStyle
  @Input('dimensions') dimensions: { width: number, height: number } = { width: 400, height: 200 };
  bypassedGrafanaURL: SafeUrl = '';

  constructor(private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.bypassedGrafanaURL = this.domSanitizer.bypassSecurityTrustResourceUrl(this.grafanaURL);
  }

}
