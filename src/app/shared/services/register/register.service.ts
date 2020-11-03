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
      let data = snapshot.val()
      data.userKey = snapshot.key;
      regList.push(data)
    });
    return regList;
  }
}
