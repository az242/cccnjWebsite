import { Component } from '@angular/core';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-watch-page',
  templateUrl: './watch-page.component.html',
  styleUrls: ['./watch-page.component.scss']
})
export class WatchPageComponent {
  watchUrl: string;
  constructor(private db: DbService) {}
  async ngOnInit(): Promise<void> {
    let data = await this.db.getWatchContent();
    this.watchUrl = data.src;
    console.log(data.src);
  }
}
