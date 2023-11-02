import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Ages, Groups, Roles, User } from 'src/app/common/user.model';
import { CloudService } from 'src/app/services/cloud.service';
import { DbService } from 'src/app/services/db.service';
import { requireAtLeastOne } from 'src/app/utilities/form.util';
import { Event, RecurranceRule } from 'src/app/common/event.model';
import { AuthService } from 'src/app/services/auth.service';
import * as bootstrap from 'bootstrap';
@Component({
  selector: 'edit-event-modal',
  templateUrl: './edit-event-modal.component.html',
  styleUrls: ['./edit-event-modal.component.scss']
})
export class EditEventModalComponent {
  @Output() onSubmit = new EventEmitter<any>();
  @Input() userList: User[];
  @Input() eventList: Event[];
  event: Event;
  eventUserList: User[];
  displayEvents: Event[];
  paginationMax: number = 0;
  eventPMax: number = 0;
  alertMessage: string = undefined;
  selectedFile: File | null = null;
  now = new Date();
  time;
  recurranceEnabled: boolean = false;
  minDate = { year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate() };
  eventForm;
  constructor(private db: DbService,private fb: FormBuilder, private cloud: CloudService, private auth: AuthService) {
  }
  ngOnChanges(changes) {
    if(changes.eventList) {
      this.displayEvents = changes.eventList.currentValue.slice(0,10);
      this.eventPMax = Math.ceil(changes.eventList.currentValue.length/10);
    }
    
  }
  async ngOnInit() {
    const myModalEl = document.getElementById('editEventModal');
    myModalEl.addEventListener('hidden.bs.modal', event => {
      this.resetForm();
    })
    // this.displayEvents = this.eventList.slice(0,10);
    // this.eventPMax = Math.ceil(this.eventList.length/10);
    // console.log(this.eventList);
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  selectEvent() {
    if(this.event) {
      this.initForm(this.event);
    }
  }
  selectEvent2(event) {
    this.event = event;

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
    this.eventUserList = [];
  }
  get efc() { return this.eventForm?.controls; }
  get rfc() {return this.eventForm?.controls.recurrence.controls}
  initForm(event) {
    console.log(event);
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
    ], [requireAtLeastOne]);
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
    this.time = {hour: event.startDate.getHours(), minute: event.startDate.getMinutes()};
    this.eventUserList = event.attendees.slice(0,10).map((attendeeId)=> {
      return this.userList.find((user)=>user.uid === attendeeId);
    });
    this.paginationMax = Math.ceil(event.attendees.length/10);
  }
  changeAttendeePage(index: number) {
    this.eventUserList = this.event.attendees.slice(index*10, (index*10)+10).map((attendeeId)=> {
      return this.userList.find((user)=>user.uid === attendeeId);
    });
  }
  changeEventPage(index: number) {
    this.displayEvents = this.eventList.slice(index*10, (index*10)+10);
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
  async deleteEvent() {
    try {
      await this.db.deleteEvent(this.event.uid);
      Object.assign(this.eventList, this.eventList.slice(this.eventList.findIndex((event => event.uid === this.event.uid)),1));
      var myModalEl = document.getElementById('editEventModal');
      var modal = bootstrap.Modal.getInstance(myModalEl);
      this.onSubmit.next({action: 'delete', uid: this.event.uid});
      modal.hide();
    } catch (error) {
      var modalBody = document.getElementById('editEventModalBody');
      modalBody.scrollTo({top:0,behavior:'smooth'});
      this.alertMessage = 'Error with deleting the event';
      console.log(error);
    }
  }
  async _onSubmit() {
    if (this.eventForm.valid) {
      let updates: any = {};
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
      let id = this.event.uid;
      if(this.selectedFile) {
        let photoUrl = await this.cloud.uploadPhotoPic('events',id,this.selectedFile);
        updates.photoUrl = photoUrl;
      }
      console.log(updates);
      try {
        await this.db.updateEvent(id, updates);
        var myModalEl = document.getElementById('editEventModal');
        var modal = bootstrap.Modal.getInstance(myModalEl);
        modal.hide();
      } catch (error) {
        var modalBody = document.getElementById('editEventModalBody');
        modalBody.scrollTo({top:0,behavior:'smooth'});
        this.alertMessage = 'Error with saving the event';
        console.log(error);
      }
      this.onSubmit.next({action: 'update', event: this.event});
    }
  }
}
