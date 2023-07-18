import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '../shared.service';
import { Firestore } from '@angular/fire/firestore';
import { DialogLogInComponent } from '../dialog-log-in/dialog-log-in.component';

@Component({
  selector: 'app-legal-notice',
  templateUrl: './legal-notice.component.html',
  styleUrls: ['./legal-notice.component.scss']
})
export class LegalNoticeComponent implements OnInit{

  constructor(public dialog: MatDialog, private sharedService: SharedService, private firestore: Firestore) { }
  
  ngOnInit(): void {
    let id = this.sharedService.getCurrentUserId();
    if (id == undefined) {
      this.dialog.open(DialogLogInComponent);
    }     
  }
}
