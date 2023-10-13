import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tile-two',
  templateUrl: './tile-two.component.html',
  styleUrls: ['./tile-two.component.scss']
})
export class TileTwoComponent implements OnInit {
  @Input() event;
  color;
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.color = this.stringToColour(this.event.uid);
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
