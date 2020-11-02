import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { MessageI } from '../../interfaces/MessageI';
import {InboxChatComponent} from '../../components/inbox-chat/inbox-chat.component';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit {

  @Input() title: string = ""
  @Input() icon: string = ""
  @Input() msgs: Array<MessageI> = []
  @Input() chatInfo: Object

  msg: string;

  constructor(public chatService: ChatService, public inboxChatComponent: InboxChatComponent) { }

  ngOnInit(): void {
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
  }
}
