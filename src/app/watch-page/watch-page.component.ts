import { Component, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';
import { SafePipe } from '../utilities/safeUrl.pipe';

@Component({
  selector: 'app-watch-page',
  templateUrl: './watch-page.component.html',
  imports: [SafePipe],
  styleUrls: ['./watch-page.component.scss']
})
export class WatchPageComponent implements OnInit{
  watchUrl: string;
  constructor(private db: DbService) {}
  async ngOnInit(): Promise<void> {
    let data = await this.db.getWatchContent();
    this.watchUrl = data.src;
    console.log(data.src);
  }
}
