import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '../shared.service';
import { Firestore } from '@angular/fire/firestore';
import { DialogLogInComponent } from '../dialog-log-in/dialog-log-in.component';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(public dialog: MatDialog, private sharedService: SharedService, private firestore: Firestore) { }

  ngOnInit(): void {
    let id = this.sharedService.getCurrentUserId();
    if (id == undefined) {
      this.dialog.open(DialogLogInComponent);
    }
  }

}
