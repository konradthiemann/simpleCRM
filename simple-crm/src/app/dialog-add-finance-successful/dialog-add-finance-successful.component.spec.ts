import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddFinanceSuccessfulComponent } from './dialog-add-finance-successful.component';

describe('DialogAddFinanceSuccessfulComponent', () => {
  let component: DialogAddFinanceSuccessfulComponent;
  let fixture: ComponentFixture<DialogAddFinanceSuccessfulComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAddFinanceSuccessfulComponent]
    });
    fixture = TestBed.createComponent(DialogAddFinanceSuccessfulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
