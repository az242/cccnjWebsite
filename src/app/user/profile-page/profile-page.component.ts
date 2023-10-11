import { Component, OnDestroy, ViewChild } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, OperatorFunction, Subject, debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs';
import { Roles, User } from 'src/app/common/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/user.service';
import * as bootstrap from 'bootstrap';
import { Family } from 'src/app/common/family.model';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { arrayRemove, arrayUnion } from '@angular/fire/firestore';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnDestroy{
  userProfile: User;
  familyMembers = [];
  userList = [];
  member;
  userForRoles;
  alertMessage: string;
  rolesForm = this.fb.group({
    user: [undefined as User, Validators.required],
    roles: this.fb.array([
      this.fb.control('',Validators.required)
    ])
  });
  destroy: Subject<void> = new Subject();
  constructor(private auth: AuthService, private user: DbService, private router: Router, private fb: FormBuilder) {}
  ngOnDestroy(): void {
    this.destroy.next();
    // Don't forget to unsubscribe from subject itself
    this.destroy.unsubscribe();
  }
  async ngOnInit(): Promise<void> {
    this.userList = await this.user.getAllUsers();
    console.log('Userlist: ',this.userList);
    let temp = this.auth.getUser();
    this.userProfile = {displayName: temp.displayName, phone: temp.phoneNumber, photoUrl: temp.photoURL, email: temp.email, created: temp.metadata.creationTime, loggedIn: temp.metadata.lastSignInTime, uid: temp.uid} as User;
    this.auth.loginEvent.pipe(takeUntil(this.destroy.asObservable())).subscribe((user)=> {
      if(!user) {
        this.router.navigate(['']);
        // this.router.navigate(['login'], {queryParams: {path:'profile'}});
      } else {
        // console.log('login-event');
        this.userProfile = {...this.userProfile, displayName: temp.displayName, phone: temp.phoneNumber, photoUrl: temp.photoURL, email: temp.email }
      }
    });
    let dbUser = await this.user.getUser(this.auth.getUID());
    this.userProfile = {...dbUser,...this.userProfile};
    if(dbUser.photoUrl && !this.userProfile.photoUrl) {
      this.userProfile.photoUrl = dbUser.photoUrl;
    }
    // console.log(this.userProfile);
    if(this.userProfile.familyId) {
      this.familyMembers = await this.user.getFamilyMembers(this.userProfile.familyId);
      this.familyMembers.splice(this.familyMembers.findIndex(user => user.uid === this.userProfile.uid), 1);
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
       this.familyMembers.findIndex(ele => ele.uid === user.uid) === -1 && user.uid !== this.userProfile.uid).slice(0, 10),
    ),
  );
  nameEmailUidSearch:OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map((term) =>
      term.length < 2 ? [] : this.userList.filter((user) => 
      ((user.firstName+' '+user.lastName).toLowerCase().indexOf(term.toLowerCase()) > -1 || user.email.toLowerCase().indexOf(term.toLowerCase()) > -1) || user.uid === term).slice(0, 10),
    ),
  );
  get roles() {
    return this.rolesForm.get('roles') as FormArray;
  }
  addRole() {
    this.roles.push(this.fb.control(''));
  }
  resetRoleForm() {
    this.roles.clear();
    this.roles.push(this.fb.control(''));
    this.rolesForm.reset();
  }
  onRoleSubmit(remove?: boolean) {
    let value = this.rolesForm.value;
    if(this.rolesForm.valid) {
      if(remove) {
        value.roles = [...new Set(value.roles.filter((role) => Roles.includes(role) && value.user.roles.includes(role)))];
        if(value.roles.length !== 0 ) {
          this.userProfile.roles = this.userProfile.roles.filter((role) => !value.roles.includes(role));
          this.user.updateUser(value.user.uid, {roles: arrayRemove(...value.roles)})
        }
      } else {
        value.roles = [...new Set(value.roles.filter((role) => Roles.includes(role) && !value.user.roles.includes(role)))];
        if(value.roles.length !== 0 ) {
          this.userProfile.roles.push(...value.roles);
          this.user.updateUser(value.user.uid, {roles: arrayUnion(...value.roles)})
        }
      }
      this.alertMessage = undefined;
    } else {
      this.alertMessage = 'Submitted Roles/User are not valid!';
    }
    
    console.log(value);
    this.resetRoleForm();
  }
  async leaveFamily() {
    if(this.userProfile.familyId) {
      if(this.familyMembers.length > 0) {
        //remove from family
        await this.user.removeFamilyMember(this.userProfile.familyId,this.userProfile.uid);
      } else {
        //no one else in family, delete it
        await this.user.deleteFamily(this.userProfile.familyId);
      }
      //update family on user
      this.familyMembers = [];
      this.userProfile.familyId = '';
      await this.user.updateUser(this.userProfile.uid,{familyId: ''});
    }
  }
  async addFamilyMember() {
    if(this.member.familyId) {
      // member has family, ask to merge or give advice to tell other member to clear his family
      var myModal = new bootstrap.Modal(document.getElementById('familyExistsModal'), {});
      myModal.show();
      this.member = undefined;
      return;
    }
      // member has no family, just add'em to yours!
    if(this.userProfile.familyId) {
      //if family already exists
      await this.user.addFamilyMember(this.userProfile.familyId, this.member.uid);
      await this.user.updateUser(this.member.uid, {familyId:this.userProfile.familyId});
    } else {
      //create new family
      let family: Family = {members: [this.userProfile.uid,this.member.uid]};
      let familyId = await this.user.createFamily(family);
      this.userProfile.familyId = familyId;
      let updates = [
        {uid: this.userProfile.uid, updates: {familyId: familyId}},
        {uid: this.member.uid, updates: {familyId: familyId}},
      ]
      await this.user.batchUpdateUser(updates);
    }
    //update UI
    this.familyMembers = await this.user.getFamilyMembers(this.userProfile.familyId);
    this.familyMembers.splice(this.familyMembers.findIndex(user => user.uid === this.userProfile.uid), 1);
    this.member = undefined;
  }
  async saveProfile() {
    await updateProfile(this.auth.getUser(), {displayName: this.userProfile.firstName + ' ' + this.userProfile.lastName, photoURL: this.userProfile.photoUrl});
    this.auth.reload();
  }
}
