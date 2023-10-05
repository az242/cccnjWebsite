import { NgModule, inject } from '@angular/core';
import { CanActivateFn, Router, RouterModule, Routes } from '@angular/router';
import { VisitPageComponent } from './visit-page/visit-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { EventsPageComponent } from './events-page/events-page.component';
import { WatchPageComponent } from './watch-page/watch-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ProfilePageComponent } from './user/profile-page/profile-page.component';
import { Auth } from '@angular/fire/auth';

const authGuard: CanActivateFn = (route, state) => {
  const FirebaseAuth = inject(Auth);
  const router = inject(Router);
  if(FirebaseAuth.currentUser) {
    return true;
  } else {
    let queryParams = {path: state.url};
    return router.createUrlTree(['login'], { queryParams });
  }
};

const routes: Routes = [
  { path: 'profile', component: ProfilePageComponent, canActivate: [authGuard]},
  { path: 'login', component: LoginPageComponent},
  { path: 'visit', component: VisitPageComponent},
  { path: 'events', component: EventsPageComponent},
  { path: 'watch', component: WatchPageComponent},
  // { path: 'visit', component: VisitPageComponent},
  // { path: '*', component: LandingPageComponent},
  { path: '**', component: LandingPageComponent}
];



@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration: 'top',
    paramsInheritanceStrategy: 'always'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
