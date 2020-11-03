import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { MessageI } from '../../interfaces/MessageI';
import {InboxChatComponent} from '../../components/inbox-chat/inbox-chat.component';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit, OnChanges {

  @Input() title: string = ""
  @Input() icon: string = ""
  @Input() msgs: Array<MessageI> = []
  @Input() chatInfo: Object

  msg: string;

  scrollUp: boolean;
  
  constructor(public chatService: ChatService, public inboxChatComponent: InboxChatComponent) { }

  ngOnInit(): void {
  }

  ngOnChanges(){
    setTimeout(this.scrollDown, 10);
  }

  sendMsg() {
    const msg: MessageI = {
      content: this.msg,
      isMe: true,
      time: new Date(),
      isRead: false,
    }
    this.chatService.sendMsg(msg, this.chatInfo);
    this.inboxChatComponent.sendMsg(msg);
    this.msg = "";
    // this.scrollDown();
    // this.scrollDown();
    setTimeout(this.scrollDown, 10);
    console.log(this.chatService.getNewMsgs());
  }

  onScroll(event){
    // console.log(event);
    let scrollTop = event.target.scrollTop;
    let scrollHeight = event.target.scrollHeight;
    let offsetHeight = event.target.offsetHeight;

    if(offsetHeight == scrollHeight - scrollTop){
      this.scrollUp = false;
      // console.log(this.scrollUp);
    }
    else{
      this.scrollUp = true;
      // console.log(this.scrollUp);
    }
  }

  scrollDown(){
    const chatArea = document.querySelector('.chat');
    let scrollHeight = chatArea.scrollHeight;
    let clientHeight = chatArea.clientHeight;
    // let scrollHeight = e.target.scrollHeight;
    // let offsetHeight = e.target.offsetHeight;
    chatArea.scrollTo({top: scrollHeight - clientHeight});
    // console.log(e);
    console.log(scrollHeight - clientHeight);
  }
}
