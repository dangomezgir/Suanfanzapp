import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  
  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  title: string = "Hola Mundo";
  color: string = "red"

  constructor(private router:Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  doLogin() {
    const emailI=this.loginForm.controls.email.value;
    const passwordI=this.loginForm.controls.password.value;
    // console.log(passwordI); 
    this.authService.login(emailI,passwordI);
    const isLogged = this.authService.isLogged();
    if(isLogged){
      console.log("logeado apá");
          this.router.navigate(['/home']);
    }else{
      console.log("not logged");
    }

    
  }

}
