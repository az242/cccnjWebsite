import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Event, RecurranceRule } from 'src/app/common/event.model';
@Component({
  selector: 'create-event-modal',
  templateUrl: './create-event-modal.component.html',
  styleUrls: ['./create-event-modal.component.scss']
})
export class CreateEventModalComponent {
  @Output() onSubmit = new EventEmitter<Event>();
  eventForm = this.fb.group({
    name: ['',Validators.required],
    location: ['',Validators.required],
    photoUrl: [''],
    startDate: [0,Validators.required],
    recurrence: this.fb.group({
      endDate: [0],
      interval: [0],
      exceptionDates: this.fb.array([
        this.fb.control(0)
      ])
    }),
    forWho: [''],
    desc: ['',Validators.required],
    shortDesc: [''],
    public: [true,Validators.required]
  });
  constructor(private fb: FormBuilder) {}
  resetForm() {
    this.exceptionDates.clear();
    this.exceptionDates.push(this.fb.control(0));
    this.eventForm.reset();
  }
  get exceptionDates() {
    return this.eventForm.get('recurrence').get('exceptionDates') as FormArray;
  }
  addExceptionDate() {
    this.exceptionDates.push(this.fb.control(0));
  }
  _onSubmit() {
    if(this.eventForm.valid) {
      let event = new Event();
      let value = this.eventForm.value;
      event.name = value.name;
      event.location = value.location;
      event.photoUrl = value.photoUrl;
      event.startDate = value.startDate;
      event.recurrence = value.recurrence as RecurranceRule;
      event.forWho = value.forWho;
      event.desc = value.desc;
      event.shortDesc = value.shortDesc;
      event.public = value.public;
      this.onSubmit.emit(event);
    }
  }
}
