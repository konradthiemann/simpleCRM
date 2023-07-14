import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/models/user.class';


@Component({
  selector: 'app-dialog-delete-user',
  templateUrl: './dialog-delete-user.component.html',
  styleUrls: ['./dialog-delete-user.component.scss']
})
export class DialogDeleteUserComponent {

  user!:User;
  loading = false;
  userId: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteUserComponent>, 
    private firestore: AngularFirestore,
    private router: Router) { }

  deleteUser(){
    this.loading = true;
    this.firestore
      .collection('users')
      .doc(this.userId)
      .delete()
      .then(() => {
        this.loading = false;
        this.dialogRef.close();
        this.router.navigate(['/user']);
      });
  }

}
