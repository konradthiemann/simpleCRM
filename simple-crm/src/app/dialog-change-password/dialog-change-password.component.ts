import { Component } from '@angular/core';
import { Firestore, addDoc, collection, getDocs, getFirestore } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { doc } from "firebase/firestore";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Finance } from '../models/finance.class';
import { DialogAddFinanceSuccessfulComponent } from '../dialog-add-finance-successful/dialog-add-finance-successful.component';
import { User } from 'src/models/user.class';
import { SharedService } from '../shared.service';
import { DialogChangePasswordSuccessfulComponent } from '../dialog-change-password-successful/dialog-change-password-successful.component';

@Component({
  selector: 'app-dialog-change-password',
  templateUrl: './dialog-change-password.component.html',
  styleUrls: ['./dialog-change-password.component.scss']
})
export class DialogChangePasswordComponent {
  constructor(
    private firestore: AngularFirestore,
    public dialogRef: MatDialogRef<DialogChangePasswordComponent>,
    public dialog: MatDialog,
    public sharedService: SharedService,
  ) { }

  userId: any;
  loading: any;
  password: any;
  newPassword: any;
  newPasswordRepeated: any;
  hide: any;

  validateInput() {
    if (this.newPassword == this.newPasswordRepeated) {
      this.savePassword();
    } else {
      console.log('the passwords you entered dont match, please try again!');
    }
  }

  async savePassword() {
    this.loading = true;
    const db = getFirestore();
    const colRef = collection(db, "users");
    const docsSnap = await getDocs(colRef);

    docsSnap.forEach(doc => {
      if (doc.get('password') == this.password && doc.id == this.userId) {
        this.firestore.collection('users').doc(this.userId).update({ password: this.newPassword }).then((result: any) => {
          this.loading = false;
          this.dialog.open(DialogChangePasswordSuccessfulComponent, {
            enterAnimationDuration: '450ms',
            exitAnimationDuration: '450ms'
          });
          this.dialogRef.close();
        });
      }
    });
  }
}
