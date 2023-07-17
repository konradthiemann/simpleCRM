import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-finance-successful',
  templateUrl: './dialog-add-finance-successful.component.html',
  styleUrls: ['./dialog-add-finance-successful.component.scss']
})
export class DialogAddFinanceSuccessfulComponent implements OnInit{
  constructor(public dialogRef: MatDialogRef<DialogAddFinanceSuccessfulComponent>) { }
  ngOnInit(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 1500);
  }
  }

