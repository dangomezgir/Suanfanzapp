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
    telefono: new FormControl('', Validators.compose([Validators.pattern(/^[+]+[0-9]+$/), Validators.required, Validators.minLength(9)])),
    name: new FormControl('', Validators.compose([Validators.pattern(/^[a-zA-Z ]+$/), Validators.required])),
    lname: new FormControl('', Validators.compose([Validators.pattern(/^[a-zA-Z ]+$/), Validators.required])),
    password: new FormControl('', Validators.compose([Validators.minLength(8), Validators.required])),
    passwordC: new FormControl('', Validators.compose([Validators.minLength(8), Validators.required])),
  });

  dbRef = firebase.database().ref('/users');

  constructor(private router: Router, private authService: AuthService, private registerService: RegisterService) { }

  regList: UserI[];

  get emailFieldIsValid(){
    return this.userForm.controls.email.touched && this.userForm.controls.email.valid;
  }

  get emailFieldIsinValid(){
    return this.userForm.controls.email.touched && this.userForm.controls.email.invalid;
  }

  get phoneFieldIsValid(){
    return this.userForm.controls.telefono.touched && this.userForm.controls.telefono.valid;
  }

  get phoneFieldIsinValid(){
    return this.userForm.controls.telefono.touched && this.userForm.controls.telefono.invalid;
  }

  get passFieldIsValid(){
    return this.userForm.controls.password.touched && this.userForm.controls.password.valid;
  }

  get passFieldIsinValid(){
    return this.userForm.controls.password.touched && this.userForm.controls.password.invalid;
  }

  get passcFieldIsValid(){
    if (this.userForm.controls.password.value===this.userForm.controls.passwordC.value){
      return this.userForm.controls.passwordC.touched && this.userForm.controls.passwordC.valid;
    }
  }

  get passcFieldIsinValid(){
    if(this.userForm.controls.password.value!=this.userForm.controls.passwordC.value){
      return this.userForm.controls.passwordC.touched && this.userForm.controls.passwordC.invalid;
    }
  }

  get nameFieldIsValid(){
    return this.userForm.controls.name.touched && this.userForm.controls.name.valid;
  }

  get nameFieldIsinValid(){
    return this.userForm.controls.name.touched && this.userForm.controls.name.invalid;
  }

  get lnameFieldIsValid(){
    return this.userForm.controls.lname.touched && this.userForm.controls.lname.valid;
  }

  get lnameFieldIsinValid(){
    return this.userForm.controls.lname.touched && this.userForm.controls.lname.invalid;
  }

  ngOnInit(): void {
    this.regList = this.registerService.getRegister();
    console.log(this.regList);
    for(let i=0;i<this.regList.length;i++){
      this.regList[i].isLogged=false;
    }
    console.log(this.regList);
  }

  doRegister(e) {
    e.preventDefault();

    let emailExist = false;
    let telefonoExist=false;
    // console.log('email existe?1 '+emailExist);
    if (this.userForm.status == "INVALID") {
      alert("Revise los campos, no ha sido registrado");
      console.log("nonas pri");
    } else {
      for(let i = 0; i<this.regList.length; i++){
        if(this.userForm.controls.telefono.value === this.regList[i].telefono){
          telefonoExist = true;
        }
        if(this.userForm.controls.email.value === this.regList[i].email){
          emailExist = true;
        }
      }
      if(emailExist || telefonoExist){
        alert("El email o el télefono ya existen");
        console.log("El email o el télefono ya existen");
      }
      else{
        
        if (this.userForm.controls.password.value === this.userForm.controls.passwordC.value) {
          const user: UserI = {
            email: this.userForm.controls.email.value,
            telefono: this.userForm.controls.telefono.value,
            lname: this.userForm.controls.lname.value,
            password: this.userForm.controls.password.value,
            name: this.userForm.controls.name.value,
            isLogged: false,
            contacts: [],
            icon: "/assets/img/defaultPP.jpg"
          };
          this.dbRef.push(user);
          // this.regList.push(user);
          user.password = undefined;
          alert("Registrado correctamente, vuelva a la página Login");
        }
        else {
          alert("Las contraseñas no coinciden");
          console.log("Las contraseñas ingresadas no coinciden");
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
