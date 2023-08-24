import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { collection, getFirestore, getDocs, doc, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { DialogLogInSuccessfulComponent } from '../dialog-log-in-successful/dialog-log-in-successful.component';
import { SharedService } from '../shared.service';
import { DialogForgotPasswordComponent } from '../dialog-forgot-password/dialog-forgot-password.component';

@Component({
  selector: 'app-dialog-log-in',
  templateUrl: './dialog-log-in.component.html',
  styleUrls: ['./dialog-log-in.component.scss']
})
export class DialogLogInComponent implements OnInit {

  constructor(
    private firestore: AngularFirestore,
    public dialogRef: MatDialogRef<DialogLogInComponent>,
    private router: Router,
    public dialog: MatDialog,
    private sharedService: SharedService,
  ) {
    dialogRef.disableClose = true;
  }

  loading = false;
  email: any;
  password: any;
  hide: any ;
  passwordSaved: boolean = false;
  currentRoute:any;
  noMatch:boolean = false;

  ngOnInit(): void {
    this.loadLocalStorage();
  }

  loadLocalStorage() {
    this.email = localStorage.getItem('email');
    this.password = localStorage.getItem('password');
    if (localStorage.getItem('checkbox') == 'true') {
      this.passwordSaved = true;
      this.logIn(this.email, this.password);
    }
  }

  async logIn(email: any, password: any) {
    this.loading = true
    const db = getFirestore();
    const colRef = collection(db, "users");
    const docsSnap = await getDocs(colRef);

    for(const doc of docsSnap.docs) {
      if (doc.get('email') == (this.email || email) && doc.get('password') == (this.password | password)) {
        this.sharedService.setCurrentUserInfo(doc.id, doc);
        this.checkRememberMe(doc.get('email'), doc.get('password'));
        this.dialog.open(DialogLogInSuccessfulComponent, {
          enterAnimationDuration: '450ms',
          exitAnimationDuration: '450ms'
          
        });
        this.router.navigate(['/dashboard', doc.id]);
        this.loading = false;
        this.noMatch = false;
        this.dialogRef.close();
        break;
      }else{
        this.noMatch = true;
      }
    }
      this.loading = false;
  }

  checkRememberMe(email: any, password: any) {
    if (this.passwordSaved) {
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      localStorage.setItem('checkbox', 'true');
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
      localStorage.removeItem('checkbox');
    }
  }

  forgotPassword() {
    this.dialog.open(DialogForgotPasswordComponent);
  }
}

