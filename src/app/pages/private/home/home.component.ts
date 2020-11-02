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

  reglist: UserI[];

  constructor(private router:Router, public authService: AuthService, public chatService: ChatService, private registerService: RegisterService) {
    chatService.processContacts();
    chatService.getInitialMessages().then(snapshot => {
      this.chats = chatService.processInitialMessages(snapshot);
    });
  }

  ngOnInit(): void {
    this.initChat();
    this.reglist = this.registerService.getRegister();
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
    loggedUser.icon = '/assets/img/patricio.jpg'
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
        isGroup: false
        }
    }
    this.subscriptionList.connection = this.chatService.connect().subscribe(_ => {
      console.log("Nos conectamos");
      this.subscriptionList.msgs = this.chatService.getNewMsgs().subscribe((msg: MessageI) => {
        msg.isMe = this.currentChat.title === msg.owner ? true : false;
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
    let contactExist = false;
    let user = JSON.parse(window.localStorage.getItem('user'));
    if(contactInfo){
      // alert(contactInfo);
      for(let i = 0; i<this.reglist.length; i++){
        if(this.reglist[i].email === contactInfo || this.reglist[i].telefono === contactInfo){
          contactExist = true;
          let newContact: ChatI = {
            title: this.reglist[i].name,
            emails: [user.email ,this.reglist[i].email],
            icon: "./assets/img/default.png",
            isRead: false,
            lastMsg: "",
            msgPreview: "",
            msgs: [],
            telefonos: [user.telefono ,this.reglist[i].telefono],
            isGroup: false
          }
          this.chats.push(newContact);
        }
      }
      if(!contactExist)alert("El número de telefono o email no corresponde al de un usuario registrado.")
    }
  }

}
