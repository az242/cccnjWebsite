import { Component } from '@angular/core';
import { arrayUnion } from '@angular/fire/firestore';
import { Groups } from 'src/app/common/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-regen-page',
  templateUrl: './regen-page.component.html',
  styleUrls: ['./regen-page.component.scss']
})
export class RegenPageComponent {
  isLoggedIn: boolean = false;
  registered: boolean = false;
  userId: string = '';
  constructor(private db: DbService,private auth: AuthService) {}
  async ngOnInit(): Promise<void> {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.userId = this.auth.getUID();
    this.auth.loginEvent.subscribe(event =>{
      if(event) {
        this.userId = this.auth.getUID();
        this.isLoggedIn = true;
        if(this.auth.getUserProfile().roles.includes['english']) {
          this.registered = true;
        } else {
          this.registered = false;
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
    if(userId) {
      await this.db.updateUser(userId,{roles:arrayUnion(Groups[0])});
      this.registered = true;
    }
  }
}
