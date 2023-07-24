import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogLogInComponent } from './dialog-log-in/dialog-log-in.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(public dialog: MatDialog,private router: Router,){}

  openLogInDialog(){
    this.router.navigate(['/log-in']);
  }


  title = 'simple-crm';
}
