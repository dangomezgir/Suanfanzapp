import { Component, Input, OnInit } from '@angular/core';
import { MessageI } from '../../interfaces/MessageI';
import {ChatMessageComponent} from '../../components/chat-message/chat-message.component';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-inbox-chat',
  templateUrl: './inbox-chat.component.html',
  styleUrls: ['./inbox-chat.component.scss']
})
export class InboxChatComponent implements OnInit {
  
  @Input() profilePic: string
  @Input() name: string
  @Input() msgTime: Date = new Date()
  @Input() msgPreview: string
  @Input() isRead: string = undefined

  readStatusColor: string

  constructor(public chatMessageComponent: ChatMessageComponent) {}

  ngOnInit(): void {
    this.readStatusColor = this.isRead && this.isRead !== "false" ? "#50C2F7" : "#ABABAB";
  }

  sendMsg(msg: MessageI) {
    this.msgPreview=msg.content
    this.msgTime=msg.time
  }

}
