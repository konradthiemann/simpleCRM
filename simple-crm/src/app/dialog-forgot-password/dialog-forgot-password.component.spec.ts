import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogForgotPasswordComponent } from './dialog-forgot-password.component';

describe('DialogForgotPasswordComponent', () => {
  let component: DialogForgotPasswordComponent;
  let fixture: ComponentFixture<DialogForgotPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogForgotPasswordComponent]
    });
    fixture = TestBed.createComponent(DialogForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
