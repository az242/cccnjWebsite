import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FooterComponent } from 'src/app/common/footer/footer.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgotten-password-page',
  templateUrl: './forgotten-password-page.component.html',
  styleUrls: ['./forgotten-password-page.component.scss'],
  imports: [FooterComponent, FormsModule, NgClass]
})
export class ForgottenPasswordPageComponent {
  email: string;
  alertMessage: string;
  isResetEmailSent: boolean = false;
  constructor(private auth: AuthService, private router: Router) {}
  async sendEmail() {
    let result = await this.auth.sendPasswordResetEmail(this.email);
    if(result === true) {
      this.isResetEmailSent = true;
      this.alertMessage = undefined;
    } else {
      this.isResetEmailSent = false;
      this.alertMessage = 'Something went wrong, try again later!';
    }
  }
  route(path) {
    this.router.navigate([path],{queryParamsHandling: 'merge'});
  }
}
