import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

  constructor(private authService :  AuthService){}

  intercept(request : HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    if(authToken){
      const authRequest = request.clone({
        headers : request.headers.set("Authorization", authToken)
      });
      return next.handle(authRequest);
    }
    return next.handle(request);

  }
}
