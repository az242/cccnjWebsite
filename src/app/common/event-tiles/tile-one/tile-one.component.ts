import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tile-one',
  templateUrl: './tile-one.component.html',
  styleUrls: ['./tile-one.component.scss']
})
export class TileOneComponent implements OnInit {
  @Input() event;
  color;
  color2;
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.color = this.stringToColour(this.event.uid);
    this.color2 = this.stringToColour(this.event.uid.split('').reverse().join(''));
  }
  routeToEvent() {
    this.router.navigate(['event/' + this.event.uid]);
  }
  stringToColour(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }
}
