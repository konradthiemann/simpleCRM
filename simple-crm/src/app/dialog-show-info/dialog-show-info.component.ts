import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-show-info',
  templateUrl: './dialog-show-info.component.html',
  styleUrls: ['./dialog-show-info.component.scss'],
  styles: [`
    :host {
      border-radius: 15px;
    }
  `]
})
export class DialogShowInfoComponent {

  

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {
}

}
