import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DbService } from '../../services/db.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, combineLatest, debounceTime, takeUntil } from 'rxjs';
import { FooterComponent } from 'src/app/common/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  imports: [FooterComponent, FormsModule, NgClass]
})
export class LoginPageComponent implements OnInit, OnDestroy {
  email: string;
  password: string;
  rememberMe: boolean;
  alertMessage: string;
  forwardUrl: string;
  destroy: Subject<void> = new Subject();
  constructor(private auth: AuthService, private user: DbService, private router: Router, private activedRoute: ActivatedRoute) {}
  ngOnDestroy(): void {
    this.destroy.next();
    // Don't forget to unsubscribe from subject itself
    this.destroy.unsubscribe();
  }
  ngOnInit(): void {
    combineLatest([this.activedRoute.queryParams, this.auth.loginEvent]).pipe(takeUntil(this.destroy.asObservable()), debounceTime(200)).subscribe((result)=> {
      if(result[0]) {
        this.forwardUrl = result[0]['path'];
      }
      if(result[1]) {
        if(this.forwardUrl) {
          console.log('Routing from Login to ' + this.forwardUrl);
          this.router.navigate([this.forwardUrl]);
        } else {
          console.log('Routing from Login to Profile');
          this.router.navigate(['profile']);
        }
      }
    });
    
    let rememberMeStorage = localStorage.getItem('cccnj-login-email');
    if(rememberMeStorage) {
      this.email = rememberMeStorage;
      this.rememberMe = true;
    } else {
      this.rememberMe = false;
    }
  }
  route(path) {
    this.router.navigate([path],{queryParamsHandling: 'merge'});
  }
  async login(event) {
    let results = await this.auth.login(this.email, this.password, this.rememberMe);
    if(results === true) {
      this.alertMessage = undefined;
    } else if(results.errorCode) {
      this.alertMessage = 'Something went wrong! Try again later.';
    }
  }
  
}
