import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  animations: [
    trigger('fade', [
      state('visible', style({opacity: 1})),
      state('invisible', style({opacity: 0})),
      transition('visible => invisible', [animate('0.5s'),]),
      transition('invisible => visible', [animate('0.5s')]),
    ]),
  ],
})
export class LandingPageComponent implements OnInit {
  fadeInterval: any;
  currentDescription: number;
  state: string = 'visible';
  titles = ['Welcome to Chinese Christian Church of New Jersey', '歡迎來到主恩堂'];
  constructor(private router: Router) { 
    this.currentDescription = 0;
  }

  ngOnInit(): void {
    this.fadeInterval = setInterval(() => {
      this.setNewDescription(); 
      }, 5000);
  }
  setNewDescription() {
    this.state = 'invisible';
  }
  end(event) {
    if(event.toState === 'invisible') {
      this.currentDescription++;
      if(this.currentDescription >= this.titles.length) {
        this.currentDescription = 0;
      }
      this.state= 'visible';
    }
  }
  englishRoute() {
    this.router.navigate(['/en']);
  }
  cantoneseRoute() {
    // this.router.navigate(['/cn']);
    window.location.replace("https://cn.cccnj.org/");
  }
  mandarinRoute() {
    // this.router.navigate(['/md']);
    window.location.replace("https://cn.cccnj.org/");
  }

}
