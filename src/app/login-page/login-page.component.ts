import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  email: string;
  password: string;
  rememberMe: boolean;
  alertMessage: string;
  forwardUrl: string;
  constructor(private auth: AuthService, private user: UserService, private router: Router, private activedRoute: ActivatedRoute) {}
  ngOnInit(): void {
    this.activedRoute.queryParams.subscribe((params: Params) => {
      this.forwardUrl = params['path'];
      this.auth.loginEvent.subscribe((user)=> {
        if(user) {
          console.log('trying to route');
          if(this.forwardUrl) {
            this.router.navigate([this.forwardUrl]);
          } else {
            this.router.navigate(['profile']);
          }
        }
      });
    });
    
    let rememberMeStorage = localStorage.getItem('cccnj-login-email');
    if(rememberMeStorage) {
      this.email = rememberMeStorage;
      this.rememberMe = true;
    } else {
      this.rememberMe = false;
    }
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
