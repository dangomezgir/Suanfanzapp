import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { InboxChatComponent } from './components/inbox-chat/inbox-chat.component';
import { ChatAreaComponent } from './components/chat-area/chat-area.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ContactModalComponent } from './components/contact-modal/contact-modal.component';
import { FormsModule } from '@angular/forms';
import { ProfileModalComponent } from './components/profile-modal/profile-modal.component';


@NgModule({
  declarations: [
    HomeComponent,
    InboxChatComponent,
    ChatAreaComponent,
    ChatMessageComponent,
    ContactModalComponent,
    ProfileModalComponent
  ],
  imports: [
    CommonModule, FormsModule
  ],
  exports: [
    InboxChatComponent, ChatAreaComponent, ChatMessageComponent
  ],
})
export class HomeModule { }
