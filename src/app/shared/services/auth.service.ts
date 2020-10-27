import { IfStmt, THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { UserI } from '../interfaces/UserI';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: UserI | undefined;

  constructor() { }
  
  login(emailI: string, passwordI: string) {
    const user = window.localStorage.getItem('user') || undefined;
    var isLogged=false; // user ? true : false
    if(user){
      this.user = JSON.parse(user);
      if(emailI==this.user.email&&passwordI==this.user.password){
        this.user.isLogged=true;
        window.localStorage.setItem('user',JSON.stringify(this.user));
      }
      else{
        this.user.isLogged=false;
      }
    }
       
    // const passKey = "hey";
    // console.log(user.password);
    // if (user.password === passKey) {
    //   this.user = user;
    //   window.localStorage.setItem('user', JSON.stringify(this.user));
    // }
  }

  isLogged() {
    const user = window.localStorage.getItem('user') || undefined;

    var logear= user ? true : false;

    if(logear){
      this.user = JSON.parse(user);
      if(this.user.isLogged){
        return this.user.isLogged;
      }
    }
    return false;
  }

  logout() {
    window.localStorage.clear();
    window.location.href = '';
  }
}
