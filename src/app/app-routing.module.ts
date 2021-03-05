import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnglishPageComponent } from './english-page/english-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  { path: 'en', component: EnglishPageComponent},
  { path: '**', component: LandingPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
