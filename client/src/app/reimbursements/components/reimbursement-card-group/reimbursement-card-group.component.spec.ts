import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementCardGroupComponent } from './reimbursement-card-group.component';

describe('ReimbursementCardGroupComponent', () => {
  let component: ReimbursementCardGroupComponent;
  let fixture: ComponentFixture<ReimbursementCardGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReimbursementCardGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimbursementCardGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
