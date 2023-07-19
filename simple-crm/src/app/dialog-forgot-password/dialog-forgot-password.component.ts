import { Component } from '@angular/core';
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
    endPoint: 'https://simple-crm.konrad-thiemann.de/send_mail.php/',
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

  loading: any;
  email: any;
  emailSent: boolean = false;

  onSubmit(ngForm: any) {

    const randomPassword = this.randomPasswordGenerator();
    if (this.contactForm.valid) {
      let data = {
        recipient: this.contactForm.value.email,
        password: `${randomPassword}`,
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
    }
  }

  randomPasswordGenerator() {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let passwordLength = 12;
    let password = "";

    for (let i = 0; i <= passwordLength; i++) {
      let randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }

    return password;
  }
}
