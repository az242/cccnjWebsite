import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tile-one',
  templateUrl: './tile-one.component.html',
  styleUrls: ['./tile-one.component.scss']
})
export class TileOneComponent {
  @Input() event;
}
