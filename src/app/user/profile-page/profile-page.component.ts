import { Component, OnDestroy, ViewChild } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import { Observable, OperatorFunction, Subject, debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs';
import { Roles, User } from 'src/app/common/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import * as bootstrap from 'bootstrap';
import { Family } from 'src/app/common/family.model';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { arrayRemove, arrayUnion } from '@angular/fire/firestore';
import { Event } from 'src/app/common/event.model';
import { Group } from 'src/app/common/group.model';
import { CloudService } from 'src/app/services/cloud.service';
import { TranslationModalComponent } from '../modals/translation-modal/translation-modal.component';
import { TileFourComponent } from 'src/app/common/tiles/tile-four/tile-four.component';
import { ViewEventModalComponent } from '../modals/event/view-event-modal/view-event-modal.component';
import { EditEventModalComponent } from '../modals/event/edit-event-modal/edit-event-modal.component';
import { CreateEventModalComponent } from '../modals/event/create-event-modal/create-event-modal.component';
import { EditProfileModalComponent } from '../modals/edit-profile-modal/edit-profile-modal.component';
import { CreateGroupModalComponent } from '../modals/group/create-group-modal/create-group-modal.component';
import { EditUserRolesModalComponent } from '../modals/edit-user-roles-modal/edit-user-roles-modal.component';
import { AddFamilyMemberModalComponent } from '../modals/family/add-family-member-modal/add-family-member-modal.component';
import { LeaveFamilyModalComponent } from '../modals/family/leave-family-modal/leave-family-modal.component';
import { FooterComponent } from 'src/app/common/footer/footer.component';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  imports: [CommonModule, TileFourComponent,
    TranslationModalComponent, 
    ViewEventModalComponent, EditEventModalComponent, CreateEventModalComponent, 
    EditProfileModalComponent, 
    CreateGroupModalComponent, 
    EditUserRolesModalComponent,
    AddFamilyMemberModalComponent, LeaveFamilyModalComponent,
    FooterComponent, 
    DatePipe,
    NgClass,
    RouterModule
  ]
})
export class ProfilePageComponent implements OnDestroy{
  userProfile: User;
  familyMembers = [];
  userList = [];
  powerUserList = [];
  alertMessage: string;
  destroy: Subject<void> = new Subject();
  groups: Group[] = [];
  pastEvents: Event[] = [];
  futureEvents: Event[] = [];
  ownedEvents: Event[] = [];
  constructor(private auth: AuthService, private db: DbService, private router: Router, private cloud: CloudService) {}
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
  async ngOnInit(): Promise<void> {
    let temp = this.auth.getUser();
    let tempUserProf = {displayName: temp.displayName, email: temp.email, created: temp.metadata.creationTime, loggedIn: temp.metadata.lastSignInTime, uid: temp.uid} as User;
    this.auth.loginEvent.pipe(takeUntil(this.destroy.asObservable())).subscribe((user)=> {
      if(!user) {
        this.router.navigate(['']);
      }
    });
    let dbUser = await this.db.getUser(this.auth.getUID());
    this.userProfile = {...dbUser, ...tempUserProf};
    if(this.userProfile.familyId) {
      console.log('getting Family');
      this.familyMembers = await this.db.getFamilyMembers(this.userProfile.familyId);
      this.familyMembers.splice(this.familyMembers.findIndex(user => user.uid === this.userProfile.uid), 1);
    }
    if(this.userProfile.roles.some(str => Roles.includes(str))) {
      console.log('getting users');
      this.userList = await this.db.getAllUsers();
      this.powerUserList = this.userList.filter(user=> user.roles.some( role => Roles.includes(role)))
    }
    if(this.userProfile.roles.includes('event')) {
      console.log('getting owned events');
      this.ownedEvents = await this.db.getEventsByOwner(this.userProfile.uid);
    }
    if(this.userProfile.events.length > 0) {
      console.log('getting events');
      let events = await this.db.getEventByIds(this.userProfile.events);
      let now = new Date();
      events.forEach(event => {
        if(event.startDate.getTime() <= now.getTime()) {
          this.pastEvents.push(event);
        } else {
          this.futureEvents.push(event);
        }
      });
    }
    if(this.userProfile.groups.length > 0) {
      console.log('getting Groups');
      this.groups = await this.db.getGroupByIds(this.userProfile.groups);
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
    console.log('Event returned: ',output);
    if(output) {
      let id = await this.db.createEvent(output);
      if(!id) {
        this.alertMessage = 'Failed to create event';
      } else {
        this.alertMessage = undefined;
      }
    }
  }
  async onGroupSubmit(output: Group) {
    console.log('Group returned: ',output);
    if(output) {
      let id = await this.db.createGroup(output);
      if(!id) {
        this.alertMessage = 'Failed to create group';
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
  updateUserProfile(updatedValues) {
    for(let key in updatedValues) {
      this.userProfile[key] = updatedValues[key];
    }
  }
}
