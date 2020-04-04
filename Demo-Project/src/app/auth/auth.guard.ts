import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate{

  private isAuthenticated = false;

  constructor(private authService : AuthService , private router : Router){}

  canActivate(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
    this.isAuthenticated = this.authService.getIsAuthenticated();
    if(!this.isAuthenticated){
      this.router.navigate(["/auth/login"]);
    }
    return this.isAuthenticated;
  }

}
