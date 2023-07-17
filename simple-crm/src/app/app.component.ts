import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogLogInComponent } from './dialog-log-in/dialog-log-in.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(public dialog: MatDialog){}

  openLogInDialog(){
    this.dialog.open(DialogLogInComponent)
  }


  title = 'simple-crm';
}
