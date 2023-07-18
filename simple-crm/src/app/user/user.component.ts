import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { User } from 'src/models/user.class';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SharedService } from '../shared.service';
import { DialogLogInComponent } from '../dialog-log-in/dialog-log-in.component';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit{

  user: User = new User();
  allUsers = [];
  

  constructor(
    public dialog: MatDialog, 
    private firestore: AngularFirestore, 
    private sharedService: SharedService){}

    
  ngOnInit(): void {
    this.checkForLogIn();
    this.updateAllUsers();
  }

  checkForLogIn(){
    let id = this.sharedService.getCurrentUserId();
    if (id == undefined) {
      this.dialog.open(DialogLogInComponent);
    }     
  }

  updateAllUsers(){
    this.firestore
      .collection('users')
      .valueChanges({idField: 'customIdName'})
      .subscribe((changes:any) => {
        this.allUsers = changes;
      })
  }

  openDialog(){
    this.dialog.open(DialogAddUserComponent);
  }
}
