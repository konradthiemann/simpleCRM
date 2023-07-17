import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddFinanceComponent } from './dialog-add-finance.component';

describe('DialogAddFinanceComponent', () => {
  let component: DialogAddFinanceComponent;
  let fixture: ComponentFixture<DialogAddFinanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAddFinanceComponent]
    });
    fixture = TestBed.createComponent(DialogAddFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
