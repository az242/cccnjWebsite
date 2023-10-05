import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('out',   style({
        opacity: 0,
        visibility: 'hidden'
      })),
      state('in', style({
        opacity: 1,
        visibility: 'visible'
      })),
      
      transition('in => out', animate('100ms ease-in')),
      transition('out => in', animate('100ms ease-out'))
    ])
  ]
})
export class HeaderComponent implements OnInit{
  expanded: boolean = false;
  isLoggedIn: boolean = false;
  name: string;
  constructor(private router: Router, private authService: AuthService) {
  }
  ngOnInit(): void {
    this.authService.loginEvent.subscribe((user)=> {
      if(user) {
        this.isLoggedIn = true;
        this.name = user.displayName;
      } else {
        this.name = '';
        this.isLoggedIn = false;
      }
    });
  }
  signOut() {
    this.authService.logout();
  }
  route(path, event) {
    if(event) {
      event.preventDefault();
    }
    this.router.navigate([path]);
  }
  click(test) {
    console.log(test);
  }
  expandNav(event) {
    event.preventDefault();
    this.expanded = !this.expanded;
    if(this.expanded) {
      setTimeout(()=>{document.getElementById("expandedNav").focus();},100);
    }
  }
}
