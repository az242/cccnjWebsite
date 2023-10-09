import { Component } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {
  userProfile;
  family;
  userList = [];
  member;
  constructor(private auth: AuthService, private user: DbService, private router: Router) {}
  async ngOnInit(): Promise<void> {
    this.userList = await this.user.getAllUsers();
    let temp = this.auth.getUser();
    this.userProfile = {displayName: temp.displayName, phoneNumber: temp.phoneNumber, photoUrl: temp.photoURL, email: temp.email, created: temp.metadata.creationTime, loggedIn: temp.metadata.lastSignInTime};
    this.auth.loginEvent.subscribe((user)=> {
      if(!user) {
        this.router.navigate(['login'], {queryParams: {path:'profile'}});
      } else {
        // console.log('login-event');
        this.userProfile = {...this.userProfile, displayName: temp.displayName, phoneNumber: temp.phoneNumber, photoUrl: temp.photoURL, email: temp.email }
      }
    });
    let dbUser = await this.user.getUser(this.auth.getUID());
    this.userProfile = {...this.userProfile, ...dbUser};
    if(this.userProfile.family) {
      this.family = this.user.getFamilyMembers(this.userProfile.family);
    }
  }
  formatter = (result) => result.firstName + ' ' + result.lastName + ' ' + result.email;
  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map((term) =>
      term.length < 2 ? [] : this.userList.filter((user) => (user.firstName+' '+user.lastName).toLowerCase().indexOf(term.toLowerCase()) > -1 || user.email.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
    ),
  );
  addFamilyMember() {
    console.log(this.member);
  }
  async saveProfile() {
    await updateProfile(this.auth.getUser(), {displayName: this.userProfile.firstName + ' ' + this.userProfile.lastName, photoURL: this.userProfile.photoUrl});
    this.auth.reload();
  }
}
