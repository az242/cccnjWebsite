import { Injectable, inject } from '@angular/core';
import { Auth, User, signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc } from '@angular/fire/firestore';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { userConverter } from '../common/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private user: User;
  private userProfile;
  firestore: Firestore = inject(Firestore);
  userCollection = collection(this.firestore, 'users').withConverter(userConverter);
  loginEvent: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);
  constructor(private cookieService: CookieService) {
    this.auth.onAuthStateChanged(async(event)=> {
      if(event) {
        const docRef = doc(this.userCollection, event.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.userProfile = docSnap.data();
        }
      }
      this.user = event;
      this.loginEvent.next(this.user);
    });
    // this.auth.onIdTokenChanged((event)=> {
    //   this.user = event;
    //   this.loginEvent.next(this.user);
    // });
    
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
  async register(email, password): Promise<any> {
    return await createUserWithEmailAndPassword(this.auth,email,password).catch((error)=>{console.log(error)});
  }
  logout() {
    this.user = undefined;
    this.userProfile = undefined;
    this.loginEvent.next(undefined);
    this.auth.signOut();
  }
  getUserProfile() {
    return this.userProfile;
  }
  getUserRoles() {
    return this.userProfile?.roles ? this.userProfile.roles : [];
  }
  getUser() {
    return this.user;
  }
  getUID() {
    return this.user?.uid;
  }
  async reload() {
    await this.auth.currentUser.reload();
    this.user = this.auth.currentUser;
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
