import { Injectable } from '@angular/core';
import { UserI } from '../interfaces/UserI';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: UserI | undefined;

  constructor() { }

  login(user: UserI) {
    const passKey = "suanfanzon";
    if (user.password === passKey) {
      this.user = user;
      window.localStorage.setItem('user', JSON.stringify(this.user));
    }
  }

  isLogged() {
    const user = window.localStorage.getItem('user') || undefined;
    const isLogged = user ? true : false;
    if (isLogged) this.user = JSON.parse(user);
    return isLogged;
  }

  logout() {
    window.localStorage.clear();
    window.location.href = '';
  }
}
