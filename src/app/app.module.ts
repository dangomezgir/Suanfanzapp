import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {InboxChatComponent} from '../app/pages/private/home/components/inbox-chat/inbox-chat.component';
import {ChatAreaComponent} from '../app/pages/private/home/components/chat-area/chat-area.component';
import {ChatMessageComponent} from '../app/pages/private/home/components/chat-message/chat-message.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/public/login/login.component';
import { RegisterComponent } from './pages/public/register/register.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import * as firebase from 'firebase';

firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  providers: [InboxChatComponent, ChatAreaComponent, ChatMessageComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
