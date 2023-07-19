import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-change-password-successful',
  templateUrl: './dialog-change-password-successful.component.html',
  styleUrls: ['./dialog-change-password-successful.component.scss']
})
export class DialogChangePasswordSuccessfulComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogChangePasswordSuccessfulComponent>) { }
  ngOnInit(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 1500);
  }
}