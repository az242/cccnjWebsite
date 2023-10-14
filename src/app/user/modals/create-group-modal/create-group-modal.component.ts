import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Group } from 'src/app/common/group.model';
import { Ages, Groups, Roles, User } from 'src/app/common/user.model';
import { requireAtLeastOne } from 'src/app/utilities/modal-tools.util';

@Component({
  selector: 'create-group-modal',
  templateUrl: './create-group-modal.component.html',
  styleUrls: ['./create-group-modal.component.scss']
})
export class CreateGroupModalComponent implements OnInit, OnChanges{
  @Output() onSubmit = new EventEmitter<Group>();
  @Input() user: User;
  @Input() userList;
  groupForm = this.fb.group({
    name: ['', Validators.required],
    location: ['', Validators.required],
    when: ['', Validators.required],
    photoUrl: [''],
    forWho: [''],
    desc: ['', Validators.required],
    shortDesc: [''],
    visibility: this.fb.array([
      this.fb.control('')
    ]),
    owner: this.fb.array([
      this.fb.control(undefined)
    ], requireAtLeastOne)
  });
  constructor(private fb: FormBuilder) {
  }
  ngOnChanges(changes) {
    if(this.user.roles) {
      this.resetForm();
    }
  }
  ngOnInit() {
    const myModalEl = document.getElementById('createGroupModal');
    myModalEl.addEventListener('hidden.bs.modal', event => {
      this.resetForm();
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
  userFormatter = (result) => result.firstName + ' ' + result.lastName + ' ' + result.email;
  get owner() {
    return this.groupForm.get('owner') as FormArray;
  }
  get visibility() {
    return this.groupForm.get('visibility') as FormArray;
  }
  addVisibility() {
    this.visibility.push(this.fb.control(''));
  }
  addOwner() {
    this.owner.push(this.fb.control(undefined));
  }
  removeVis(index) {
    this.visibility.removeAt(index);
  }
  removeOwner(index) {
    this.owner.removeAt(index);
  }
  resetForm() {
    this.groupForm.reset();
    this.visibility.clear();
    let roles = this.user.roles.filter(role => !Roles.includes(role));
    if(roles.some(role => {return Ages.includes(role) || Groups.includes(role)})) {
      for(let role of roles) {
        this.visibility.push(this.fb.control(role));
      }
    } else {
      this.visibility.push(this.fb.control(''));
    }
    this.owner.clear();
    this.owner.push(this.fb.control(this.user));
  }
  _onSubmit() {
    if (this.groupForm.valid) {
      let group = new Group();
      let value = this.groupForm.value;
      group.name = value.name;
      group.location = value.location;
      group.photoUrl = value.photoUrl;
      group.forWho = value.forWho;
      group.when = value.when;
      group.desc = value.desc;
      group.shortDesc = value.shortDesc;
      group.visibility = [...new Set(value.visibility.filter((role) => Roles.includes(role) || Ages.includes(role)))];
      group.attendees = [];
      group.owners = value.owner.map(user=> {return user.uid});
      this.onSubmit.emit(group);
    } else {
      this.onSubmit.emit(undefined);
    }
  }
}
