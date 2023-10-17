import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Ages, Groups, Roles, User } from '../../../common/user.model';
import { DbService } from 'src/app/services/db.service';
import { arrayRemove, arrayUnion } from '@angular/fire/firestore';

@Component({
  selector: 'edit-user-roles-modal',
  templateUrl: './edit-user-roles-modal.component.html',
  styleUrls: ['./edit-user-roles-modal.component.scss']
})
export class EditUserRolesModalComponent implements OnInit{
  @Input() userList;
  rolesForm = this.fb.group({
    users: this.fb.array([
      this.fb.control(undefined as User,Validators.required)
    ]),
    roles: this.fb.array([
      this.fb.control('',Validators.required)
    ])
  });
  constructor(private db: DbService,private fb: FormBuilder) {}
  ngOnInit() {
    const myModalEl = document.getElementById('userRolesModal')
    myModalEl.addEventListener('hidden.bs.modal', event => {
      this.resetRoleForm();
    })
  }
  nameEmailUidSearch:OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map((term) =>
      term.length < 2 ? [] : this.userList.filter((user) => 
      ((user.firstName+' '+user.lastName).toLowerCase().indexOf(term.toLowerCase()) > -1 || user.email.toLowerCase().indexOf(term.toLowerCase()) > -1) || user.uid === term).slice(0, 10),
    ),
  );
  formatter = (result) => result.firstName + ' ' + result.lastName + ' ' + result.email;
  get roles() {
    return this.rolesForm.get('roles') as FormArray;
  }
  get users() {
    return this.rolesForm.get('users') as FormArray;
  }
  addUser() {
    this.users.push(this.fb.control(undefined as User));
  }
  addRole() {
    this.roles.push(this.fb.control(''));
  }
  resetRoleForm() {
    this.roles.clear();
    this.roles.push(this.fb.control(''));
    this.users.clear();
    this.users.push(this.fb.control(''));
    this.rolesForm.reset();
  }
  onRoleSubmit(remove?: boolean) {
    let value:any = this.rolesForm.value;
    value.remove = remove;
    if(this.rolesForm.valid) {
      if(remove) {
        value.roles = [...new Set(value.roles.filter((role) => this.roleExists(role) && value.user.roles.includes(role)))];
      } else {
        value.roles = [...new Set(value.roles.filter((role) => this.roleExists(role) && !value.user.roles.includes(role)))];
      }
      for(let user of value.users) {
        if(user && user.uid) {
          if(remove) {
            if(value.roles.length !== 0 ) {
              this.db.updateUser(user.uid, {roles: arrayRemove(...value.roles)})
            }
          } else {
            if(value.roles.length !== 0 ) {
              this.db.updateUser(user.uid, {roles: arrayUnion(...value.roles)})
            }
          }
        }
      }
      
    }
    this.resetRoleForm();
  }
  roleExists(role) {
    return Roles.includes(role) || Ages.includes(role) || Groups.includes(role);
  }
}
