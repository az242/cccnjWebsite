import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPageComponent {
  email: string;
  password: string;
  alertMessage: string;
  constructor(private router: Router) {}
  register() {

  }
  route(path) {
    this.router.navigate([path],{queryParamsHandling: 'merge'});
  }
}
