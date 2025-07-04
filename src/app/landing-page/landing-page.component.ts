import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, EnvironmentInjector, OnInit, Renderer2, ViewChild, ViewContainerRef, createComponent } from '@angular/core';
import { Router } from '@angular/router';
import { TileOneComponent } from '../common/tiles/tile-one/tile-one.component';
import { Event } from '../common/event.model';
import { DbService } from '../services/db.service';
import { FooterComponent } from '../common/footer/footer.component';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
    imports: [FooterComponent, TranslatePipe]
})
export class LandingPageComponent implements OnInit, AfterViewInit {
    @ViewChild('eventContainer', { read: ViewContainerRef }) eventContainer: ViewContainerRef;
    noEvents: boolean = false;
    constructor(private environmentInjector: EnvironmentInjector, private router: Router, private db: DbService, private renderer: Renderer2) {
    }
    ngOnInit(): void {
        // throw new Error('Method not implemented.');
    }

    async ngAfterViewInit(): Promise<void> {
        await this.addTiles();
        const observer = new IntersectionObserver(entries => {
            // Loop over the entries
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    (<HTMLElement>(entry.target)).style.transition = 'opacity 1s cubic-bezier(0.5, 0, 0, 1) ' + index * .3 + 's, transform 1s cubic-bezier(0.5, 0, 0, 1) ' + index * .3 + 's';
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
                    (<HTMLElement>(entry.target)).style.transition = 'opacity 1s cubic-bezier(0.5, 0, 0, 1) ' + index * .1 + 's, transform 1s cubic-bezier(0.5, 0, 0, 1) ' + index * .1 + 's';
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

    async addTiles() {
        let events: Event[] = await this.db.getEventsByStartDate(new Date(), 4);
        for (let event of events) {
            let temp = createComponent(TileOneComponent, { environmentInjector: this.environmentInjector });
            temp.instance.event = event;
            temp.location.nativeElement.className = "slidein-container-short";
            this.eventContainer.insert(temp.hostView);
        }
        if (events.length === 0) {
            this.noEvents = true;
        } else {
            this.noEvents = false;
        }
    }
    arrowClick() {
        document.querySelector('.very-dark-bg').scrollIntoView({ behavior: 'smooth' });
    }
    click(test) {
        console.log(test);
    }
    route(path, event) {
        event.preventDefault();
        this.router.navigate([path]);
    }

}
