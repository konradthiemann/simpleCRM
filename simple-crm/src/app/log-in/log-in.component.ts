import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogLogInComponent } from '../dialog-log-in/dialog-log-in.component';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit{
  constructor(
    public dialog: MatDialog,
  ) { }
ngOnInit(): void {
  this.dialog.open(DialogLogInComponent, {
    enterAnimationDuration: '450ms',
    exitAnimationDuration: '450ms'
  });
}
}
