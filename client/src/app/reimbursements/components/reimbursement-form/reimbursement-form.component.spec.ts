import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementFormComponent } from './reimbursement-form.component';

describe('ReimbursementFormComponent', () => {
  let component: ReimbursementFormComponent;
  let fixture: ComponentFixture<ReimbursementFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReimbursementFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimbursementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
