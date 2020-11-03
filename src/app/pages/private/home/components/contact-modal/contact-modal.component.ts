import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent implements OnInit {

  @Input() contactInfo: string = '';

  @Output() onCloseContact = new EventEmitter();
  @Output() onAddContact = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  cancel(){ this.onCloseContact.emit(null); }
  addContact(){ this.onAddContact.emit(this.contactInfo); }

}
