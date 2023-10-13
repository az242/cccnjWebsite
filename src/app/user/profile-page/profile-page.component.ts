import { Component, OnDestroy, ViewChild } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, OperatorFunction, Subject, debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs';
import { Roles, User } from 'src/app/common/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import * as bootstrap from 'bootstrap';
import { Family } from 'src/app/common/family.model';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { arrayRemove, arrayUnion } from '@angular/fire/firestore';
import { Event } from 'src/app/common/event.model';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnDestroy{
  userProfile: User;
  familyMembers = [];
  userList = [];
  alertMessage: string;
  destroy: Subject<void> = new Subject();
  constructor(private auth: AuthService, private db: DbService, private router: Router, private fb: FormBuilder) {}
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
  async ngOnInit(): Promise<void> {
    let temp = this.auth.getUser();
    this.userProfile = {displayName: temp.displayName, phone: temp.phoneNumber, email: temp.email, created: temp.metadata.creationTime, loggedIn: temp.metadata.lastSignInTime, uid: temp.uid} as User;
    this.auth.loginEvent.pipe(takeUntil(this.destroy.asObservable())).subscribe((user)=> {
      if(!user) {
        this.router.navigate(['']);
      }
    });
    let dbUser = await this.db.getUser(this.auth.getUID());
    this.userProfile = {...dbUser, ...this.userProfile};
    if(this.userProfile.familyId) {
      this.familyMembers = await this.db.getFamilyMembers(this.userProfile.familyId);
      this.familyMembers.splice(this.familyMembers.findIndex(user => user.uid === this.userProfile.uid), 1);
    }
    if(this.userProfile.roles.some(str => Roles.includes(str))) {
      this.userList = await this.db.getAllUsers();
    }
  }
  onRoleSubmit(value) {
    if(!value) {
      this.alertMessage = 'Something went wrong while trying to edit roles! Did you enter everything correctly?';
      return;
    }
    if(value.remove) {
      if(value.roles.length !== 0 ) {
        this.userProfile.roles = this.userProfile.roles.filter((role) => !value.roles.includes(role));
        this.db.updateUser(value.user.uid, {roles: arrayRemove(...value.roles)})
      }
    } else {
      if(value.roles.length !== 0 ) {
        this.userProfile.roles.push(...value.roles);
        this.db.updateUser(value.user.uid, {roles: arrayUnion(...value.roles)})
      }
    }
    this.alertMessage = undefined;
  }
  async onEventSubmit(output: Event) {
    console.log('profiule page got this',output);
    if(output) {
      let id = await this.db.createEvent(output);
      if(!id) {
        this.alertMessage = 'Failed to create event';
      } else {
        this.alertMessage = undefined;
      }
    }
  }
  async leaveFamily() {
    if(this.userProfile.familyId) {
      if(this.familyMembers.length > 1) {
        await this.db.removeFamilyMember(this.userProfile.familyId,this.userProfile.uid);
      } else {
        await this.db.deleteFamily(this.userProfile.familyId);
      }
      this.familyMembers = [];
      this.userProfile.familyId = '';
      await this.db.updateUser(this.userProfile.uid,{familyId: ''});
    }
  }
  async addFamilyMember(member) {
    if(this.userProfile.familyId) {
      await this.db.addFamilyMember(this.userProfile.familyId, member.uid);
      await this.db.updateUser(member.uid, {familyId:this.userProfile.familyId});
    } else {
      let family: Family = {members: [this.userProfile.uid,member.uid]};
      let familyId = await this.db.createFamily(family);
      this.userProfile.familyId = familyId;
      let updates = [
        {uid: this.userProfile.uid, updates: {familyId: familyId}},
        {uid: member.uid, updates: {familyId: familyId}},
      ]
      await this.db.batchUpdateUser(updates);
    }
    this.familyMembers = await this.db.getFamilyMembers(this.userProfile.familyId);
    this.familyMembers.splice(this.familyMembers.findIndex(user => user.uid === this.userProfile.uid), 1);
  }
  async saveProfile() {
    await updateProfile(this.auth.getUser(), {displayName: this.userProfile.firstName + ' ' + this.userProfile.lastName, photoURL: this.userProfile.photoUrl});
    this.auth.reload();
  }
}
