import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inbox-chat',
  templateUrl: './inbox-chat.component.html',
  styleUrls: ['./inbox-chat.component.scss']
})
export class InboxChatComponent implements OnInit {

  @Input() profilePic: string
  @Input() name: string
  @Input() msgTime: string
  @Input() msgPreview: string
  @Input() isRead: string = undefined

  readStatusColor: string

  constructor() { 
    
  }

  ngOnInit(): void {
    this.readStatusColor = this.isRead && this.isRead !== "false" ? "#50C2F7" : "#ABABAB";
  }

}
