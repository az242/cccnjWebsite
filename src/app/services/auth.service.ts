import { Injectable, inject } from '@angular/core';
import { Auth, User, signInWithEmailAndPassword, sendPasswordResetEmail } from '@angular/fire/auth';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private user: User;
  loginEvent: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);
  constructor(private cookieService: CookieService) {
    this.auth.onAuthStateChanged((event)=>{
      this.user = event;
      this.loginEvent.next(this.user);
      // console.log(this.user);
    });
  }
  async login(email, password, rememberMe?): Promise<any> {
    if(rememberMe) {
      localStorage.setItem('cccnj-login-email', email);
    } else {
      localStorage.removeItem('cccnj-login-email');
    }
    return await signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        this.user = userCredential.user;
        this.loginEvent.next(this.user);
        return true;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        return {errorCode, errorMessage};
      });
  }
  logout() {
    this.user = undefined;
    this.loginEvent.next(undefined);
    this.auth.signOut();
  }
  async sendPasswordResetEmail(email) {
    try {
      await sendPasswordResetEmail(this.auth,email);
      return true;
    } catch (error) {
      return error;
    }
  }
  isLoggedIn() {
    return this.user !== undefined;
  }
}
