import { IfStmt, THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { UserI } from '../interfaces/UserI';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: UserI | undefined;

  constructor() { }

  


  
  login(userInput: string, passwordInput: string, regList: UserI[]) {

    if(regList.length>0){
      for(let i=0;i<regList.length;i++){
        if((userInput==regList[i].email&&passwordInput==regList[i].password)||userInput==regList[i].telefono&&passwordInput==regList[i].password){
          regList[i].isLogged=true;
          let logVerify=true;
          passwordInput=undefined;
          window.localStorage.setItem('logVerify',JSON.stringify(logVerify));
          window.localStorage.setItem('user',JSON.stringify(regList[i]));
        }
      }
    }

    // const user = window.localStorage.getItem('user') || undefined;

    // const isUser = user ? true : false;
    // if(isUser){
    //   this.user = JSON.parse(user);
    //   if(emailI==this.user.email&&passwordI==this.user.password){
    //     this.user.isLogged=true;
    //     window.localStorage.setItem('user',JSON.stringify(this.user));
    //   }
    //   else{
    //     this.user.isLogged=false;
    //   }
    // }
       
    // const passKey = "hey";
    // console.log(user.password);
    // if (user.password === passKey) {
    //   this.user = user;
    //   window.localStorage.setItem('user', JSON.stringify(this.user));
    // }
  }

  // async userExists(){
  //   await 
  // }

  isLogged() {

    var isLoggedIn= window.localStorage.getItem('logVerify') || undefined;

    let logear= isLoggedIn ? true : false;

    if(logear){
      return true;
    }
    return false;
    

    // if(this.regList.length>0){
    //   for(let i=0;i<this.regList.length;i++){
    //     if(this.regList[i].isLogged){
    //       return true;
    //     }
    //   }
    //   return false;
    // }

    // const user = window.localStorage.getItem('user') || undefined;

    // // var logear= user ? true : false;

    // if(logear){
    //   this.user = JSON.parse(user);
    //   if(this.user.isLogged){
    //     return this.user.isLogged;
    //   }
    // }
    // return false;
  }

  logout() {
    window.localStorage.clear();
    window.location.href = '';
  }
}
