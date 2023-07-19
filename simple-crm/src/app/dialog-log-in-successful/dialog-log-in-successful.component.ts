import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-log-in-successful',
  templateUrl: './dialog-log-in-successful.component.html',
  styleUrls: ['./dialog-log-in-successful.component.scss']
})
export class DialogLogInSuccessfulComponent implements OnInit{

  constructor(public dialogRef: MatDialogRef<DialogLogInSuccessfulComponent>) { }
  
ngOnInit(): void {
  setTimeout(() => {
    this.dialogRef.close();
  }, 1500);
}
}
