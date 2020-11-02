import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent implements OnInit {

  @Input() contactInfo: string = '';

  @Output() onClose = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  cancel(){ this.onClose.emit(null); }
  addContact(){ this.onClose.emit(this.contactInfo); }

}
