import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogLogInComponent } from './dialog-log-in/dialog-log-in.component';
import { Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('drawer') drawer: MatDrawer | undefined;

  closeDrawer() {
    if (this.drawer && this.isMobileView) {
      this.drawer.close();
    }
  }

  constructor(
    public dialog: MatDialog,
    private router: Router,
  ) {
    this.checkViewport();
    window.addEventListener('resize', this.checkViewport.bind(this));
  }

  isMobileView = false;

  
  openLogInDialog() {
    this.router.navigate(['/log-in']);
  }

  checkViewport() {
    this.isMobileView = window.innerWidth <= 600;
  }

  title = 'simple-crm';
}
