import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VisitPageComponent } from './visit-page/visit-page.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { TileOneComponent } from './common/event-tiles/tile-one/tile-one.component';
import { TileTwoComponent } from './common/event-tiles/tile-two/tile-two.component';
import { EventsPageComponent } from './events-page/events-page.component';
import { WatchPageComponent } from './watch-page/watch-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './utilities/auth.interceptor';
import { ProfilePageComponent } from './user/profile-page/profile-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    VisitPageComponent,
    HeaderComponent,
    FooterComponent,
    TileOneComponent,
    TileTwoComponent,
    EventsPageComponent,
    WatchPageComponent,
    LoginPageComponent,
    ProfilePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    NgbModule
  ],
  providers: [
    // Register the AuthInterceptor as an interceptor
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
