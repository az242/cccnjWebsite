import { Component, OnInit } from '@angular/core';
import { Group } from '../common/group.model';
import { DbService } from '../services/db.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { FooterComponent } from '../common/footer/footer.component';
import { TileThreeComponent } from '../common/tiles/tile-three/tile-three.component';

@Component({
  selector: 'app-groups-page',
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.scss'],
  imports: [FooterComponent, TileThreeComponent]
})
export class GroupsPageComponent  implements OnInit{
  groups: Group[] = [];
  displayGroups: Group[] = [];
  isLoading: boolean = false;
  constructor(private db: DbService, private router: Router, private fb: FormBuilder) {}
  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.groups = await this.db.getGroups(50);
    this.isLoading = false;
    this.displayGroups = this.groups;
  }
}
