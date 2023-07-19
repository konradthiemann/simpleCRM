import { Component } from '@angular/core';
import { collection, getDocs, getFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-dialog-forgot-password',
  templateUrl: './dialog-forgot-password.component.html',
  styleUrls: ['./dialog-forgot-password.component.scss']
})
export class DialogForgotPasswordComponent {

  post = {
    endPoint: 'https://konrad-thiemann.de/send_mail.php/',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: {
        'Content-Type': 'text/plain',
        responseType: 'text',
      },
    },
  };

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<DialogForgotPasswordComponent>,
    public dialog: MatDialog,
    ) {
      dialogRef.disableClose = true;
    }

  contactForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  loading:any;
  email:any;
  emailSent:boolean =  false;

  // sendNewPassword(){
  //   console.log(this.email);
  //   this.validateEmail();
  // }

  onSubmit(ngForm: any) {

    if (this.contactForm.valid) {
      let data = {
        email: this.contactForm.value.email,
      }
      this.http
        .post(this.post.endPoint, data)
        .subscribe({
          next: (response) => {
            ngForm.resetForm();
            this.emailSent = true;
            this.timeOutSendMail();
            this.dialogRef.close();
          },
          error: (error) => {
          },
        });
    } else {
      this.throwErrors()
    }
  }
  
  timeOutSendMail() {
    setTimeout(() => {
      this.emailSent = false;
    }, 4000)

  }

  throwErrors() {
    if (this.contactForm.controls['email'].status === 'INVALID') {
      console.log('wrong email');
    }
  }

  // async validateEmail(){
  //   const db = getFirestore();
  //   const colRef = collection(db, "users");
  //   const docsSnap = await getDocs(colRef);

  //   docsSnap.forEach(doc => {
  //     let email = doc.get('email');
  //     if(email == this.email){

  //     }
  //   });
  // }
}
