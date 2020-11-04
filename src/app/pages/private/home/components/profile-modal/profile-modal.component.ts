import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss']
})
export class ProfileModalComponent implements OnInit {

  @Input() newName:string = '';
  @Input() newLastName:string = '';

  @Output() onCloseProfile = new EventEmitter();
  @Output() onUpdateProfile = new EventEmitter();
  
  newInfo = {};
  fileIsSelected: boolean = false;
  picture = null;

  constructor() { }

  ngOnInit(): void {
  }

  cancel(){
    this.onCloseProfile.emit(null);
    this.fileIsSelected = false; 
  }
  accept(){ 
    this.newInfo['newName'] = this.newName;
    this.newInfo['newLastName'] = this.newLastName;
    // console.log(this.newInfo);
    this.onUpdateProfile.emit(this.newInfo);
  }
  onFileSelected(event){
    this.fileIsSelected = true;
    this.picture = event.target.files[0];
    this.newInfo['newIcon'] = this.picture;
    // console.log(this.newInfo);
  }

}
