import { Component, OnInit } from '@angular/core';
import { arrayUnion } from '@angular/fire/firestore';
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
  recurringDates: Date[] = [];
  isLoggedIn: boolean = false;
  registered: boolean = false;
  userId: string = '';
  constructor(private db: DbService,private auth: AuthService, private user: DbService, private activedRoute: ActivatedRoute) {}
  async ngOnInit(): Promise<void> {
    const id = this.activedRoute.snapshot.paramMap.get('id')!;
    this.event = await this.db.getEventById(id);
    this.color = this.stringToColour(this.event.uid);
    if(this.event.recurrence) {
      let initialDate = new Date(this.event.startDate);
      while(initialDate.getTime()<this.event.recurrence.endDate.getTime()) {
        initialDate.setDate(initialDate.getDate() + this.event.recurrence.interval);
        if(initialDate.getTime() < this.event.recurrence.endDate.getTime()) {
          let tempDate = new Date(initialDate);
          let tempdst = tempDate.getTimezoneOffset() === 240;
          if(tempdst) {
            tempDate.setHours(tempDate.getHours() + 1);
          }
          this.recurringDates.push(tempDate);
        }
      }
    }
    if(new Date().getTimezoneOffset() === 240) {
      this.event.startDate.setHours(this.event.startDate.getHours() + 1);
    }
    this.isLoggedIn = this.auth.isLoggedIn();
    this.userId = this.auth.getUID();
    if(this.event.attendees.includes(this.userId)) {
      this.registered = true;
    }
    this.auth.loginEvent.subscribe(event =>{
      if(event) {
        this.userId = this.auth.getUID();
        this.isLoggedIn = true;
        if(this.event.attendees.includes(this.userId)) {
          this.registered = true;
        }
      } else {
        this.userId = '';
        this.isLoggedIn = false;
        this.registered = false;
      }
    });
  }
  async register() {
    let userId = this.auth.getUID();
    let eventId = this.event.uid;
    if(eventId && userId) {
      let result = await this.db.addEventAttendee(this.event.uid,this.auth.getUID());
      this.event.attendees.push(this.userId);
      await this.db.updateUser(userId,{events:arrayUnion(eventId)});
      this.registered = true;
      console.log(result);
    }
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
