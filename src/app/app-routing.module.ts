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
  { path: 'registration', component: SignUpPageComponent},
  { path: 'profile', component: ProfilePageComponent, canActivate: [loggedInGuard]},
  { path: 'forgottenpassword', component: ForgottenPasswordPageComponent, canActivate: [loggedOutGuard]},
  { path: 'login', component: LoginPageComponent},
  { path: 'visit', component: VisitPageComponent},
  { path: 'events', component: EventsPageComponent},
  { path: 'watch', component: WatchPageComponent},
  { path: 'groups', component: GroupsPageComponent},
  { path: 'give', component: GivePageComponent},
  // { path: 'visit', component: VisitPageComponent},
  // { path: '*', component: LandingPageComponent},
  { path: '', component: LandingPageComponent},
  { path: 'not-found', component: NotFoundPageComponent},
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
