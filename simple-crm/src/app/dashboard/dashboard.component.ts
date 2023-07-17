import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogLogInComponent } from '../dialog-log-in/dialog-log-in.component';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../shared.service';
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { Firestore, collection, docData } from '@angular/fire/firestore';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private sharedService: SharedService, private firestore: Firestore ) { }

  db = this.firestore;
  userActive = false;
  id: any;
  name: string | undefined;

  ngOnInit(): void {
    let id = this.sharedService.getCurrentUserId();
    // let doc = this.sharedService.getCurrentDoc();
    if (id !== undefined) {
      docData(doc(this.firestore, `users/${id}`)).subscribe((user) => {
        this.name = user['firstName'];
        console.log(this.name);
        this.id = id;
      });
    } else {
      this.dialog.open(DialogLogInComponent);
    }
  }
}
