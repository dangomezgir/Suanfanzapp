import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  db = firebase.database();
  storage = firebase.storage();

  constructor() { }

  updateProfileInfo(newInfo){
    // console.log(newInfo);
    // if(!newInfo.apellidos){
    //   console.log('no hay apellido')
    // }
    if(!newInfo.foto){
      alert('no hay foto');
    }else{
      alert('subiendo foto');
      this.uploadPicture(newInfo.foto);
      
    }
  }

  uploadPicture(foto){
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
      });
    });
  }
}
