import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss']
})
export class EventPageComponent implements OnInit {
  color;
  event;
  constructor(private db: DbService,private auth: AuthService, private user: DbService, private activedRoute: ActivatedRoute) {}
  async ngOnInit(): Promise<void> {
    const id = this.activedRoute.snapshot.paramMap.get('id')!;
    console.log(id);
    this.event = await this.db.getEventById(id);
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
