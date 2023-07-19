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
  hide: any;
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
    }
  }

  async logIn(email: any, password: any) {
    this.loading = true
    const db = getFirestore();
    const colRef = collection(db, "users");
    const docsSnap = await getDocs(colRef);

    docsSnap.forEach(doc => {
      if (doc.get('email') == (this.email || email) && doc.get('password') == (this.password | password)) {
        this.sharedService.setCurrentUserInfo(doc.id, doc);
        this.checkRememberMe();
        this.dialog.open(DialogLogInSuccessfulComponent, {
          enterAnimationDuration: '450ms',
          exitAnimationDuration: '450ms'
        });
        this.router.navigate(['/dashboard', doc.id]);
        this.loading = false;
        this.noMatch = false;
        this.dialogRef.close();
      }
    })
      this.loading = false;
      this.noMatch = true;
  }

  checkRememberMe() {
    if (this.passwordSaved) {
      localStorage.setItem('email', this.email);
      localStorage.setItem('password', this.password);
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

