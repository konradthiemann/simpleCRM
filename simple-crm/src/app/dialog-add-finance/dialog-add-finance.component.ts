import { Component } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';

import { doc } from "firebase/firestore";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Finance } from '../models/finance.class';
import { DialogAddFinanceSuccessfulComponent } from '../dialog-add-finance-successful/dialog-add-finance-successful.component';
import { User } from 'src/models/user.class';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-dialog-add-finance',
  templateUrl: './dialog-add-finance.component.html',
  styleUrls: ['./dialog-add-finance.component.scss']
})
export class DialogAddFinanceComponent {

  constructor(
    private firestore: Firestore,
    public dialogRef: MatDialogRef<DialogAddFinanceComponent>,
    public dialog: MatDialog,
    public sharedService: SharedService,
  ) { }

  finance: Finance = new Finance();
  creationDate: Date | undefined;
  loading: boolean = false;
  category: any;
  note: any = '';
  userId: any;
  transaction: any;
  user!: User;

  saveFinance() {
    this.finance.creationDate = this.creationDate?.getTime();
    this.finance.category = this.category;
    this.finance.userId = this.userId;
    this.finance.note = this.note;
    this.finance.transaction = this.transaction;
    this.finance.firstName = this.sharedService.getCurrentUserFirstName();
    this.finance.lastName = this.sharedService.getCurrentUserLastName();

    this.loading = true;
    addDoc(collection(this.firestore, 'finances'), this.finance.toJSON()).then((result: any) => {
      this.loading = false;
      this.dialog.open(DialogAddFinanceSuccessfulComponent, {
        enterAnimationDuration: '450ms',
        exitAnimationDuration: '450ms'
      });
      this.dialogRef.close();
    });
  }

  addCategory(category: any) {
    this.category = category;
  }
}