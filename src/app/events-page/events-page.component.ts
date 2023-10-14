import { Component, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';
import { Router } from '@angular/router';
import { Event } from '../common/event.model';
import { FormBuilder } from '@angular/forms';
import { filter, map, pairwise, startWith } from 'rxjs';
import { Ages, Groups } from '../common/user.model';
@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.scss']
})
export class EventsPageComponent implements OnInit{
  events: Event[] = [];
  displayEvents: Event[] = [];
  defaultDateRange = 30 * 24 * 60 * 60 * 1000;
  filterForm = this.fb.group({
    age: this.fb.group({
      children: [false],
      youth: [false],
      college: [false],
      adult: [false]
    }),
    group: this.fb.group({
      mandarin: [false],
      english: [false],
      taiwanese: [false]
    }),
    date: this.fb.group({
      week: [false],
      month: [false]
    })
  });
  filters = {age: [], group: []};
  constructor(private db: DbService, private router: Router, private fb: FormBuilder) {}
  async ngOnInit(): Promise<void> {
    this.events = await this.db.getEventsByDateRange(new Date(), new Date(Date.now() + this.defaultDateRange));
    this.displayEvents = this.events;
    this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.value),
      pairwise(),
      map(([oldState, newState]) => {
        let changes = {};
        for (const key in newState) {
          if (oldState[key] !== newState[key] && 
              oldState[key] !== undefined) {
            changes[key] = newState[key];
          }
        }
        return changes;
      }),
      filter(changes => Object.keys(changes).length !== 0 && !this.filterForm.invalid)
    ).subscribe( async (value: any) => {
      if(value.date) {
        //grab new events
        if(value.date.month) {
          const beginningOfMonth = new Date();
          beginningOfMonth.setDate(1);
          const endOfMonthDate = new Date(beginningOfMonth);
          endOfMonthDate.setMonth(endOfMonthDate.getMonth() + 1);
          endOfMonthDate.setDate(0);
          this.events = await this.db.getEventsByDateRange(beginningOfMonth, endOfMonthDate);
        } else if( value.date.week) {
          // Example: Get the start and end of the current week
          const currentDate = new Date();
          const startOfWeek = this.getStartOfWeek(currentDate);
          const endOfWeek = this.getEndOfWeek(currentDate);
          this.events = await this.db.getEventsByDateRange(startOfWeek, endOfWeek);
        } else {
          this.events = await this.db.getEventsByDateRange(new Date(), new Date(Date.now() + this.defaultDateRange));
        }
        
      }
      if(value.age) {
        if(value.age.adult) {
          this.filters.age.push(Ages[0]);
        } else {
          this.filters.age = this.filters.age.filter(filterString=> filterString !== Ages[0]);
        }
        if(value.age.college) {
          this.filters.age.push(Ages[1]);
        } else {
          this.filters.age = this.filters.age.filter(filterString=> filterString !== Ages[1]);
        }
        if(value.age.youth) {
          this.filters.age.push(Ages[2]);
        } else {
          this.filters.age = this.filters.age.filter(filterString=> filterString !== Ages[2]);
        }
        if(value.age.children) {
          this.filters.age.push(Ages[3]);
        } else {
          this.filters.age = this.filters.age.filter(filterString=> filterString !== Ages[3]);
        }
      }
      //export const Groups = Object.freeze(['english','taiwanese','mandarin']);
      if(value.group) {
        if(value.group.mandarin) {
          this.filters.group.push(Groups[2]);
        } else {
          this.filters.group = this.filters.group.filter(filterString=> filterString !== Groups[2]);
        }
        if(value.group.english) {
          this.filters.group.push(Groups[0]);
        } else {
          this.filters.group = this.filters.group.filter(filterString=> filterString !== Groups[0]);
        }
        if(value.group.taiwanese) {
          this.filters.group.push(Groups[1]);
        } else {
          this.filters.group = this.filters.group.filter(filterString=> filterString !== Groups[1]);
        }
      }
      this.applyFilter();
    });
  }
  getStartOfWeek(date) {
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day;
    startDate.setDate(diff);
    return startDate;
  }
  
  getEndOfWeek(date) {
    const endDate = new Date(date);
    const day = endDate.getDay();
    const diff = 6 - day;
    endDate.setDate(endDate.getDate() + diff);
    return endDate;
  }
  applyFilter() {
    this.displayEvents = this.events.filter(event => {
      if(this.filters.age.length > 0 || this.filters.group.length > 0) {
        if(this.filters.age.length > 0) {
          if(!event.visibility.some(tag => this.filters.age.includes(tag))) {
            return false;
          }
        }
        if(this.filters.group.length > 0) {
          if(event.visibility.some(tag => this.filters.group.includes(tag))) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      } else {
        return true;
      }
    });
  }
}
