import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectReimbursementButtonComponent } from './reject-reimbursement-button.component';

describe('RejectReimbursementButtonComponent', () => {
  let component: RejectReimbursementButtonComponent;
  let fixture: ComponentFixture<RejectReimbursementButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectReimbursementButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectReimbursementButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
