import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-show-note',
  templateUrl: './dialog-show-note.component.html',
  styleUrls: ['./dialog-show-note.component.scss']
})
export class DialogShowNoteComponent implements OnInit{

  ngOnInit(): void {
    this.note = this.user['note'];
  }

  user:any;
  userId:any;
  note:any;
}
