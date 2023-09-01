import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/models/user.class';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { DialogDeleteUserComponent } from '../dialog-delete-user/dialog-delete-user.component';
import { collection, doc, getDocs, getFirestore, onSnapshot } from '@angular/fire/firestore';
import { DialogAddFinanceComponent } from '../dialog-add-finance/dialog-add-finance.component';
import { SharedService } from '../shared.service';
import { DialogLogInComponent } from '../dialog-log-in/dialog-log-in.component';
import { DialogChangePasswordComponent } from '../dialog-change-password/dialog-change-password.component';
import { DialogShowNoteComponent } from '../dialog-show-note/dialog-show-note.component';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    public dialog: MatDialog,
    public sharedService: SharedService,
  ) { }

  expenseTransactions$: Observable<any[]> | undefined;
  incomeTransactions$: Observable<any[]> | undefined;

  expenseTransactionsSubject = new BehaviorSubject<any[]>([]);
  incomeTransactionsSubject = new BehaviorSubject<any[]>([]);

  expenseTransactions: any = [];
  incomeTransactions: any = [];

  userId: any = '';
  firstName: any;
  lastName: any;
  user: User = new User;
  currentUserEmail: any;


  ngOnInit(): void {
    this.checkForLogIn();
    this.getUserId();
    this.currentUserEmail = this.sharedService.getCurrentEmail();
    this.setObservable();
    this.updateFinances();
  }


  checkForLogIn() {
    let id = this.sharedService.getCurrentUserId();
    if (id == undefined) {
      this.dialog.open(DialogLogInComponent);
    }
  }


  getUserId() {
    this.route.paramMap.subscribe(paramMap => {
      this.userId = paramMap.get('id');
      this.getUser();
    })
  }


  getUser() {
    this.firestore
      .collection('users')
      .doc(this.userId)
      .valueChanges()
      .subscribe((user: any) => {
        this.user = new User(user);
      });
  }


  setObservable() {
    this.expenseTransactions$ = this.expenseTransactionsSubject.asObservable();
    this.incomeTransactions$ = this.incomeTransactionsSubject.asObservable();
  }


  updateFinances() {

    this.expenseTransactions = [];
    this.incomeTransactions = [];

    const db = getFirestore();
    const colRef = collection(db, "finances");

    onSnapshot(colRef, (list) => {

      this.expenseTransactions = [];
      this.incomeTransactions = [];

      list.forEach(doc => {
        if (doc.get('userId') == this.userId && doc.get('transaction') == 'expense') {
          this.expenseTransactions.push(doc.data());
        }
        if (doc.get('userId') == this.userId && doc.get('transaction') == 'income') {
          this.incomeTransactions.push(doc.data());
        }
      });

      this.expenseTransactionsSubject.next(this.expenseTransactions);
      this.incomeTransactionsSubject.next(this.incomeTransactions);

    });
  }


  editUserAddress() {
    const dialog = this.dialog.open(DialogEditAddressComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId = this.userId;
  }


  editUserDetail() {
    const dialog = this.dialog.open(DialogEditUserComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId = this.userId;
  }


  deleteUser(user: any) {
    const dialog = this.dialog.open(DialogDeleteUserComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId = this.userId;
  }


  openAddFinanceDialog(userId: any) {
    const dialog = this.dialog.open(DialogAddFinanceComponent);
    dialog.componentInstance.userId = this.userId;
    dialog.componentInstance.chosenUser = userId;
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.disableSelection = true;
  }


  openNoteDialog(transaction: any) {
    const dialog = this.dialog.open(DialogShowNoteComponent);
    dialog.componentInstance.userId = this.userId;
    dialog.componentInstance.user = transaction;
  }


  ChangePassword(user: any) {
    const dialog = this.dialog.open(DialogChangePasswordComponent);
    dialog.componentInstance.userId = this.userId;
  }


  async deleteExpense(expense: any, event: Event) {
    event.stopPropagation();
    for (let i = 0; i < this.expenseTransactions.length; i++) {
      if (this.expenseTransactions[i] === expense) {
        const db = getFirestore();
        const colRef = collection(db, "finances");
        const docsSnap = await getDocs(colRef);

        docsSnap.forEach(doc => {
          if (doc.get('creationDate') == expense.creationDate) {
            const docId = doc.id;
            this.expenseTransactions.splice(i, 1);
            this.firestore
              .collection('finances')
              .doc(docId)
              .delete()
          }
        });
      }
    }
  }


  async deleteIncome(income: any, event: Event) {
    event.stopPropagation();
    for (let i = 0; i < this.incomeTransactions.length; i++) {
      if (this.incomeTransactions[i] === income) {
        const db = getFirestore();
        const colRef = collection(db, "finances");
        const docsSnap = await getDocs(colRef);

        docsSnap.forEach(doc => {
          if (doc.get('creationDate') == income.creationDate) {
            const docId = doc.id;
            this.incomeTransactions.splice(i, 1);
            this.firestore
              .collection('finances')
              .doc(docId)
              .delete()
          }
        });
      }
    }
  }
}


