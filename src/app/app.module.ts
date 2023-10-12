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
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VisitPageComponent } from './visit-page/visit-page.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { TileOneComponent } from './common/event-tiles/tile-one/tile-one.component';
import { TileTwoComponent } from './common/event-tiles/tile-two/tile-two.component';
import { EventsPageComponent } from './events-page/events-page.component';
import { WatchPageComponent } from './watch-page/watch-page.component';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './utilities/auth.interceptor';
import { ProfilePageComponent } from './user/profile-page/profile-page.component';
import { ForgottenPasswordPageComponent } from './login/forgotten-password-page/forgotten-password-page.component';
import { SignUpPageComponent } from './login/sign-up-page/sign-up-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { CustomDateParserFormatter } from './utilities/ngDateParser.util';
import { GroupsPageComponent } from './groups-page/groups-page.component';
import { GivePageComponent } from './give-page/give-page.component';
import { CreateEventModalComponent } from './user/modals/create-event-modal/create-event-modal.component';
import { EditUserRolesModalComponent } from './user/modals/edit-user-roles-modal/edit-user-roles-modal.component';
import { AddFamilyMemberModalComponent } from './user/modals/add-family-member-modal/add-family-member-modal.component';
import { LeaveFamilyModalComponent } from './user/modals/leave-family-modal/leave-family-modal.component';

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
    ProfilePageComponent,
    ForgottenPasswordPageComponent,
    SignUpPageComponent,
    NotFoundPageComponent,
    GroupsPageComponent,
    GivePageComponent,
    CreateEventModalComponent,
    EditUserRolesModalComponent,
    AddFamilyMemberModalComponent,
    LeaveFamilyModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    NgbModule
  ],
  providers: [
    // Register the AuthInterceptor as an interceptor
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
