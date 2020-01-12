import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveReimbursementButtonComponent } from './approve-reimbursement-button.component';

describe('ApproveReimbursementButtonComponent', () => {
  let component: ApproveReimbursementButtonComponent;
  let fixture: ComponentFixture<ApproveReimbursementButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveReimbursementButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveReimbursementButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
