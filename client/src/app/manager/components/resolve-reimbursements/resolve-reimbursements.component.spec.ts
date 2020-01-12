import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolveReimbursementsComponent } from './resolve-reimbursements.component';

describe('ResolveReimbursementsComponent', () => {
  let component: ResolveReimbursementsComponent;
  let fixture: ComponentFixture<ResolveReimbursementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolveReimbursementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolveReimbursementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
