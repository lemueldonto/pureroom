import { Component, OnInit } from '@angular/core';
import {WeatherService} from "../../services/weather.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public weatherService: WeatherService) { }

  ngOnInit(): void {
  }

    isCO2Critical(co2: number): boolean {
        return co2 >= 500;
    }

}
