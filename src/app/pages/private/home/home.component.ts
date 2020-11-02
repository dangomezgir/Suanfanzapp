import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { ChatI } from './interfaces/ChatI';
import { MessageI } from './interfaces/MessageI';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

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

  constructor(private router:Router, public authService: AuthService, public chatService: ChatService) {
    chatService.processContacts();
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

}
