import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../auth.model';
import { AuthService } from '../auth.service';

@Component({
  templateUrl : "./signup.component.html",
  styleUrls :["signup.component.css"]
})
export class SignupComponent{

  constructor(public authService : AuthService){}

  onSignup(form : NgForm){
    if(form.invalid){
      return;
    }
    const userData : User = {
      email : form.value.email,
      password : form.value.password,
      name : form.value.name
    }
    this.authService.createUser(userData);

  }

}
