import { Component, Input } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { Event, RecurranceRule } from 'src/app/common/event.model';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';
@Component({
  selector: 'view-event-modal',
  templateUrl: './view-event-modal.component.html',
  styleUrls: ['./view-event-modal.component.scss']
})
export class ViewEventModalComponent {
  @Input() eventList: Event[];
  event: Event;
  constructor(private db: DbService) {
  }
  ngOnInit() {
  }
  selectEvent() {
    if(this.event) {
      //init views
      console.log(this.event);
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
}
