import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ContactI } from '../../interfaces/contact';

@Component({
  selector: 'app-new-group-modal',
  templateUrl: './new-group-modal.component.html',
  styleUrls: ['./new-group-modal.component.scss']
})
export class NewGroupModalComponent implements OnInit {

  @Output() onCloseGroup = new EventEmitter();
  @Output() onCreateGroup = new EventEmitter();
  
  listOfContacts:Array<ContactI>
  selected : Array<String>
  groupName: string;
  constructor() { }

  ngOnInit(): void {
    this.listOfContacts = JSON.parse(window.localStorage.getItem('user')).contacts;
  }

  cancel(){ this.onCloseGroup.emit(null); }

  createGroup(){
    let contacts = []
    this.listOfContacts.map(contact => {
      if(this.selected.find(select => select == contact.telefono)){
        contacts.push(contact);
      }
    })
    this.onCreateGroup.emit({contacts, name: this.groupName }); 
    }

}
