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
  titles = ['Welcome to CCCNJ!', '歡迎來到主恩堂'];
  constructor(private router: Router) { 
    this.currentDescription = 0;
  }

  ngOnInit(): void {
    const observer = new IntersectionObserver(entries => {
      // Loop over the entries
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          (<HTMLElement>(entry.target)).style.transition = 'opacity 1s cubic-bezier(0.5, 0, 0, 1) ' + index*.3 + 's, transform 1s cubic-bezier(0.5, 0, 0, 1) ' + index*.3 + 's';
          (<HTMLElement>(entry.target)).style.transform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';
          (<HTMLElement>(entry.target)).style.opacity = '1';
          return; // if we added the class, exit the function
        }
        // We're not intersecting, so remove the class!
        (<HTMLElement>(entry.target)).style.transition = '';
        (<HTMLElement>(entry.target)).style.opacity = '';
        (<HTMLElement>(entry.target)).style.transform = '';
      });
    });
    let stuff = document.querySelectorAll<HTMLElement>('.slidein-container');
    stuff.forEach(element => observer.observe(element));
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
  click(test) {
    console.log(test);
  }

}
