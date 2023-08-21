import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogShowInfoComponent } from './dialog-show-info.component';

describe('DialogShowInfoComponent', () => {
  let component: DialogShowInfoComponent;
  let fixture: ComponentFixture<DialogShowInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogShowInfoComponent]
    });
    fixture = TestBed.createComponent(DialogShowInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
