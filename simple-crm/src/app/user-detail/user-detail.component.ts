import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/models/user.class';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { DialogDeleteUserComponent } from '../dialog-delete-user/dialog-delete-user.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit{

  constructor(
    private route: ActivatedRoute, 
    private firestore: AngularFirestore, 
    public dialog: MatDialog
    ){}

  userId: any = '';
  user: User = new User;

  ngOnInit(): void {
    this.route.paramMap.subscribe( paramMap => {
      this.userId = paramMap.get('id');
      console.log(this.userId);
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
      console.log(this.user, 'retrieved user');
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
}
