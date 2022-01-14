import { Component } from '@angular/core';

@Component({
             selector:    'app-root',
             templateUrl: './app.component.html',
             styleUrls:   [ './app.component.css' ],
           })
export class AppComponent {
  readonly grafanaURL = 'http://localhost:3030/d-solo/JKLwyLA7z/test?orgId=1&from=1641886972056&to=1641908572056&panelId=2&refresh=1m';
  readonly title = 'Pure Room';

}
