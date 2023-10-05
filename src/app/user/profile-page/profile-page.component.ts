import { Component } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {
  userProfile;
  constructor(private auth: AuthService, private user: UserService, private router: Router) {}
  ngOnInit(): void {
    let temp = this.auth.getUser();
    console.log(temp);
    this.userProfile = {displayName: temp.displayName, phoneNumber: temp.phoneNumber, photoUrl: temp.photoURL, email: temp.email, created: temp.metadata.creationTime, loggedIn: temp.metadata.lastSignInTime};
    this.user.getUser(this.auth.getUID()).subscribe((userProfile) => {
      this.userProfile = {...this.userProfile, ...userProfile.user};
      console.log(this.userProfile);
    });
    this.auth.loginEvent.subscribe((user)=> {
      if(!user) {
        this.router.navigate(['login'], {queryParams: {path:'profile'}});
      } else {
        console.log('login-event');
        this.userProfile = {...this.userProfile, displayName: temp.displayName, phoneNumber: temp.phoneNumber, photoUrl: temp.photoURL, email: temp.email }
      }
    });
  }
  async saveProfile() {
    await updateProfile(this.auth.getUser(), {displayName: this.userProfile.firstName + ' ' + this.userProfile.lastName, photoURL: this.userProfile.photoUrl});
    this.auth.reload();
  }
}
