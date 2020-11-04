import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { ChatI } from './interfaces/ChatI';
import { MessageI } from './interfaces/MessageI';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { ReceivedMessageI } from './interfaces/receivedMessage';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  showContactModal: boolean = false;
  showProfileModal: boolean = false;
  showNewGroupModal: boolean = false;

  contactInfo: string = '';

  subscriptionList: {
    connection: Subscription,
    msgs: Subscription,
    connectedUsers: Subscription
  } = {
      connection: undefined,
      msgs: undefined,
      connectedUsers: undefined
  };
  icon: string;
  chats: Array<ChatI> = [];
  usersOnline: Array<string>=[];
  currentChat: ChatI;
  isCurrentChatOnline: boolean;

  constructor(private router:Router, public authService: AuthService, public chatService: ChatService, public profileService: ProfileService) {
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
    this.chatService.disconnect();
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
      this.subscriptionList.connectedUsers=this.chatService.getConnectedUsers().subscribe((users:Array<string>) => this.usersOnline = users) 
      this.subscriptionList.msgs = this.chatService.getNewMsgs().subscribe((msg: ReceivedMessageI) => {
        let correctChat: ChatI;
        let user = JSON.parse(window.localStorage.getItem("user"));
        if(msg.sender == user.telefono){
          this.currentChat.msgs.push(msg.msg)
        }
        else{
          if(msg.isgroup){
            correctChat = this.chats.find(chat => chat.title == msg.title);
          }else{
            correctChat = this.chats.find(chat => chat.telefonos.find(telefono => telefono == msg.sender))
          }
          if(correctChat){
            console.log(correctChat, "Chat to add meessage")
            correctChat.msgs.push(msg.msg);
            correctChat.lastMsg = msg.msg.time;
            correctChat.msgPreview = msg.msg.content;
          }else{
            if(!msg.isgroup){
              msg.conv.title = msg.sender;
              msg.conv.icon = "https://cdn3.iconfinder.com/data/icons/mixed-communication-and-ui-pack-1/48/general_pack_NEW_glyph_profile-512.png";
            }
            msg.conv.msgs.push(msg.msg);
            msg.conv.lastMsg = msg.msg.time;
            msg.conv.msgPreview = msg.msg.content;
            this.chats.push(msg.conv);
          }
        }
      });
    });
  }

  onSelectInbox(index: number) {
    this.currentChat = this.chats[index];
    let user = JSON.parse(window.localStorage.getItem("user"));

    if(!this.currentChat.isGroup){
      let receiverPhone = this.chats[index].telefonos.find(telf => telf != user.telefono);
      let status = this.usersOnline.find(isOnline=> isOnline == receiverPhone);
      console.log("status"+status);
      console.log(receiverPhone);
      console.log(this.usersOnline);
      this.isCurrentChatOnline =  typeof status == 'undefined' ? false : true;
      console.log(this.isCurrentChatOnline);
    }
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

  openContactModal(){
    this.showContactModal = true;
  }

  openNewGroupModal(){
    this.showNewGroupModal = true;
  }


  openProfileModal(){
    this.showProfileModal = true;
  }

  closeContact(){
    this.showContactModal = false;
  }

  closeGroup(){
    this.showNewGroupModal = false;
  }

  closeProfile(){
    this.showProfileModal = false;
  }

  updateProfile(newInfo){
    // alert('Funciona el evento');
    console.log(newInfo);
    if(newInfo.newIcon || newInfo.newName || newInfo.newLastName){
      console.log('no está vacío');
      this.profileService.updateProfileInfo(newInfo);
      // this.showProfileModal = false;
    }else{
      alert('Todos los campos están vacíos');
    }
    // if(newInfo.newIcon)console.log('sí hay foto');
  }

  addContact(contactInfo){
    this.showContactModal = false;
    let contactExist = this.alreadyAddded(contactInfo);
    let samePerson = false;
    let loggedUser = JSON.parse(window.localStorage.getItem('user'));

    
    if(contactInfo){
      if(((contactInfo.indexOf(loggedUser.telefono) ^ contactInfo.indexOf(loggedUser.email)) == -1)){
        contactExist = true;
        samePerson = true;
      }
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
  createGroup(groupInfo){
    this.showNewGroupModal = false;
    if(groupInfo){
      let confirmation = this.chatService.createGroup(groupInfo);
      this.chats.push(confirmation);
    }
  }

  alreadyAddded(contactInfo): boolean{
    let contacts = JSON.parse(window.localStorage.getItem('user')).contacts;
    let found = contacts.find(contact => contact.telefono == contactInfo);
    let foundEmail = contacts.find(contact => contact.email == contactInfo);
    return found || foundEmail
  }

}
