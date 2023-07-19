import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChangePasswordSuccessfulComponent } from './dialog-change-password-successful.component';

describe('DialogChangePasswordSuccessfulComponent', () => {
  let component: DialogChangePasswordSuccessfulComponent;
  let fixture: ComponentFixture<DialogChangePasswordSuccessfulComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogChangePasswordSuccessfulComponent]
    });
    fixture = TestBed.createComponent(DialogChangePasswordSuccessfulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
