import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Group } from 'src/app/common/group.model';
import { Ages, Groups, Roles, User } from 'src/app/common/user.model';
import { CloudService } from 'src/app/services/cloud.service';
import { DbService } from 'src/app/services/db.service';
import { requireAtLeastOne } from 'src/app/utilities/form.util';

@Component({
  selector: 'create-group-modal',
  templateUrl: './create-group-modal.component.html',
  styleUrls: ['./create-group-modal.component.scss']
})
export class CreateGroupModalComponent implements OnInit, OnChanges{
  // @Output() onSubmit = new EventEmitter<Group>();
  @Input() user: User;
  @Input() userList;
  selectedFile: File | null = null;
  groupForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    location: ['', [Validators.required, Validators.maxLength(50)]],
    when: ['', [Validators.required, Validators.maxLength(50)]],
    photoUrl: [''],
    forWho: ['', [Validators.required, Validators.maxLength(50)]],
    desc: ['', Validators.required],
    shortDesc: ['', [Validators.required, Validators.maxLength(150)]],
    visibility: this.fb.array([
      this.fb.control('')
    ]),
    owner: this.fb.array([
      this.fb.control(undefined)
    ], requireAtLeastOne)
  });
  constructor(private db: DbService,private fb: FormBuilder, private cloud: CloudService) {
  }
  ngOnChanges(changes) {
    if(this.user?.roles) {
      this.resetForm();
    }
  }
  ngOnInit() {
    const myModalEl = document.getElementById('createGroupModal');
    myModalEl.addEventListener('hidden.bs.modal', event => {
      this.resetForm();
    })
  }
  get gfc() { return this.groupForm.controls; }
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
    this.selectedFile = null;
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
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  async _onSubmit() {
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
      let id = await this.db.createGroup(group);
      let photoUrl = await this.cloud.uploadPhotoPic('groups',id,this.selectedFile);
      await this.db.updateGroup(id, {photoUrl: photoUrl});
    }
  }
}
