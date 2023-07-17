import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/models/user.class';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { DialogDeleteUserComponent } from '../dialog-delete-user/dialog-delete-user.component';
import { collection, getDocs, getFirestore } from '@angular/fire/firestore';
import { DialogAddFinanceComponent } from '../dialog-add-finance/dialog-add-finance.component';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit{

  constructor(
    private route: ActivatedRoute, 
    private firestore: AngularFirestore, 
    public dialog: MatDialog,
    public sharedService: SharedService,
    ){}

  allFinances:any= [];  

  userId: any = '';
  firstName:any;
  lastName: any;
  user: User = new User;
  currentUserEmail:any;

  ngOnInit(): void {
    this.getUserId();
    this.currentUserEmail = this.sharedService.getCurrentEmail();
    
    this.getFinances();
  }

  getUserId(){
    this.route.paramMap.subscribe( paramMap => {
      this.userId = paramMap.get('id');
      this.getUser();
    })
  }

  getUser(){
    this.firestore
    .collection('users')
    .doc(this.userId)
    .valueChanges()
    .subscribe((user: any) => {
      this.user = new User(user);
    });
  }

  async getFinances(){


    
    const db = getFirestore();
    const colRef = collection(db, "finances");
    const docsSnap = await getDocs(colRef);

    this.allFinances = [];

    docsSnap.forEach(doc => {
      if (doc.get('userId') == this.userId) {
        
        this.allFinances.push(doc.get('firstName'));

        console.log(doc.get('userId'))
        }
      });
  }

  editUserAddress(){
    const dialog = this.dialog.open(DialogEditAddressComponent);
    dialog.componentInstance.user =  new User(this.user.toJSON());
    dialog.componentInstance.userId =  this.userId;
  }

  editUserDetail(){
    const dialog = this.dialog.open(DialogEditUserComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId =  this.userId;
  }

  deleteUser(user:any){
    const dialog = this.dialog.open(DialogDeleteUserComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId =  this.userId;
  }

  openAddFinanceDialog(){
    const dialog = this.dialog.open(DialogAddFinanceComponent);
    dialog.componentInstance.userId =  this.userId;
    dialog.componentInstance.user = new User(this.user.toJSON());
  }

  openNoteDialog(){
  
  }
}


