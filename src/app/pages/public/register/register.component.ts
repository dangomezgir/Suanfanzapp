import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserI } from 'src/app/shared/interfaces/UserI';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  userForm = new FormGroup({
    email: new FormControl('', Validators.required),
    telefono: new FormControl('',Validators.required),
    name: new FormControl('', Validators.required),
    lname: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private router:Router, private authService:AuthService) { }

  ngOnInit(): void {
  }

  doRegister(e) {
    e.preventDefault();

    const user: UserI = {
      email: this.userForm.controls.email.value,
      telefono: this.userForm.controls.telefono.value,
      lname: this.userForm.controls.lname.value,
      password: this.userForm.controls.password.value,
      name: this.userForm.controls.name.value,
      isLogged:false
    };

    console.log(this.userForm);
    window.localStorage.setItem('user',JSON.stringify(user));
    user.password=undefined;

  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
