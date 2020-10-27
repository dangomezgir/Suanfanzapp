import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { UserI } from 'src/app/shared/interfaces/UserI';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RegisterService } from 'src/app/shared/services/register/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  userForm = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.email, Validators.required])),
    telefono: new FormControl('', Validators.compose([Validators.pattern(/^[+]+[1-9]+$/), Validators.required, Validators.minLength(9)])),
    name: new FormControl('', Validators.compose([Validators.pattern(/^[a-zA-Z ]+$/), Validators.required])),
    lname: new FormControl('', Validators.compose([Validators.pattern(/^[a-zA-Z ]+$/), Validators.required])),
    password: new FormControl('', Validators.compose([Validators.minLength(8), Validators.required])),
    passwordC: new FormControl('', Validators.compose([Validators.minLength(8), Validators.required])),
  });

  dbRef = firebase.database().ref('/users');

  constructor(private router: Router, private authService: AuthService, private registerService: RegisterService) { }

  regList: UserI[];

  ngOnInit(): void {
    this.regList = this.registerService.getRegister();
    console.log(this.regList);
  }

  doRegister(e) {
    e.preventDefault();

    let emailExist = false;
    console.log('email existe?1 '+emailExist);
    if (this.userForm.status == "INVALID") {
      console.log("nonas pri");
    } else {
      for(let i = 0; i<this.regList.length; i++){

        if(this.userForm.controls.email.value === this.regList[i].email){
          emailExist = true;
        }
      }
      if(emailExist){
        console.log("El email ya existe");
      }
      else{
        
        if (this.userForm.controls.password.value === this.userForm.controls.passwordC.value) {
          const user: UserI = {
            email: this.userForm.controls.email.value,
            telefono: this.userForm.controls.telefono.value,
            lname: this.userForm.controls.lname.value,
            password: this.userForm.controls.password.value,
            name: this.userForm.controls.name.value,
            isLogged: false
          };
          this.dbRef.push(user);
          this.regList.push(user);
          user.password = undefined;
          window.localStorage.setItem('user', JSON.stringify(user));
        }
        else {
          console.log("nonas pri, las contraseñas loco");
        }
      }
      
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  // async checkEmail(emailExist: boolean){
  //   await this.dbRef.orderByChild('email').equalTo(this.userForm.controls.email.value).on('child_added', snapshot => {
  //     console.log(snapshot.key);
  //     emailExist = true;
  //     console.log('email existe?2 '+emailExist);
  //   });
  //   return emailExist
  // }

}
