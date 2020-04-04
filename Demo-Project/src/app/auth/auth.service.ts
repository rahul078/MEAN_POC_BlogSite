import { Injectable } from '@angular/core';
import { User } from './auth.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { environment } from "../../environments/environment";

const BACKEND_URL = environment.BackendURL + "/user/";

@Injectable({providedIn : "root"})
export class AuthService{

  private authToken: string;
  private isAuthenticated = false;
  private timeoutTimer : any;
  private userID : string;

  private authStatusListener =new Subject<boolean>();

  constructor(private httpClient : HttpClient, private router : Router){}

  public getUserID(){
    return this.userID;
  }

  public getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  public getIsAuthenticated(){
    return this.isAuthenticated;
  }

  public getToken(){
    return this.authToken;
  }

  private setTimeoutTimer(duration: number){
    this.timeoutTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private getAuthToken(){
    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem("expiration");
    const userID =localStorage.getItem("userID");
    if(token && expiration){
      return {
        token : token,
        expiration : new Date(expiration),
        userID : userID
      };
    }
    return;
  }

  public autoAuthUser(){
    const data = this.getAuthToken();
    const dateNow = new Date().getTime();
    const expiresIn = data.expiration.getTime() - dateNow;
    if(expiresIn > 0){
      this.authToken = data.token;
      this.isAuthenticated = true;
      this.userID = data.userID;
      this.setTimeoutTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private saveAuthToken(token: string , timeoutTimer : number, userID: string){
    const dateNow = new Date();
    const date = new Date(new Date().getTime() + (timeoutTimer * 1000));
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", date.toISOString());
    localStorage.setItem("userID",userID);
  }

  private clearAuthToken(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userID");
  }

  createUser(user : User){
    this.httpClient.post(BACKEND_URL+"signup",user).subscribe(
      responseData => {
        this.router.navigate(["/login"]);
      }
    );
  }

  loginUser(email : string, password : string){
    this.httpClient.post<{message : string,token : string, timeoutTimer : number, userID : string}>(BACKEND_URL+"login",{email :email, password : password}).subscribe(
      responseData => {
          this.authToken = responseData.token;
          if(this.authToken){
            this.userID = responseData.userID;
            this.setTimeoutTimer(responseData.timeoutTimer);
            this.isAuthenticated = true;
            this.saveAuthToken(this.authToken, responseData.timeoutTimer, responseData.userID);
            this.authStatusListener.next(true);
            this.router.navigate(["/"]);
          }
      }
    );
    console.log(this.authToken);
    this.router.navigate(["/login"]);
  }

  logout(){
    this.isAuthenticated = false;
    this.authToken = null;
    this.userID = null;
    this.authStatusListener.next(false);
    this.clearAuthToken();
    this.router.navigate(["/"]);
  }
}
