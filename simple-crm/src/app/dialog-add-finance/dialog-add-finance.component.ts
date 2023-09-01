import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, collection, getDoc, getDocs } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Finance } from '../models/finance.class';
import { DialogAddFinanceSuccessfulComponent } from '../dialog-add-finance-successful/dialog-add-finance-successful.component';
import { User } from 'src/models/user.class';
import { SharedService } from '../shared.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Observable } from 'rxjs';
import { UserDetailComponent } from '../user-detail/user-detail.component';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-dialog-add-finance',
  templateUrl: './dialog-add-finance.component.html',
  styleUrls: ['./dialog-add-finance.component.scss']
})
export class DialogAddFinanceComponent implements OnInit{

  constructor(
    private firestore: Firestore,
    public dialogRef: MatDialogRef<DialogAddFinanceComponent>,
    public dialog: MatDialog,
    public sharedService: SharedService,
    public dashboard: DashboardComponent,
    public userDetail: UserDetailComponent,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.people$ = this.sharedService.getUsers();
    this.setFormGroup();
  }

  // form: FormGroup = new FormGroup({});
  form!: FormGroup;
  disableSelection: boolean = false;

  finance: Finance = new Finance();
  creationDate: Date | undefined;
  loading: boolean = false;
  category: any;
  note: any = '';
  userId: any;
  transaction: any;
  user!: User;

  people$: Observable<any[]> | undefined;
  chosenUser: any;


  saveFinance() {
    if (this.form?.valid) {
      this.finance.creationDate = this.creationDate?.getTime();
      this.finance.category = this.form.get('category')?.value; 
      this.finance.userId = this.chosenUser;
      this.finance.note = this.form.get('note')?.value; 
      this.finance.transaction = this.form.get('transaction')?.value; 
      this.finance.firstName = this.sharedService.getCurrentUserFirstName();
      this.finance.lastName = this.sharedService.getCurrentUserLastName();
      let date = new Date();
      this.finance.date = date.getTime();
  
      this.loading = true;
      addDoc(collection(this.firestore, 'finances'), this.finance.toJSON()).then((result: any) => {
        this.loading = false;
        this.dashboard.calculateLatestTransactions();
        this.dialog.open(DialogAddFinanceSuccessfulComponent, {
          enterAnimationDuration: '450ms',
          exitAnimationDuration: '450ms'
        });
        
        this.dialogRef.close();
      });
    }
  }


  setFormGroup() {
    this.form = this.fb.group({
      transaction: ['', Validators.required],
      category: ['', Validators.required,],
      note: ['', Validators.required],
      chosenUser: ['', Validators.required],
      creationDate: ['', Validators.required],
      amount: ['', Validators.required],
    });

    this.form.get('transaction')?.valueChanges.subscribe(transaction => {
      this.form.get('category')?.setValue('');
    });
  }

  
  getCategoryOptions(): string[] {
    const selectedTransaction = this.form.get('transaction')?.value;

    return selectedTransaction === 'expense'
      ? ['Salaries', 'Hardware and Computing Resources', 'Electricity Costs', 'Research and Development', 'Security Measures', 'Legal Consultation']
      : ['Crypto Consulting Services', 'Blockchain Development Services', 'Crypto Mining', 'ICO/STO Consulting', 'Project Implementation'];
  }
  

  setCategory(category: string) {
    this.form.get('category')?.setValue(category);
  }
}