import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, EnvironmentInjector, OnInit, ViewChild, ViewContainerRef, createComponent } from '@angular/core';
import { Router } from '@angular/router';
import { TileOneComponent } from '../common/event-tiles/tile-one/tile-one.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  @ViewChild('eventContainer',{ read: ViewContainerRef }) eventContainer: ViewContainerRef;
  constructor(private environmentInjector: EnvironmentInjector,private router: Router) { 
  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  ngAfterViewInit(): void {
    this.addTiles();
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
    const observer2 = new IntersectionObserver(entries => {
      // Loop over the entries
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          (<HTMLElement>(entry.target)).style.transition = 'opacity 1s cubic-bezier(0.5, 0, 0, 1) ' + index*.1 + 's, transform 1s cubic-bezier(0.5, 0, 0, 1) ' + index*.1 + 's';
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
    let stuff2 = document.querySelectorAll<HTMLElement>('.slidein-container-short');
    stuff2.forEach(element => observer2.observe(element));

    
  }

  addTiles() {
    let event = {
      date: new Date(),
      displayPhoto: 'https://granger.wpenginepowered.com/wp-content/uploads/2023/08/youngadults_OTbiblestudy_520x520.jpg',
      shortDescription: 'Short description!',
      title: 'Young Adult Small Group',
      location: 'CCCNJ',
      tags: []
    }
    let tile1 = createComponent(TileOneComponent, { environmentInjector: this.environmentInjector});
    tile1.instance.event = event;
    tile1.location.nativeElement.className="slidein-container-short";
    this.eventContainer.insert(tile1.hostView);
    let tile2 = createComponent(TileOneComponent, { environmentInjector: this.environmentInjector});
    tile2.instance.event = {date: new Date()};
    tile2.location.nativeElement.className="slidein-container-short";
    this.eventContainer.insert(tile2.hostView);
    let tile3 = createComponent(TileOneComponent, { environmentInjector: this.environmentInjector});
    tile3.instance.event = {date: new Date()};
    tile3.location.nativeElement.className="slidein-container-short";
    this.eventContainer.insert(tile3.hostView);
    let tile4 = createComponent(TileOneComponent, { environmentInjector: this.environmentInjector});
    tile4.instance.event = {date: new Date()};
    tile4.location.nativeElement.className="slidein-container-short";
    this.eventContainer.insert(tile4.hostView);
  }
  arrowClick() {
    document.querySelector('.very-dark-bg').scrollIntoView({behavior:'smooth'});
  }
  click(test) {
    console.log(test);
  }
  route(path, event) {
    event.preventDefault();
    this.router.navigate([path]);
  }

}
