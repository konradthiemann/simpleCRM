import { Component } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { User } from 'src/models/user.class';
import { doc } from "firebase/firestore"; 
import { MatDialogRef } from '@angular/material/dialog';
// import { AngularFireStore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.scss']
})
export class DialogAddUserComponent {
  
  constructor(private firestore: Firestore, public dialogRef: MatDialogRef<DialogAddUserComponent>){}
  user: User = new User();
  birthDate: Date | undefined;
  loading: boolean = false;

  saveUser(){
    this.user.birthDate = this.birthDate?.getTime();
    // console.log('current user', this.user);
    this.loading = true;
    addDoc(collection(this.firestore, 'users'), this.user.toJSON()).then((result:any) => {
      this.loading = false;
      // console.log('adding user finished', result);
      this.dialogRef.close();
    });
  }
}
