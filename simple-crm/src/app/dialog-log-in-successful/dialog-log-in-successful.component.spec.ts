import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLogInSuccessfulComponent } from './dialog-log-in-successful.component';

describe('DialogLogInSuccessfulComponent', () => {
  let component: DialogLogInSuccessfulComponent;
  let fixture: ComponentFixture<DialogLogInSuccessfulComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogLogInSuccessfulComponent]
    });
    fixture = TestBed.createComponent(DialogLogInSuccessfulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
