import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageI } from 'src/app/pages/private/home/interfaces/MessageI';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket: any;

  constructor() { }

  connect() {
    return new Observable(observer => {
      this.socket = io('http://192.168.0.23:3000');
      this.socket.on('connect', () => {
        observer.next();
      })
    })
  }

  getNewMsgs() {
    return new Observable(observer => {
      this.socket.on("newMsg", msg => {
        let user = JSON.parse(window.localStorage.getItem("user"));
        if(msg.toUser.telefono == user.telefono || msg.user.telefono == user.telefono){
          observer.next(msg.msg);
        }
      });
    });
  }

  sendMsg(msg: MessageI, toUser: object) {
    let user = JSON.parse(window.localStorage.getItem('user'));
    this.socket.emit('newMsg', {msg, user, toUser});
  }

  disconnect() {
    this.socket.disconnect();
  }


}
