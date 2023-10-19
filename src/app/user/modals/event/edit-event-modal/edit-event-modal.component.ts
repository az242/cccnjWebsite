import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Ages, Groups, Roles, User } from 'src/app/common/user.model';
import { CloudService } from 'src/app/services/cloud.service';
import { DbService } from 'src/app/services/db.service';
import { requireAtLeastOne } from 'src/app/utilities/form.util';
import { Event, RecurranceRule } from 'src/app/common/event.model';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'edit-event-modal',
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
  constructor(private db: DbService,private fb: FormBuilder, private cloud: CloudService, private auth: AuthService) {
  }
  ngOnChanges(changes) {
  }
  async ngOnInit() {
    
    if(this.auth.getUserProfile().roles.includes('event')) {
      let userId = this.auth.getUID();
      this.eventList = await this.db.getEventsByOwner(userId);
      console.log(this.eventList);
    }
    const myModalEl = document.getElementById('editEventModal');
    myModalEl.addEventListener('hidden.bs.modal', event => {
      this.resetForm();
    })
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  selectEvent() {
    if(this.event) {
      this.initForm(this.event);
    }
    
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
  get efc() { return this.eventForm?.controls; }
  get rfc() {return this.eventForm?.controls.recurrence.controls}
  initForm(event) {
    let recurranceGroup;
    if(event.recurrence) {
      recurranceGroup = this.fb.group({
        endDate: [event.recurrence.endDate],
        interval: [event.recurrence.interval],
        exceptionDates: [event.recurrence.exceptionDates]
      });
      this.recurranceEnabled = true;
    } else {
      recurranceGroup = this.fb.group({
        endDate: [undefined as any],
        interval: [0],
        exceptionDates: [[] as Date[]]
      });
      this.recurranceEnabled = false;
    }
    let visibArray = this.fb.array([
    ]);
    for(let role of event.visibility) {
      visibArray.push(this.fb.control(role));
    }
    let ownerArray = this.fb.array([
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
    this.time = {hour: event.startDate.getHours(), minute: event.startDate.getMinutes()}
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
      let updates: any = {};
      let event = new Event();
      let value = this.eventForm.value;
      if(value.name !== this.event.name) {
        updates.name = value.name;
      }
      if(value.location !== this.event.location) {
        updates.location = value.location;
      }
      let tempStart = value.startDate;
      tempStart.setHours(this.time.hour);
      tempStart.setMinutes(this.time.minute);
      if(value.startDate.getTime() !== this.event.startDate.getTime()) {
        updates.startDate = value.startDate;
      }
      if(this.recurranceEnabled) {
        updates.recurrence = { endDate: value.recurrence.endDate, interval: value.recurrence.interval, exceptionDates: value.recurrence.exceptionDates };
      } else {
        updates.recurrence = null;
      }
      if(value.forWho !== this.event.forWho) {
        updates.forWho = value.forWho;
      }
      if(value.desc !== this.event.desc) {
        updates.desc = value.desc;
      }
      if(value.shortDesc !== this.event.shortDesc) {
        updates.shortDesc = value.shortDesc;
      }
      let rawvisib = [...new Set(value.visibility.filter((role: string) => Roles.includes(role) || Ages.includes(role)))] as string[];
      let visibilityDiff = this.event.visibility.filter(visib=>{
        if(rawvisib.includes(visib) === undefined) {
          return true;
        } else {
          return false;
        }
      });
      if(visibilityDiff.length > 0) {
        updates.visibility = rawvisib;
      }
      let rawowner = value.owner.map(user=> {return user.uid});
      let ownerDiff = this.event.owners.filter(ownerId=>{
        if(rawowner.includes(ownerId) === undefined) {
          return true;
        } else {
          return false;
        }
      });
      if(ownerDiff.length > 0) {
        updates.owners = rawowner;
      }
      event.attendees = [];
      let id = this.event.uid;
      if(this.selectedFile) {
        let photoUrl = await this.cloud.uploadPhotoPic('events',id,this.selectedFile);
        updates.photoUrl = photoUrl;
      }
      console.log(updates);
      await this.db.updateEvent(id, updates);
    }
  }
}
