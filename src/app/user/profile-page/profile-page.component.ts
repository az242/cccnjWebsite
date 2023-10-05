import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {
  constructor(private auth: AuthService, private user: UserService, private router: Router) {}
  ngOnInit(): void {
    this.auth.loginEvent.subscribe((user)=> {
      if(!user) {
        this.router.navigate(['login']);
      }
    });
  }
}
