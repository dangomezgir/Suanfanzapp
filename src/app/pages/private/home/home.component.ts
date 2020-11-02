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

  chats: Array<ChatI> = [
    {
      title: "Santi",
      icon: "/assets/img/ppRightBar.png",
      isRead: true,
      msgPreview: "entonces ando usando fotos reales hahaha",
      lastMsg: "11:13",
      telefono: "+1516515131",
      email: "tuhermana@algo.com",
      msgs: [
        {content: "Lorem ipsum dolor amet", isRead:true, isMe:true, time:"7:24"},
        {content: "Qué?", isRead:true, isMe:false, time:"7:25"},
      ]
    },
    {
      title: "Pablo Bejarano",
      icon: "/assets/img/ppInbox.png",
      isRead: true,
      msgPreview: "Estrenando componente",
      lastMsg: "18:30",
      telefono: "+555555555",
      email: "shjfkg@hjsdfb.com",
      msgs: []
    },
    {
      title: "Pablo Bejarano 2",
      icon: "/assets/img/ppInbox.png",
      isRead: true,
      telefono: "+853691592026",
      email: "ojfsgnasfg@fjgndkfjgn.com",
      msgPreview: "Nice front 😎",
      lastMsg: "23:30",
      msgs: []
    },
  ];

  currentChat = this.chats[0];

  reglist: UserI[];

  constructor(private router:Router, public authService: AuthService, public chatService: ChatService, private registerService: RegisterService) {}

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
    if (this.chats.length > 0) {
      this.currentChat.title = this.chats[0].title;
      this.currentChat.icon = this.chats[0].icon;
      this.currentChat.msgs = this.chats[0].msgs;
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
    if(contactInfo){
      // alert(contactInfo);
      for(let i = 0; i<this.reglist.length; i++){
        if(this.reglist[i].email === contactInfo || this.reglist[i].telefono === contactInfo){
          contactExist = true;
          let newContact: ChatI = {
            title: this.reglist[i].name,
            email: this.reglist[i].email,
            icon: "./assets/img/default.png",
            isRead: false,
            lastMsg: "",
            msgPreview: "",
            msgs: [],
            telefono: this.reglist[i].telefono
          }
          this.chats.push(newContact);
        }
      }
      if(!contactExist)alert("El número de telefono o email no corresponde al de un usuario registrado.")
    }
  }

}
