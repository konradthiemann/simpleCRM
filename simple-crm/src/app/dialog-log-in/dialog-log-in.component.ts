import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { collection, getCountFromServer, getFirestore, getDocs, doc, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { DialogLogInSuccessfulComponent } from '../dialog-log-in-successful/dialog-log-in-successful.component';
import { SharedService } from '../shared.service';



@Component({
  selector: 'app-dialog-log-in',
  templateUrl: './dialog-log-in.component.html',
  styleUrls: ['./dialog-log-in.component.scss']
})
export class DialogLogInComponent {

  constructor(
    private firestore: AngularFirestore,
    public dialogRef: MatDialogRef<DialogLogInComponent>,
    private router: Router,
    public dialog: MatDialog,
    private sharedService: SharedService
  ){
    dialogRef.disableClose = true;
  }

  loading = false;
  email:any;
  password:any;
  // router: any;

  async logIn(email:any, password:any){
    this.loading = true
    const db = getFirestore();
    const colRef = collection(db, "users");
    const docsSnap = await getDocs(colRef);

    docsSnap.forEach(doc => {
      if (doc.get('email') == (this.email || email) && doc.get('password') == (this.password | password)) {
        this.sharedService.setCurrentUserInfo(doc.id, doc);
        this.dialog.open(DialogLogInSuccessfulComponent, {
          enterAnimationDuration:'450ms',
          exitAnimationDuration:'450ms'
        });
        this.router.navigate(['/dashboard', doc.id]);
        this.loading = false;
        this.dialogRef.close();
      }else{
        
        // console.log('your registration went wrong',doc.get('email'), this.email, doc.get('password'),this.password)
      }
  })
  }
}
