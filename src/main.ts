import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './app/utilities/auth.interceptor';
import { NgbDateParserFormatter, NgbDateAdapter, NgbDateNativeAdapter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from './app/utilities/ngDateParser.util';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppComponent } from './app/app.component';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, NgbModule, TranslateModule.forRoot({ defaultLanguage: 'en' }), NgSelectModule),
        // Register the AuthInterceptor as an interceptor
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
        [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }],
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(), provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage())
    ]
}).catch(err => console.error(err));
