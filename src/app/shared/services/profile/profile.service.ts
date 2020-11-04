import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  db = firebase.database();
  storage = firebase.storage();
  user = JSON.parse(window.localStorage.getItem("user"));

  constructor() { }

  updateProfileInfo(newInfo){
    if(newInfo.newIcon){
      console.log('subiendo foto');
      
      let keys = [];
      let contacts = [];
      let contacts2 = [];
      let contactKeys = [];
      this.db.ref('users').on('child_added', snapshot => {
        keys.push(snapshot.key);
      })  
      // console.log(keys);
      keys.forEach(element => {
        this.db.ref('users').child(element).on('child_added', snapshot => {
          if(typeof snapshot.val() == 'object'){
            contacts.push(snapshot.val());
          }
        })
      });
      // console.log(contacts);
      contacts.forEach(element => {
        contacts2.push(Object.keys(element))
      });
      // console.log(contacts2[1][0]);
      for(let i = 0; i < contacts2.length; i++){
        for(let j = 0; j < contacts2[i].length; j++){
          contactKeys.push(contacts2[i][j]);
        }
      }

      
      this.uploadPicture(newInfo.newIcon, contactKeys, keys);

    }else{
      console.log('no hay foto');
    }

    if(newInfo.newName){
      // console.log(newInfo.newName);
      this.updateName(newInfo.newName);
    }else{
      console.log('no se cambiará el nombre');
    }

    if(newInfo.newLastName){
      // console.log(newInfo.newName);
      this.updateLastName(newInfo.newLastName);
    }else{
      console.log('no se cambiará el apellido');
    }
  }
  updateLastName(newLastName: any) {
    let key = this.user.userKey;
    this.db.ref('users').child(key).update({lname: newLastName});
  }

  uploadPicture(foto, contactKeys, keys){
    let filename = foto.name;
    let storageRef = this.storage.ref('/profilePics/' + filename);
    let uploadTask = storageRef.put(foto);

    uploadTask.on('state_changed', function(snapshot){
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) {
      // Handle unsuccessful uploads
      console.log(error);
    }, () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log('File available at', downloadURL);

        var postKey = this.db.ref('profilePics/').push().key;
        var updates = {};
        var imgData = {
          url: downloadURL,
          name: filename,
        };
        updates['profilePics/' + postKey] = imgData;
        this.db.ref().update(updates);
        let loggedUserKey = this.user.userKey;
        this.db.ref('users').child(loggedUserKey).update({icon: downloadURL});
        
        
        for(let i = 0; i < keys.length; i++){
          // console.log('===========')
          // console.log(keys[i]);
          // console.log('-----------')
          this.db.ref('users').child(keys[i]).on('child_added', snapshot => {
            if(typeof snapshot.val() == 'object'){
              for(let j = 0; j < contactKeys.length; j++){
                // console.log('-----------')
                this.db.ref('users').child(keys[i]).child('contacts').child(contactKeys[j]).on('child_added', sp =>{
                  // console.log(sp.val())
                  if(sp.val() == this.user.icon){
                    this.db.ref('users').child(keys[i]).child('contacts').child(contactKeys[j]).update({icon: downloadURL})
                  }
                })
                // console.log('-----------')
              }
            }
          })
          // console.log('-----------')
        }
        console.log('icono actualizado');

      });
    });
  }

  updateName(newName){
    let key = this.user.userKey;
    this.db.ref('users').child(key).update({name: newName});
  }
}
