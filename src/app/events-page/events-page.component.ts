import { Component, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';
import { Router } from '@angular/router';
import { Event } from '../common/event.model';
@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.scss']
})
export class EventsPageComponent implements OnInit{
  events: Event[] = [];
  constructor(private db: DbService, private router: Router) {}
  async ngOnInit(): Promise<void> {
    this.events = await this.db.getEventsByDateRange(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  }

}
