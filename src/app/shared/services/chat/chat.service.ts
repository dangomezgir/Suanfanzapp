import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageI } from 'src/app/pages/private/home/interfaces/MessageI';
import * as firebase from 'firebase';
import { ChatI } from '../../../pages/private/home/interfaces/ChatI';
import { ContactI } from 'src/app/pages/private/home/interfaces/contact';
import { RegisterService } from '../register/register.service';
import { UserI } from '../../interfaces/UserI';
import { FirebaseApp } from '@angular/fire';
import { cpuUsage } from 'process';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket: any;
  dbRef: any;
  users: UserI[];
  
  constructor(private registerService: RegisterService) { 
    this.dbRef =firebase.database().ref('messages');
    this.users = registerService.getRegister()
  }

  connect() {
    return new Observable(observer => {
      this.socket = io('http://localhost:3000');
      this.socket.on('connect', () => {
        let loggedUser = JSON.parse(window.localStorage.getItem("user"));
        this.socket.emit("connected",loggedUser);
        observer.next();
      })
    })
  }

  getConnectedUsers(){
    return new Observable(observer => {
      this.socket.on("connectedUsers", users => {
        observer.next(users);
      });
    });
  }


  getNewMsgs() {
    return new Observable(observer => {
      this.socket.on("newMsg", msg => {
        let receiver = this.verifyMessage(msg);
        if(receiver.acceptMessage || receiver.imSender){
          if(receiver.acceptMessage){
              msg.msg.isMe = false;
          }
          observer.next(msg.msg);
        }
      });
    });
  }

  verifyMessage(msg){
    let user = JSON.parse(window.localStorage.getItem("user"));
    let receiverPhone = msg.toUser.telefonos.find(telf => telf == user.telefono &&  telf != msg.user.telefono);
    let receiverEmail = msg.toUser.emails.find(email => email == user.email && email != msg.user.email);
    return {
      acceptMessage: receiverPhone || receiverEmail ,
      imSender: msg.user.email == user.email || msg.user.telefono == user.telefono
    };
  }
  sendMsg(msg: MessageI, toUser: ChatI) {
    let user = JSON.parse(window.localStorage.getItem('user'));
    let updateRef = firebase.database().ref(`messages`).child(toUser.chatKey).child('msgs');
    let date = new Date();
    let time = `${date.getHours()}:${date.getMinutes()}`;
    msg.time = time
    updateRef.push({content: msg.content,isRead: false, sender: user.telefono, time})
    this.socket.emit('newMsg', {msg, user, toUser});
  }


  addContact(contact, chats:ChatI[]){
    let loggedUser = JSON.parse(window.localStorage.getItem('user'));
    let user = this.users.find(user => user.telefono == contact) || this.users.find(user => user.email == contact);
    if(user){
      let updateUser = firebase.database().ref('users').child(loggedUser.userKey).child('contacts');
      let intialConv = {
        users : [loggedUser.telefono,user.telefono],
        isGroup: false,
        isRead: false,
        emailUsers: [loggedUser.email,user.email],
        msgs: []
      }

      updateUser.push({
        email: user.email,
        icon: user.icon,
        name: user.name,
        telefono: user.telefono
      })
      let foundConv = chats.find(chat => chat.telefonos.find(telfono => telfono == contact) || chat.emails.find(email => email == contact));
      if(foundConv){
        return {found: true, title: user.name, icon: user.icon, index: chats.indexOf(foundConv)}
      }else{
        let key = this.dbRef.push(intialConv);
        return {
                data:{
                  title: user.name,
                  icon: user.icon,
                  isRead: false,
                  msgPreview:  '',
                  lastMsg:  '',
                  telefonos: [loggedUser.telefono,user.telefono],
                  emails: [loggedUser.email,user.email],
                  msgs: [],
                  isGroup: false,
                  chatKey: key.key
                }
        }
      }
    }else{
      return {error: "Usuario no encontrado por favor revisar la informacion ingresada"}
    }
    
  }
  
  getInitialMessages(){
    return firebase.database().ref('messages').once('value');
  }

  processInitialMessages (snapshot){
    let dbData = []
    Object.keys(snapshot.val()).forEach(element => {
        let data = snapshot.val()[element];
        data.chatKey = element
        dbData.push(data)
    }); 
    
    let loggedUser = JSON.parse(window.localStorage.getItem('user'));
    dbData = dbData.filter(message => {
      return message.users.find(user => user == loggedUser.telefono);
    })
    let myMessagges = [];
    dbData.forEach(messagge => {
        let title = "";
        let icon = "";
        if(messagge.isGroup){
          title = messagge.groupName;
          icon = messagge.groupIcon;
        }else{
          let otherNumber = messagge.users.find(user => user != loggedUser.telefono);
          if(loggedUser.contacts && loggedUser.contacts.length > 0){
            title = loggedUser.contacts.find(contact => contact.telefono == otherNumber) ? loggedUser.contacts.find(contact => contact.telefono == otherNumber).name : otherNumber;
            icon = loggedUser.contacts.find(contact => contact.telefono == otherNumber) ? loggedUser.contacts.find(contact => contact.telefono == otherNumber).icon : "/assets/img/defaultPP.png";
          }else{
            title = otherNumber;
            icon = "/assets/img/defaultPP.png";
          }
        }
        let messages = []
        let processedMessages = [];
        if('msgs' in messagge){
          Object.keys(messagge.msgs).forEach(key => {
            let data = messagge.msgs[key];
            messages.push(data)
          }); 
          messages.forEach(msg => {
              processedMessages.push({
                content: msg.content,
                isRead: msg.isRead,
                isMe: msg.sender == loggedUser.telefono,
                time: msg.time
              })
          });
        }
        let last = processedMessages.length-1;
        myMessagges.push({
          title,
          icon,
          isRead: messagge.isRead,
          msgPreview: typeof processedMessages[last] !== 'undefined' ? processedMessages[last].content : '',
          lastMsg:  typeof processedMessages[last] !== 'undefined' ? processedMessages[last].time : '',
          telefonos: messagge.users,
          emails: messagge.emailUsers,
          msgs: processedMessages,
          isGroup: messagge.isGroup,
          chatKey: messagge.chatKey
        })
    })
    console.log(myMessagges)
    return myMessagges;
  }

  disconnect() {
    let loggedUser = JSON.parse(window.localStorage.getItem('user'));
    this.socket.emit('disconnected',loggedUser);
    this.socket.disconnect();
  }


}
