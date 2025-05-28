import { Component, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DbService } from './services/db.service';
// import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoading: boolean = false;
  constructor(private translate: TranslateService, private db: DbService) {
  }
  async ngOnInit(): Promise<void> {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.isLoading = true;
    this.translate.setDefaultLang('en');
    let translations = await this.db.getTranslations();
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    for (let key in translations) {
      this.translate.setTranslation(key, translations[key], true);
    }
    let defaultLanguage = localStorage.getItem('cccnj-language');
    if (defaultLanguage) {
      this.translate.use(defaultLanguage);
    } else {
      this.translate.use('en');
    }
    this.isLoading = false;
  }
}
