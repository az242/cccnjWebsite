import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Ages, Groups, Roles, User } from 'src/app/common/user.model';
import { CloudService } from 'src/app/services/cloud.service';
import { DbService } from 'src/app/services/db.service';
import { requireAtLeastOne } from 'src/app/utilities/form.util';
import { Event, RecurranceRule } from 'src/app/common/event.model';
@Component({
  selector: 'app-edit-event-modal',
  templateUrl: './edit-event-modal.component.html',
  styleUrls: ['./edit-event-modal.component.scss']
})
export class EditEventModalComponent {
  @Input() userList: User[];
  eventList: Event[];
  event: Event;
  selectedFile: File | null = null;
  now = new Date();
  time;
  recurranceEnabled: boolean = false;
  minDate = { year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate() };
  eventForm;
  constructor(private db: DbService,private fb: FormBuilder, private cloud: CloudService) {
  }
  ngOnChanges(changes) {
  }
  ngOnInit() {
    const myModalEl = document.getElementById('editEventModal');
    myModalEl.addEventListener('hidden.bs.modal', event => {
      this.resetForm();
    })
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  eventNameUidSearch:OperatorFunction<string, readonly Event[]> = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map((term) =>
      term.length < 2 ? [] : this.eventList.filter((event) => 
      (event.name.toLowerCase().indexOf(term.toLowerCase()) > -1 || event.uid.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10),
    ),
  );
  eventFormatter = (result) => result.name + ' ' + result.uid;
  userNameEmailUidSearch:OperatorFunction<string, readonly User[]> = (text$: Observable<string>) =>
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
    this.eventForm = undefined;
    this.recurranceEnabled = false;
    this.selectedFile = null;
  }
  initForm(event) {
    let recurranceGroup;
    if(event.recurrence) {
      recurranceGroup = this.fb.group({
        endDate: [event.recurrence.endDate],
        interval: [event.recurrence.interval],
        exceptionDates: [event.recurrence.exceptionDates]
      })
    } else {
      recurranceGroup = null;
    }
    let visibArray = this.fb.array([
    ]);
    for(let role of event.visibility) {
      visibArray.push(this.fb.control(role));
    }
    let ownerArray = this.fb.array([
      this.fb.control(undefined)
    ]);
    for(let owner of event.owners) {
      ownerArray.push(this.fb.control(this.userList.find((user)=> user.uid === owner)));
    }
    this.eventForm = this.fb.group({
      name: [event.name, Validators.required],
      location: [event.location, Validators.required],
      startDate: [event.startDate, Validators.required],
      recurrence: recurranceGroup,
      forWho: [event.forWho],
      desc: [event.desc, Validators.required],
      shortDesc: [event.shortDesc],
      visibility: visibArray,
      owner: ownerArray
    });
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
        event.recurrence = undefined;
      }
      event.forWho = value.forWho;
      event.desc = value.desc;
      event.shortDesc = value.shortDesc;
      event.visibility = [...new Set(value.visibility.filter((role: string) => Roles.includes(role) || Ages.includes(role)))] as string[];
      event.attendees = [];
      event.owners = value.owner.map(user=> {return user.uid});
      let id = await this.db.createEvent(event);
      let photoUrl = await this.cloud.uploadPhotoPic('events',id,this.selectedFile);
      await this.db.updateEvent(id, {photoUrl: photoUrl});
    }
  }
}
