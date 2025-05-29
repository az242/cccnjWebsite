import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tile-two',
  templateUrl: './tile-two.component.html',
  styleUrls: ['./tile-two.component.scss'],
  imports: [DatePipe]
})
export class TileTwoComponent implements OnInit {
  @Input() event;
  color;
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.color = this.stringToColour(this.event.uid);
  }
  calculateLuminance(hexColor) {
    // Remove the '#' character if it's present
    hexColor = hexColor.replace(/^#/, '');
  
    // Convert the hex color to RGB
    const r = parseInt(hexColor.slice(0, 2), 16) / 255;
    const g = parseInt(hexColor.slice(2, 4), 16) / 255;
    const b = parseInt(hexColor.slice(4, 6), 16) / 255;
  
    // Calculate luminance using the formula for relative luminance
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  
    return luminance;
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
    let hexColor = colour.replace(/^#/, '');
    if(this.calculateLuminance(hexColor) > .7) {
      let r = parseInt(hexColor.slice(0, 2), 16);
      let g = parseInt(hexColor.slice(2, 4), 16);
      let b = parseInt(hexColor.slice(4, 6), 16);
      let max = Math.max(r * .2126, g * .7152, b * .0722);
      if(max === r * .2126) {
        r = r * .5;
      }else if(max === g * .7152) {
        g = g * .5;
      } else {
        b = b * .5;
      }
      return '#' + r.toString(16) + g.toString(16) + b.toString(16);
    }
    return colour;
  }
}
