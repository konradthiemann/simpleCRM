import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLogInComponent } from './dialog-log-in.component';

describe('DialogLogInComponent', () => {
  let component: DialogLogInComponent;
  let fixture: ComponentFixture<DialogLogInComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogLogInComponent]
    });
    fixture = TestBed.createComponent(DialogLogInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
