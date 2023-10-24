import { Component, OnDestroy } from '@angular/core';
import { arrayUnion } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.scss']
})
export class GroupPageComponent implements OnDestroy{
  color;
  group;
  isLoggedIn: boolean = false;
  registered: boolean = false;
  userId: string = '';
  isLoading: boolean = false;
  constructor(private db: DbService,private auth: AuthService, private activedRoute: ActivatedRoute) {}
  destroy: Subject<void> = new Subject();
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    const id = this.activedRoute.snapshot.paramMap.get('id')!;
    this.group = await this.db.getGroupById(id);
    this.color = this.stringToColour(this.group.uid);
    this.isLoggedIn = this.auth.isLoggedIn();
    this.userId = this.auth.getUID();
    this.isLoading = false;
    if(this.group.attendees.includes(this.userId)) {
      this.registered = true;
    }
    this.auth.loginEvent.pipe(takeUntil(this.destroy.asObservable())).subscribe(event =>{
      if(event) {
        this.userId = this.auth.getUID();
        this.isLoggedIn = true;
        if(this.group.attendees.includes(this.userId)) {
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
    let groupId = this.group.uid;
    if(groupId && userId) {
      let result = await this.db.addGroupAttendee(this.group.uid,this.auth.getUID());
      this.group.attendees.push(this.userId);
      await this.db.updateUser(userId,{groups:arrayUnion(groupId)});
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
