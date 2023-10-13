import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Roles, User } from '../../../common/user.model';

@Component({
  selector: 'edit-user-roles-modal',
  templateUrl: './edit-user-roles-modal.component.html',
  styleUrls: ['./edit-user-roles-modal.component.scss']
})
export class EditUserRolesModalComponent implements OnInit{
  @Input() userList;
  @Output() onSubmit = new EventEmitter<any>();
  rolesForm = this.fb.group({
    user: [undefined as User, Validators.required],
    roles: this.fb.array([
      this.fb.control('',Validators.required)
    ])
  });
  constructor(private fb: FormBuilder) {}
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
  addRole() {
    this.roles.push(this.fb.control(''));
  }
  resetRoleForm() {
    this.roles.clear();
    this.roles.push(this.fb.control(''));
    this.rolesForm.reset();
  }
  onRoleSubmit(remove?: boolean) {
    let value:any = this.rolesForm.value;
    value.remove = remove;
    if(this.rolesForm.valid) {
      if(remove) {
        value.roles = [...new Set(value.roles.filter((role) => Roles.includes(role) && value.user.roles.includes(role)))];
        if(value.roles.length !== 0 ) {
          this.onSubmit.next(value);
        } else {
          this.onSubmit.next(undefined);
        }
      } else {
        value.roles = [...new Set(value.roles.filter((role) => Roles.includes(role) && !value.user.roles.includes(role)))];
        if(value.roles.length !== 0 ) {
          this.onSubmit.next(value);
        } else {
          this.onSubmit.next(undefined);
        }
      }
    }
    this.resetRoleForm();
  }
}
