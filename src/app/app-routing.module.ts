import { NgModule, inject } from '@angular/core';
import { CanActivateFn, Router, RouterModule, Routes } from '@angular/router';
import { VisitPageComponent } from './visit-page/visit-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { EventsPageComponent } from './events-page/events-page.component';
import { WatchPageComponent } from './watch-page/watch-page.component';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { ProfilePageComponent } from './user/profile-page/profile-page.component';
import { Auth } from '@angular/fire/auth';
import { ForgottenPasswordPageComponent } from './login/forgotten-password-page/forgotten-password-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { SignUpPageComponent } from './login/sign-up-page/sign-up-page.component';
import { GroupsPageComponent } from './groups-page/groups-page.component';
import { GivePageComponent } from './give-page/give-page.component';
import { EventPageComponent } from './events-page/event-page/event-page.component';
import { GroupPageComponent } from './groups-page/group-page/group-page.component';
import { RegenPageComponent } from './groups-page/regen-page/regen-page.component';
import { MandarinPageComponent } from './groups-page/mandarin-page/mandarin-page.component';
import { TaiwanesePageComponent } from './groups-page/taiwanese-page/taiwanese-page.component';
import { YouthPageComponent } from './groups-page/youth-page/youth-page.component';
import { MinistriesPageComponent } from './ministries-page/ministries-page.component';

const loggedInGuard: CanActivateFn = (route, state) => {
  const FirebaseAuth = inject(Auth);
  const router = inject(Router);
  if(FirebaseAuth.currentUser) {
    return true;
  } else {
    let queryParams = {path: state.url};
    return router.createUrlTree(['login'], { queryParams });
  }
};
const loggedOutGuard: CanActivateFn = (route, state) => {
  const FirebaseAuth = inject(Auth);
  const router = inject(Router);
  if(FirebaseAuth.currentUser) {
    return false;
  } else {
    return true;
  }
};

const routes: Routes = [
  { path: 'registration', title:'CCCNJ - Registration', component: SignUpPageComponent},
  { path: 'profile', title:'CCCNJ - User Profile', component: ProfilePageComponent, canActivate: [loggedInGuard]},
  { path: 'forgottenpassword', title:'CCCNJ - Forgotten Password', component: ForgottenPasswordPageComponent, canActivate: [loggedOutGuard]},
  { path: 'login', title:'CCCNJ - Login', component: LoginPageComponent},
  { path: 'visit', title:'CCCNJ - Visit Us', component: VisitPageComponent},
  { path: 'events', title:'CCCNJ - Event List', component: EventsPageComponent},
  { path: 'event/:id', title:'CCCNJ Event Details', component: EventPageComponent},
  { path: 'watch', title:'CCCNJ - Watch Live', component: WatchPageComponent},
  { path: 'groups', title:'CCCNJ - Small Groups', component: GroupsPageComponent},
  { path: 'group/:id', title:'CCCNJ - Small Group Details', component: GroupPageComponent},
  { path: 'regeneration', title: 'CCCNJ - Regeneration', component: RegenPageComponent},
  { path: 'mandarin', title: 'CCCNJ - Mandarin Congregation', component: MandarinPageComponent},
  { path: 'taiwanese', title: 'CCCNJ - Taiwanese Congregation', component: TaiwanesePageComponent},
  { path: 'youth', title: 'CCCNJ - Youth Group', component: YouthPageComponent},
  { path: 'ministry', title: 'CCCNJ - Ministry Overview', component: MinistriesPageComponent},
  { path: 'give', title:'CCCNJ - Give', component: GivePageComponent},
  { path: '', title:'CCCNJ', component: LandingPageComponent},
  { path: 'not-found', title:'CCCNJ - Error Not Found', component: NotFoundPageComponent},
  { path: '**', redirectTo: '/not-found'}

];



@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration: 'top',
    paramsInheritanceStrategy: 'always'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
