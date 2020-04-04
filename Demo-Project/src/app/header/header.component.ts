import { Component, OnInit, OnDestroy } from "@angular/core"
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl : "./header.component.html",
  selector : "app-header",
  styleUrls :["header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy{

  public authListenerSub : Subscription;

  public userAuthStatus = false;

  constructor(public authService : AuthService){}

  ngOnInit(): void {
    this.userAuthStatus = this.authService.getIsAuthenticated();
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe(authStatus =>{
      this.userAuthStatus = authStatus;
    });
  }

  onLogout(){
    this.userAuthStatus = false;
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
  }
}
