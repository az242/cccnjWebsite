import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Event, RecurranceRule } from 'src/app/common/event.model';
import * as bootstrap from 'bootstrap';
import { Ages, Groups, Roles, User } from 'src/app/common/user.model';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { DbService } from 'src/app/services/db.service';
import { CloudService } from 'src/app/services/cloud.service';
import { dateOrderValidator, requireAtLeastOne } from 'src/app/utilities/form.util';
@Component({
  selector: 'create-event-modal',
  templateUrl: './create-event-modal.component.html',
  styleUrls: ['./create-event-modal.component.scss']
})
export class CreateEventModalComponent implements OnInit, OnChanges {
  @Input() user: User;
  @Input() userList;
  selectedFile: File | null = null;
  now = new Date();
  time;
  recurranceEnabled: boolean = false;
  minDate = { year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate() };
  eventForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    location: ['', [Validators.required, Validators.maxLength(50)]],
    photoUrl: [''],
    startDate: [undefined as any, Validators.required],
    recurrence: this.fb.group({
      endDate: [undefined as any],
      interval: [0],
      exceptionDates: [[] as Date[]]
    }),
    forWho: ['', [Validators.required, Validators.maxLength(50)]],
    desc: ['', Validators.required],
    shortDesc: ['', [Validators.required,Validators.maxLength(150)]],
    visibility: this.fb.array([
      this.fb.control('')
    ]),
    owner: this.fb.array([
      this.fb.control(undefined)
    ], [requireAtLeastOne])
  }, {validators: dateOrderValidator});
  constructor(private db: DbService,private fb: FormBuilder, private cloud: CloudService) {
  }
  ngOnChanges(changes) {
    if(this.user?.roles) {
      this.resetForm();
    }
  }
  ngOnInit() {
    const myModalEl = document.getElementById('createEventModal');
    myModalEl.addEventListener('hidden.bs.modal', event => {
      this.resetForm();
    })
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
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
  get owner() {
    return this.eventForm.get('owner') as FormArray;
  }
  get visibility() {
    return this.eventForm.get('visibility') as FormArray;
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
    this.time = undefined;
    this.recurranceEnabled = false;
    this.eventForm.reset();
    this.visibility.clear();
    let roles = this.user.roles.filter(role => !Roles.includes(role));
    if(roles.some(role => {return Ages.includes(role) || Groups.includes(role)})) {
      for(let role of roles) {
        this.visibility.push(this.fb.control(role));
      }
    } else {
      this.visibility.push(this.fb.control(''));
    }
    this.selectedFile = null;
    this.owner.clear();
    this.owner.push(this.fb.control(this.user));
  }
  get exceptionDates() {
    return this.eventForm.get('recurrence').get('exceptionDates').value ? this.eventForm.get('recurrence').get('exceptionDates').value : [];
  }
  set exceptionDates(value: Date[]) {
    this.eventForm.get('recurrence').get('exceptionDates').setValue(value);
  }
  isSelected = (ngbDate: NgbDate) => {
    let date = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    return this.exceptionDates.find(ele => ele.getTime() === date.getTime()) !== undefined;
  };
  selectOne(ngbDate: NgbDate) {
    let date = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    if (this.exceptionDates.find(ele => ele.getTime() === date.getTime())) {
      this.exceptionDates = this.exceptionDates.filter((ele) => ele.getTime() !== date.getTime());
    } else {
      let array = this.exceptionDates;
      array.push(date);
      this.exceptionDates = array;
    }
  }
  get efc() { return this.eventForm.controls; }
  get rfc() {return this.eventForm.controls.recurrence.controls}
  async _onSubmit() {
    if (this.eventForm.valid) {
      let event = new Event();
      let value = this.eventForm.value;
      event.name = value.name;
      event.location = value.location;
      event.photoUrl = value.photoUrl;
      event.startDate = value.startDate;
      event.startDate.setHours(this.time.hour);
      event.startDate.setMinutes(this.time.minute);
      event.recurrence = value.recurrence as RecurranceRule;
      if (value.recurrence && value.recurrence.endDate && value.recurrence.interval > 0) {
        event.recurrence = { endDate: value.recurrence.endDate, interval: value.recurrence.interval, exceptionDates: value.recurrence.exceptionDates };
      } else {
        event.recurrence = null;
      }
      event.forWho = value.forWho;
      event.desc = value.desc;
      event.shortDesc = value.shortDesc;
      event.visibility = [...new Set(value.visibility.filter((role) => Roles.includes(role) || Ages.includes(role)))];
      event.attendees = [];
      event.owners = value.owner.map(user=> {return user.uid});
      let id = await this.db.createEvent(event);
      let photoUrl = await this.cloud.uploadPhotoPic('events',id,this.selectedFile);
      await this.db.updateEvent(id, {photoUrl: photoUrl});
    }
  }
}
