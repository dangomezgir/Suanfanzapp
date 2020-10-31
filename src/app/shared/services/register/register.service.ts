import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  dbRef = firebase.database().ref('users');

  constructor() { }

  getRegister() {
    let regList = [];
    this.dbRef.on('child_added', snapshot => {
      regList.push(snapshot.val())
    });
    return regList;
  }
}
