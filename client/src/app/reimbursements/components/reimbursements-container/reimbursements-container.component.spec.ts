import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementsContainerComponent } from './reimbursements-container.component';

describe('ReimbursementsContainerComponent', () => {
  let component: ReimbursementsContainerComponent;
  let fixture: ComponentFixture<ReimbursementsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReimbursementsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimbursementsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
