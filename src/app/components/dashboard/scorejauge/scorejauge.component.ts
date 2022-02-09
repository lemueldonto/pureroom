import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-scorejauge',
  templateUrl: './scorejauge.component.html',
  styleUrls: ['./scorejauge.component.css']
})
export class ScorejaugeComponent implements OnInit {
    @Input() score?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
