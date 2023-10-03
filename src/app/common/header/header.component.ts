import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('in', style({
        opacity: 1,
        visibility: 'visible'
      })),
      state('out',   style({
        opacity: 0,
        visibility: 'hidden'
      })),
      transition('in => out', animate('100ms ease-in')),
      transition('out => in', animate('100ms ease-out'))
    ])
  ]
})
export class HeaderComponent {
  expanded: boolean = false;
  constructor(private router: Router) {
  }
  route(path, event) {
    event.preventDefault();
    this.router.navigate([path]);
  }
  click(test) {
    console.log(test);
  }
  expandNav(event) {
    event.preventDefault;
    this.expanded = !this.expanded;
  }
}
