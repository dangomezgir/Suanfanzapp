import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageI } from 'src/app/pages/private/home/interfaces/MessageI';
import * as firebase from 'firebase';
import { ChatI } from '../../../pages/private/home/interfaces/ChatI';
import { setMaxListeners } from 'process';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket: any;
  dbRef: any;

  constructor() { 
    this.dbRef =firebase.database().ref('messages');
  }

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
        let receiver = this.verifyMessage(msg);
        if(receiver){
          observer.next(msg.msg);
        }
      });
    });
  }

  verifyMessage(msg):boolean{
    let user = JSON.parse(window.localStorage.getItem("user"));
    let receiverPhone = msg.toUser.telefonos.find(telf => telf == user.telefono);
    let receiverEmail = msg.toUser.emails.find(email => email == user.email);
    return receiverPhone || receiverEmail || msg.user.telefono == user.telefono || msg.user.email == user.email;
  }
  sendMsg(msg: MessageI, toUser: object) {
    let user = JSON.parse(window.localStorage.getItem('user'));
    this.socket.emit('newMsg', {msg, user, toUser});
  }


  processContacts(){
    let loggedUser = JSON.parse(window.localStorage.getItem('user'));
    console.log(loggedUser)
    let Sentmessage ={
        users : ["+393491208283","+555555555"],
        isGroup: false,
        isRead: false,
        emailUsers: ["patricio.estrella@gmail.com","test@gmail.com"],
        msgs: [
          {
            content: "Hola Testo!",
            isRead: false,
            sender : "+393491208283",
            time: "12:46"

          }
        ]
      }
    //this.dbRef.push(Sentmessage);
  }

  getInitialMessages(){
    return firebase.database().ref('messages').once('value');
  }

  processInitialMessages (snapshot){
    let dbData = []
    Object.keys(snapshot.val()).forEach(element => {
        dbData.push(snapshot.val()[element])
    }); 
    
    let loggedUser = JSON.parse(window.localStorage.getItem('user'));
    dbData = dbData.filter(message => {
      return message.users.find(user => user == loggedUser.telefono);
    })
    let myMessagges = [];
    dbData.forEach(messagge => {
      console.log("Entra")
        let title = "";
        let icon = "";
        if(messagge.isGroup){
          title = messagge.groupName;
          icon = messagge.groupIcon;
        }else{
          let otherNumber = messagge.users.find(user => user != loggedUser.telefono);
          if(loggedUser.contacts){
            title = loggedUser.contacts.find(contact => contact.telefono == otherNumber).name ? loggedUser.contacts.find(contact => contact.telefono == otherNumber).name : otherNumber;
            icon = loggedUser.contacts.find(contact => contact.telefono == otherNumber).icon ? loggedUser.contacts.find(contact => contact.telefono == otherNumber).icon : "/assets/img/defaultPP.png";
          }else{
            title = otherNumber;
            icon = "/assets/img/defaultPP.png";
          }
        }
        let processedMessages = [];
        messagge.msgs.forEach(msg => {
            processedMessages.push({
              content: msg.content,
              isRead: msg.isRead,
              isMe: msg.sender == loggedUser.telefono ? true : false,
              time: msg.time
            })
        });
        console.log(processedMessages)
        myMessagges.push({
          title,
          icon,
          isRead: messagge.isRead,
          msgPreview: processedMessages[0].content,
          lastMsg:  processedMessages[0].content,
          telefonos: messagge.users,
          emails: messagge.emailUsers,
          msgs: processedMessages,
          isGroup: messagge.isGroup
        })
    })
    console.log(myMessagges)
    return myMessagges;
  }

  disconnect() {
    this.socket.disconnect();
  }


}
