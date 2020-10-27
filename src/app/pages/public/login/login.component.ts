import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/shared/services/register/register.service';
import { UserI } from 'src/app/shared/interfaces/UserI';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    user: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  title: string = "Hola Mundo";
  color: string = "red"

  dbRef = firebase.database().ref('/users');
  
  constructor(private router:Router, private authService: AuthService, private registerService: RegisterService) { }


  regList: UserI[];

  ngOnInit(): void {
    window.localStorage.clear();
    this.regList = this.registerService.getRegister();
    // console.log(this.regList);
    for(let i=0;i<this.regList.length;i++){
      this.regList[i].isLogged=false;
    }
    // console.log(this.regList);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  doLogin() {
    const userI=this.loginForm.controls.user.value;
    var passwordI=this.loginForm.controls.password.value;
    // console.log(passwordI); 
    this.authService.login(userI,passwordI,this.regList);
    const isLogged = this.authService.isLogged();
    passwordI=undefined;
    // this.loginForm.controls.password.disable();
    this.regList=undefined;
    if(isLogged){
      console.log("logeado apá");
          this.router.navigate(['/home']);
    }else{
      console.log("not logged");
    }

    
  }

}
