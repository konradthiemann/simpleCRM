import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogShowNoteComponent } from './dialog-show-note.component';

describe('DialogShowNoteComponent', () => {
  let component: DialogShowNoteComponent;
  let fixture: ComponentFixture<DialogShowNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogShowNoteComponent]
    });
    fixture = TestBed.createComponent(DialogShowNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
