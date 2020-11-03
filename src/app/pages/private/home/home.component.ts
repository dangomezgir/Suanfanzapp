import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { ChatI } from './interfaces/ChatI';
import { MessageI } from './interfaces/MessageI';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/shared/services/register/register.service';
import { UserI } from 'src/app/shared/interfaces/UserI';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  showModal: boolean = false;

  contactInfo: string = '';

  subscriptionList: {
    connection: Subscription,
    msgs: Subscription
  } = {
      connection: undefined,
      msgs: undefined
  };
  icon: string;
  chats: Array<ChatI> = [];

  currentChat: ChatI;

  constructor(private router:Router, public authService: AuthService, public chatService: ChatService, private registerService: RegisterService) {
    chatService.getInitialMessages().then(snapshot => {
      this.chats = chatService.processInitialMessages(snapshot);
    });
  }

  ngOnInit(): void {
    this.initChat();
  }

  ngOnDestroy(): void {
    this.destroySubscriptionList();
    this.chatService.disconnect();
  }

  logOut(){
    console.log("logOut");
    window.localStorage.clear();
    this.router.navigate(['/login']);
  }
  
  initChat() {
    let loggedUser = JSON.parse(window.localStorage.getItem('user'));
    this.icon = loggedUser.icon;
    if (this.chats.length > 0) {
      this.currentChat = this.chats[0];
    }else{
      this.currentChat = {
        title: '',
        icon: '',
        msgPreview: '',
        isRead: false,
        lastMsg: '',
        msgs: [],
        telefonos: [],
        emails: [],
        isGroup: false,
        chatKey: ""
      }
    }
    this.subscriptionList.connection = this.chatService.connect().subscribe(_ => {
      console.log("Nos conectamos");
      this.subscriptionList.msgs = this.chatService.getNewMsgs().subscribe((msg: MessageI) => {
        this.currentChat.msgs.push(msg);
      });
    });
  }

  onSelectInbox(index: number) {
    this.currentChat = this.chats[index];
  }

  doLogout() {
    this.authService.logout();
  }

  destroySubscriptionList(exceptList: string[] = []): void {
    for (const key of Object.keys(this.subscriptionList)) {
      if (this.subscriptionList[key] && exceptList.indexOf(key) === -1) {
        this.subscriptionList[key].unsubscribe();
      }
    }
  }

  openModal(){
    this.showModal = true;
  }

  addContact(contactInfo){
    this.showModal = false;
    let contactExist = this.alreadyAddded(contactInfo);
    let samePerson = false;
    let loggedUser = JSON.parse(window.localStorage.getItem('user'));
    if(((contactInfo.indexOf(loggedUser.telefono) ^ contactInfo.indexOf(loggedUser.email)) == -1)){
      contactExist = true;
      samePerson = true;
    }
    
    if(contactInfo){
      if(contactExist && !samePerson)alert("El número de telefono o email no corresponde al de un usuario registrado.");
      else if(samePerson) alert("No te puedes agregar a ti mismo, porfavor agrega amigos")
      else {
        console.log("add contact")
        let confirmation = this.chatService.addContact(contactInfo,this.chats)
        if('error' in confirmation){
          alert(confirmation.error)
        }else if('found' in confirmation && confirmation.found){
          this.chats[confirmation.index].title = confirmation.title;
          this.chats[confirmation.index].icon = confirmation.icon;
        }else{
          this.chats.push(confirmation.data);
        }
      };
    }
  }

  alreadyAddded(contactInfo): boolean{
    let contacts = JSON.parse(window.localStorage.getItem('user')).contacts;
    let found = contacts.find(contact => contact.telefono == contactInfo);
    let foundEmail = contacts.find(contact => contact.email == contactInfo);
    return found || foundEmail
  }

}
