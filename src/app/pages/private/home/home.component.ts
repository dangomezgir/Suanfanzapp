import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { ChatI } from './interfaces/ChatI';
import { MessageI } from './interfaces/MessageI';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';



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
      this.subscriptionList.msgs = this.chatService.getNewMsgs().subscribe((msg: MessageI) => {
        this.currentChat.msgs.push(msg);
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

  closeNewGroup(){
    this.showNewGroupModal = false;
  }


  closeProfile(){
    this.showProfileModal = false;
  }

  updateProfile(newInfo){
    // alert('Funciona el evento');
    // console.log(newInfo);
    if(newInfo.foto || newInfo.nombres || newInfo.apellidos){
      console.log('no está vacío');
      this.profileService.updateProfileInfo(newInfo);
      // this.showProfileModal = false;
    }else{
      alert('Todos los campos están vacíos');
    }
  }

  addContact(contactInfo){
    this.showContactModal = false;
    this.showNewGroupModal=false
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

  alreadyAddded(contactInfo): boolean{
    let contacts = JSON.parse(window.localStorage.getItem('user')).contacts;
    let found = contacts.find(contact => contact.telefono == contactInfo);
    let foundEmail = contacts.find(contact => contact.email == contactInfo);
    return found || foundEmail
  }

}
