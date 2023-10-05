import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, from, lastValueFrom } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private firebaseAuth: Auth = inject(Auth);
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    // let user = this.firebaseAuth.currentUser;
    return from(this.handle(request, next));
  }
  async handle(req: HttpRequest<any>, next: HttpHandler) {
    // if your getAuthToken() function declared as "async getAuthToken() {}"
    let idToken = await this.firebaseAuth.currentUser.getIdToken();
    if(idToken) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: idToken
        }
      })
      return await lastValueFrom(next.handle(authReq));
    } else {
      return await lastValueFrom(next.handle(req));
    }
  }
}
