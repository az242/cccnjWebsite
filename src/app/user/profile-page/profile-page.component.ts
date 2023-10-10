import { Component } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Family, User } from 'src/app/common/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {
  userProfile: User;
  familyMembers = [];
  userList = [];
  member;
  constructor(private auth: AuthService, private user: DbService, private router: Router) {}
  async ngOnInit(): Promise<void> {
    this.userList = await this.user.getAllUsers();
    let temp = this.auth.getUser();
    this.userProfile = {displayName: temp.displayName, phone: temp.phoneNumber, photoUrl: temp.photoURL, email: temp.email, created: temp.metadata.creationTime, loggedIn: temp.metadata.lastSignInTime, uid: temp.uid} as User;
    this.auth.loginEvent.subscribe((user)=> {
      if(!user) {
        this.router.navigate(['login'], {queryParams: {path:'profile'}});
      } else {
        // console.log('login-event');
        this.userProfile = {...this.userProfile, displayName: temp.displayName, phone: temp.phoneNumber, photoUrl: temp.photoURL, email: temp.email }
      }
    });
    let dbUser = await this.user.getUser(this.auth.getUID());
    this.userProfile = {...this.userProfile, ...dbUser};
    if(this.userProfile.familyId) {
      this.familyMembers = await this.user.getFamilyMembers(this.userProfile.familyId);
    }
  }
  formatter = (result) => result.firstName + ' ' + result.lastName + ' ' + result.email;
  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map((term) =>
      term.length < 2 ? [] : this.userList.filter((user) => 
      ((user.firstName+' '+user.lastName).toLowerCase().indexOf(term.toLowerCase()) > -1 || user.email.toLowerCase().indexOf(term.toLowerCase()) > -1) && 
       this.familyMembers.findIndex(ele => ele.uid === user.uid) === -1).slice(0, 10),
    ),
  );
  async addFamilyMember() {
    if(this.userProfile.familyId) {
      //update family
      let result = await this.user.addFamilyMember(this.userProfile.familyId, this.member.uid);
      console.log(result);
    } else {
      //create new family
      let family: Family = {members: [this.userProfile.uid,this.member.uid]};
      let result = await this.user.createFamily(family);
      console.log(result);
    }
    this.familyMembers = await this.user.getFamilyMembers(this.userProfile.familyId);
    this.member = undefined;
  }
  async saveProfile() {
    await updateProfile(this.auth.getUser(), {displayName: this.userProfile.firstName + ' ' + this.userProfile.lastName, photoURL: this.userProfile.photoUrl});
    this.auth.reload();
  }
}
