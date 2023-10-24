import { Component, OnDestroy } from '@angular/core';
import { arrayUnion } from '@angular/fire/firestore';
import { Subject, takeUntil } from 'rxjs';
import { Groups } from 'src/app/common/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-mandarin-page',
  templateUrl: './mandarin-page.component.html',
  styleUrls: ['./mandarin-page.component.scss']
})
export class MandarinPageComponent implements OnDestroy{
  isLoggedIn: boolean = false;
  registered: boolean = false;
  userId: string = '';
  constructor(private db: DbService,private auth: AuthService) {}
  destroy: Subject<void> = new Subject();
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
  async ngOnInit(): Promise<void> {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.userId = this.auth.getUID();
    this.auth.loginEvent.pipe(takeUntil(this.destroy.asObservable())).subscribe(event =>{
      if(event) {
        this.userId = this.auth.getUID();
        this.isLoggedIn = true;
        if(this.auth.getUserProfile().roles.includes(Groups[2])) {
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
      await this.db.updateUser(userId,{roles:arrayUnion(Groups[2])});
      this.registered = true;
    }
  }
}
