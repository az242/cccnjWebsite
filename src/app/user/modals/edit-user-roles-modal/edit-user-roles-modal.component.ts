import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Ages, AllRoles, Groups, Roles, User } from '../../../common/user.model';
import { DbService } from 'src/app/services/db.service';
import { arrayRemove, arrayUnion } from '@angular/fire/firestore';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'edit-user-roles-modal',
  templateUrl: './edit-user-roles-modal.component.html',
  styleUrls: ['./edit-user-roles-modal.component.scss'],
  imports: [NgSelectComponent, ReactiveFormsModule]
})
export class EditUserRolesModalComponent implements OnInit{
  @Input() userList;
  rolesForm = this.fb.group({
    users: [],
    roles: []
  });
  allRoles = AllRoles;
  constructor(private db: DbService,private fb: FormBuilder) {}
  ngOnInit() {
    const myModalEl = document.getElementById('userRolesModal')
    myModalEl.addEventListener('hidden.bs.modal', event => {
      this.resetRoleForm();
    })
  }
  resetRoleForm() {
    this.rolesForm.reset();
  }
  onRoleSubmit(remove?: boolean) {
    let value:any = this.rolesForm.value;
    value.remove = remove;
    console.log(value);
    if(this.rolesForm.valid) {
      value.roles = [...new Set(value.roles.filter((role) => this.roleExists(role)))];
      for(let user of value.users) {
        if(user && user.uid) {
          if(remove) {
            let roles = value.roles.filter((role)=> user.roles.includes(role));
            if(roles.length !== 0 ) {
              this.db.updateUser(user.uid, {roles: arrayRemove(...roles)})
            }
          } else {
            let roles = value.roles.filter((role)=> !user.roles.includes(role));
            if(roles.length !== 0 ) {
              this.db.updateUser(user.uid, {roles: arrayUnion(...roles)})
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
