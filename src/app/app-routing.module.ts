import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitPageComponent } from './visit-page/visit-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { EventsPageComponent } from './events-page/events-page.component';
import { WatchPageComponent } from './watch-page/watch-page.component';

const routes: Routes = [
  { path: 'visit', component: VisitPageComponent},
  { path: 'events', component: EventsPageComponent},
  { path: 'watch', component: WatchPageComponent},
  // { path: 'visit', component: VisitPageComponent},
  // { path: '*', component: LandingPageComponent},
  { path: '**', component: LandingPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
